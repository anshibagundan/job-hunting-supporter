package controller

import (
	"strconv"
	"time"

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
		Name    *string `json:"name"`
		BasicES *string `json:"basic_es"`
		Icon    *string `json:"icon"`
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
