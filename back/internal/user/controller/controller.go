package controller

import (
	"strconv"
	"time"

	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/usecase"
	"github.com/anshibagundan/job-hunting-supporter/pkg/auth"
	"github.com/gin-gonic/gin"
)

func NewUserController(useCase *usecase.UserUseCase) *UserController {
	return &UserController{useCase: useCase}
}

type UserController struct {
	useCase *usecase.UserUseCase
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var user domain.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.CreateUser(&user); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create user"})
		return
	}

	ctx.JSON(201, gin.H{"message": "User created successfully"})
}

func (c *UserController) GetUser(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := c.useCase.GetUser(uint(id))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(200, user)
}

func (c *UserController) GetAllUsers(ctx *gin.Context) {
	users, err := c.useCase.GetAllUsers()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch users"})
		return
	}

	ctx.JSON(200, users)
}

func (c *UserController) UpdateUser(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	// 部分更新のためのリクエスト構造体
	var updateRequest struct {
		Name           *string `json:"name"`
		BasicES        *string `json:"basic_es"`
		Icon           *string `json:"icon"`
		AnalyzeBaseES  *bool   `json:"analyze_base_es"`  // base_es分析を実行するかどうか
	}

	if err := ctx.ShouldBindJSON(&updateRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	// 更新するフィールドのマップを作成
	updates := make(map[string]interface{})
	if updateRequest.Name != nil {
		updates["name"] = *updateRequest.Name
	}
	if updateRequest.BasicES != nil {
		updates["basic_es"] = *updateRequest.BasicES
	}
	if updateRequest.Icon != nil {
		updates["icon"] = *updateRequest.Icon
	}

	// base_es分析を実行する場合
	if updateRequest.AnalyzeBaseES != nil && *updateRequest.AnalyzeBaseES && updateRequest.BasicES != nil && *updateRequest.BasicES != "" {
		summary, _, adviceItems, err := c.useCase.AnalyzeBaseESContent(*updateRequest.BasicES)
		if err == nil {
			// 分析が成功した場合、結果も保存
			adviceItemsJSON := domain.AdviceItemsJSON(adviceItems)
			updates["summary"] = summary
			updates["advice_items"] = adviceItemsJSON
		}
		// 分析に失敗しても更新は続行
	}

	// 部分更新を実行
	if err := c.useCase.UpdateUserPartial(uint(id), updates); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update user"})
		return
	}

	// 更新されたユーザー情報を返す
	updatedUser, err := c.useCase.GetUser(uint(id))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch updated user"})
		return
	}

	ctx.JSON(200, updatedUser)
}

func (c *UserController) DeleteUser(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}
	if err := c.useCase.DeleteUser(uint(id)); err != nil {
		ctx.JSON(404, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "User deleted successfully"})
}

type FirebaseUserRequest struct {
	FirebaseUID string `json:"firebase_uid" binding:"required"`
	Email       string `json:"email" binding:"required"`
	Name        string `json:"name" binding:"required"`
	PhotoURL    string `json:"photo_url"`
}

func (c *UserController) SyncFirebaseUser(ctx *gin.Context) {
	var req FirebaseUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	var user *domain.User

	// Check if user already exists
	existingUser, err := c.useCase.GetUserByFirebaseUID(req.FirebaseUID)
	if err == nil && existingUser != nil {
		// User already exists
		user = existingUser
	} else {
		// Create new user
		newUser := &domain.User{
			FirebaseUID: req.FirebaseUID,
			Email:       req.Email,
			Name:        req.Name,
			Icon:        req.PhotoURL,
			BasicES:     "",
		}

		if err := c.useCase.CreateUser(newUser); err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}
		user = newUser
	}

	// Generate JWT token
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set JWT token as HttpOnly cookie
	ctx.SetCookie(
		"auth_token",
		token,
		int(24*time.Hour/time.Second), // 24 hours
		"/",
		"",
		false, // secure (set to true in production with HTTPS)
		true,  // httpOnly
	)

	ctx.JSON(200, gin.H{
		"user":    user,
		"message": "Authentication successful",
	})
}

func (c *UserController) GetUserByFirebaseUID(ctx *gin.Context) {
	firebaseUID := ctx.Param("firebase_uid")
	if firebaseUID == "" {
		ctx.JSON(400, gin.H{"error": "Firebase UID is required"})
		return
	}

	user, err := c.useCase.GetUserByFirebaseUID(firebaseUID)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(200, user)
}

// 基本ES分析用の型定義
type AnalyzeBaseESRequest struct {
	Content   string `json:"content" binding:"required"`
	UserID    uint   `json:"user_id"`    // オプション: 分析結果をユーザープロファイルに保存する場合
	SaveToProfile bool `json:"save_to_profile"` // 分析結果をプロファイルに保存するかどうか
}

type AnalyzeBaseESResponse struct {
	Summary     string                   `json:"summary"`
	Advice      string                   `json:"advice"`
	AdviceItems []genaidomain.AdviceItem `json:"adviceItems"`
}

// AnalyzeBaseES - 基本ESの分析エンドポイント
func (c *UserController) AnalyzeBaseES(ctx *gin.Context) {
	var req AnalyzeBaseESRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	summary, advice, adviceItems, err := c.useCase.AnalyzeBaseESContent(req.Content)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to analyze content"})
		return
	}

	// 分析結果をユーザープロファイルに保存する場合
	if req.SaveToProfile && req.UserID > 0 {
		if err := c.useCase.SaveBaseESAnalysisToProfile(req.UserID, summary, adviceItems); err != nil {
			// 保存に失敗してもレスポンスは返す（警告ログは出力）
			ctx.Header("X-Warning", "Failed to save analysis to profile")
		}
	}

	response := AnalyzeBaseESResponse{
		Summary:     summary,
		Advice:      advice,
		AdviceItems: adviceItems,
	}

	ctx.JSON(200, response)
}
