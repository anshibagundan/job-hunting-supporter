package controller

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/usecase"
	"github.com/gin-gonic/gin"
)

func NewInterviewController(useCase *usecase.InterviewUseCase) *InterviewController {
	return &InterviewController{useCase: useCase}
}

type InterviewController struct {
	useCase *usecase.InterviewUseCase
}

func (c *InterviewController) CreateInterview(ctx *gin.Context) {
	fmt.Printf("Creating interview...\n")

	var interview domain.Interview
	if err := ctx.ShouldBindJSON(&interview); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		ctx.JSON(400, gin.H{"error": fmt.Sprintf("Invalid input: %v", err)})
		return
	}

	// 認証ミドルウェアから UserID を取得
	if userID, exists := ctx.Get("userID"); exists {
		interview.UserID = userID.(uint)
	} else if interview.UserID == 0 {
		// 開発用フォールバック（JWT実装後は削除）
		interview.UserID = 1
	}

	// デバッグ: 受信したデータを確認
	fmt.Printf("Received interview data: %+v\n", interview)

	// 音声ファイルは後で別エンドポイントでアップロード可能
	// 今は音声ファイル無しでも面接記録を作成できるようにする

	if err := c.useCase.CreateInterview(&interview); err != nil {
		fmt.Printf("Error creating interview: %v\n", err)
		ctx.JSON(500, gin.H{"error": "Failed to create Interview"})
		return
	}

	ctx.JSON(201, gin.H{"message": "Interview created successfully", "id": interview.ID})
}

func (c *InterviewController) GetInterview(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Interview ID"})
		return
	}

	// Return interview with company information
	interview, err := c.useCase.GetInterviewWithCompany(uint(id))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Interview not found"})
		return
	}

	ctx.JSON(200, interview)
}

func (c *InterviewController) GetAllInterviews(ctx *gin.Context) {
	// Return interviews with company information
	interviews, err := c.useCase.GetAllInterviewsWithCompany()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Interviews"})
		return
	}
	fmt.Println("Fetched interviews:", interviews)
	ctx.JSON(200, interviews)
}

func (c *InterviewController) GetInterviewsByUserID(ctx *gin.Context) {
	userIDStr := ctx.Param("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID"})
		return
	}

	interviews, err := c.useCase.GetInterviewsByUserIDWithCompany(uint(userID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Interviews"})
		return
	}

	ctx.JSON(200, interviews)
}

func (c *InterviewController) GetInterviewsByCompanyID(ctx *gin.Context) {
	companyIDStr := ctx.Param("companyID")
	companyID, err := strconv.Atoi(companyIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Company ID"})
		return
	}

	interviews, err := c.useCase.GetInterviewsByCompanyIDWithCompany(uint(companyID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Interviews"})
		return
	}

	ctx.JSON(200, interviews)
}

func (c *InterviewController) UpdateInterview(ctx *gin.Context) {
	// URLパラメータからIDを取得
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Interview ID"})
		return
	}

	var interview domain.Interview
	if err := ctx.ShouldBindJSON(&interview); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		ctx.JSON(400, gin.H{"error": fmt.Sprintf("Invalid input: %v", err)})
		return
	}

	// IDを設定
	interview.ID = uint(id)	

	// 面接を更新
	if err := c.useCase.UpdateInterview(&interview); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update Interview"})
		return
	}

	ctx.JSON(200, gin.H{
		"message": "Interview updated successfully",
		"id":      interview.ID,
	})
}

func (c *InterviewController) DeleteInterview(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Interview ID"})
		return
	}
	if err := c.useCase.DeleteInterview(uint(id)); err != nil {
		ctx.JSON(404, gin.H{"error": "Interview not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Interview deleted successfully"})
}

