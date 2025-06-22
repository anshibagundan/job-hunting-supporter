package firebase

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
)

var authClient *auth.Client

// InitFirebaseAdmin initializes Firebase Admin SDK
func InitFirebaseAdmin() error {
	ctx := context.Background()

	// 環境変数から認証情報を読み込む場合
	// opt := option.WithCredentialsFile("path/to/serviceAccountKey.json")

	// デフォルト認証を使用（Google Cloud環境の場合）
	app, err := firebase.NewApp(ctx, nil)
	if err != nil {
		return fmt.Errorf("error initializing firebase app: %v", err)
	}

	authClient, err = app.Auth(ctx)
	if err != nil {
		return fmt.Errorf("error getting auth client: %v", err)
	}

	return nil
}

// VerifyIDToken verifies a Firebase ID token
func VerifyIDToken(idToken string) (*auth.Token, error) {
	token, err := authClient.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		return nil, err
	}
	return token, nil
}

// GetUser gets user information from Firebase
func GetUser(uid string) (*auth.UserRecord, error) {
	user, err := authClient.GetUser(context.Background(), uid)
	if err != nil {
		return nil, err
	}
	return user, nil
}
