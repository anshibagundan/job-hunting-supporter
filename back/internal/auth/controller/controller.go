package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/anshibagundan/job-hunting-supporter/internal/user/usecase"
	"github.com/anshibagundan/job-hunting-supporter/pkg/auth"
	"github.com/anshibagundan/job-hunting-supporter/pkg/firebase"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	userUseCase *usecase.UserUseCase
}

func NewAuthController(userUseCase *usecase.UserUseCase) *AuthController {
	return &AuthController{
		userUseCase: userUseCase,
	}
}

type FirebaseLoginRequest struct {
	IDToken string `json:"idToken" binding:"required"`
}

// LoginWithFirebase handles Firebase authentication
func (a *AuthController) LoginWithFirebase(c *gin.Context) {
	var req FirebaseLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Firebase IDトークンを検証
	firebaseToken, err := firebase.VerifyIDToken(req.IDToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Firebase token"})
		return
	}

	// FirebaseユーザーIDでユーザーを検索
	user, err := a.userUseCase.GetUserByFirebaseUID(firebaseToken.UID)
	if err != nil {
		fmt.Printf("Error getting user: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// JWTトークンを生成
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Cookieにトークンを設定
	c.SetSameSite(http.SameSiteLaxMode) // CSRF対策
	c.SetCookie(
		"auth_token",                  // name
		token,                         // value
		int(24*time.Hour/time.Second), // maxAge (24時間)
		"/",                           // path
		"",                            // domain
		false,                         // secure (本番ではtrue)
		true,                          // httpOnly
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"id":    user.ID,
			"email": user.Email,
			"name":  user.Name,
		},
	})
}

// Logout handles user logout
func (a *AuthController) Logout(c *gin.Context) {
	// Cookieを削除
	c.SetCookie(
		"auth_token",
		"",
		-1, // 即座に期限切れ
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

// GetCurrentUser returns the current user information
func (a *AuthController) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	// TODO: ここで実際のユーザー情報をDBから取得
	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"email":   "test@example.com",
		"name":    "Test User",
	})
}
