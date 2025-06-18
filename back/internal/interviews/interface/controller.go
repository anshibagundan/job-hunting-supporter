package _interface

import (
	"fmt"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/usecase"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func NewInterviewController(useCase *usecase.InterviewUseCase) *InterviewController {
	return &InterviewController{useCase: useCase}
}

type InterviewController struct {
	useCase *usecase.InterviewUseCase
}

func (c *InterviewController) CreateInterview(ctx *gin.Context) {
	var interview domain.Interview
	if err := ctx.ShouldBindJSON(&interview); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.CreateInterview(&interview); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create Interview"})
		return
	}

	ctx.JSON(201, gin.H{"message": "Interview created successfully"})
}

func (c *InterviewController) GetInterview(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Interview ID"})
		return
	}

	interview, err := c.useCase.GetInterview(uint(id))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Interview not found"})
		return
	}

	ctx.JSON(200, interview)
}

func (c *InterviewController) GetAllInterviews(ctx *gin.Context) {
	interviews, err := c.useCase.GetAllInterviews()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Interviews"})
		return
	}

	ctx.JSON(200, interviews)
}

func (c *InterviewController) UpdateInterview(ctx *gin.Context) {
	var interview domain.Interview
	if err := ctx.ShouldBindJSON(&interview); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.UpdateInterview(&interview); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update Interview"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Interview updated successfully"})
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

func (c *InterviewController) UploadAudio(ctx *gin.Context) {
	fmt.Printf("Uploading audio file...\n")
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	fmt.Printf("File received: %s\n", file.Filename)

	// 保存例: ./uploads/ に保存する
	savePath := fmt.Sprintf("../../../../uploads/%s", file.Filename)
	if err := ctx.SaveUploadedFile(file, savePath); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}
	fmt.Printf("File saved to: %s\n", savePath)

	// ここで音声ファイルの処理を行う
	transcript, err := c.useCase.Transcribe(savePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to transcribe audio"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "upload successful", "path": savePath, "transcript": transcript})
}