// CreateInterviewWithAudio creates a new interview with audio file upload
func (c *InterviewController) CreateInterviewWithAudio(ctx *gin.Context) {
	fmt.Printf("Creating interview with audio...\n")

	// Parse multipart form
	if err := ctx.Request.ParseMultipartForm(32 << 20); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	// Get interview data from form
	var interview domain.Interview
	interview.UserID = parseUintFromForm(ctx, "user_id", 5)
	interview.CompanyID = parseUintFromForm(ctx, "company_id", 5)
	interview.JobEventID = parseUintFromForm(ctx, "job_event_id", 5)
	interview.Stage = ctx.PostForm("stage")
	interview.TextNote = ctx.PostForm("text_note")
	interview.Location = ctx.PostForm("location")
	interview.MeetingURL = ctx.PostForm("meeting_url")

	// デバッグ: 受信したデータを確認
	fmt.Printf("Received interview data: %+v\n", interview)

	// Parse interview date
	if interviewAt := ctx.PostForm("interview_at"); interviewAt != "" {
		if t, err := time.Parse(time.RFC3339, interviewAt); err == nil {
			interview.InterviewAt = t
		} else {
			interview.InterviewAt = time.Now()
		}
	} else {
		interview.InterviewAt = time.Now()
	}

	// Handle audio file
	file, err := ctx.FormFile("audio_file")
	if err == nil {
		savePath := filepath.Join(os.TempDir(), file.Filename)
		if err := ctx.SaveUploadedFile(file, savePath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "file save failed"})
			return
		}

		// Process audio file
		transcript, err := c.useCase.Transcribe(savePath)
		if err != nil {
			fmt.Printf("Error transcribing audio: %v\n", err)
			// Continue without transcript
		} else {
			interview.Transcript = transcript

			audioSummary, err := c.useCase.AnalyzeInterviewContent(transcript)
			if err != nil {
				fmt.Printf("Error analyzing interview content: %v\n", err)
				// Continue without audio summary
			} else {
				interview.AudioSummary = audioSummary
			}
		}
		interview.AudioFile = savePath
	}

	if err := c.useCase.CreateInterview(&interview); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create Interview"})
		return
	}

	ctx.JSON(201, gin.H{"message": "Interview created successfully", "id": interview.ID})
}

func (c *InterviewController) UpdateInterviewWithAudio(ctx *gin.Context) {
	fmt.Printf("Updating interview with audio...\n")

	// Parse multipart form
	if err := ctx.Request.ParseMultipartForm(32 << 20); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	// Get interview ID from URL parameter
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Interview ID"})
		return
	}

	var interview domain.Interview
	interview.ID = uint(id)
	interview.UserID = parseUintFromForm(ctx, "user_id", 5)
	interview.CompanyID = parseUintFromForm(ctx, "company_id", 5)
	interview.JobEventID = parseUintFromForm(ctx, "job_event_id", 5)
	interview.Stage = ctx.PostForm("stage")
	interview.TextNote = ctx.PostForm("text_note")
	interview.Location = ctx.PostForm("location")
	interview.MeetingURL = ctx.PostForm("meeting_url")

	if interviewAt := ctx.PostForm("interview_at"); interviewAt != "" {
		if t, err := time.Parse(time.RFC3339, interviewAt); err == nil {
			interview.InterviewAt = t
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview date format"})
			return
		}
	} else {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Interview date is required"})
		return
	}

	file, err := ctx.FormFile("audio_file")
	if err == nil {
		savePath := filepath.Join(os.TempDir(), file.Filename)
		if err := ctx.SaveUploadedFile(file, savePath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "file save failed"})
			return
		}

		transcript, err := c.useCase.Transcribe(savePath)
		if err != nil {
			fmt.Printf("Error transcribing audio: %v\n", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to transcribe audio"})
		} else {
			interview.Transcript = transcript

			audioSummary, err := c.useCase.AnalyzeInterviewContent(transcript)
			if err != nil {
				fmt.Printf("Error analyzing interview content: %v\n", err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to analyze interview content"})
				return
			} else {
				interview.AudioSummary = audioSummary
			}
		}
	}

}

func parseUintFromForm(ctx *gin.Context, key string, defaultValue uint) uint {
	if val := ctx.PostForm(key); val != "" {
		if parsed, err := strconv.ParseUint(val, 10, 32); err == nil {
			return uint(parsed)
		}
	}
	return defaultValue
}

func (c *InterviewController) UploadAudio(ctx *gin.Context) {
	fmt.Printf("Uploading audio file...\n")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	fmt.Printf("File received: %s\n", file.Filename)

	savePath := filepath.Join(os.TempDir(), file.Filename)
	if err := ctx.SaveUploadedFile(file, savePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "file save failed"})
		return
	}

	// ここで音声ファイルの処理を行う
	transcript, err := c.useCase.Transcribe(savePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to transcribe audio"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "upload successful", "path": savePath, "transcript": transcript})
}
