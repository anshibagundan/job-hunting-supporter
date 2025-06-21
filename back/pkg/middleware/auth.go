package middleware

import (
	"net/http"

	"github.com/anshibagundan/job-hunting-supporter/pkg/auth"
	"github.com/gin-gonic/gin"
)

// AuthRequired middleware checks for valid JWT in cookie
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Cookieからトークンを取得
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No authentication token provided"})
			c.Abort()
			return
		}

		// トークンを検証
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// UserIDをコンテキストに設定
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// GetUserID gets the user ID from context
func GetUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		return 0, false
	}
	return userID.(uint), true
}