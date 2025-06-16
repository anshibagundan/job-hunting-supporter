// main.go
package main

import (
	"fmt"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/infrastructure"
	_interface "github.com/anshibagundan/job-hunting-supporter/internal/user/interface"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/usecase"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rollbar/rollbar-go"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"net/http"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
	env := os.Getenv("ENV")
	if env == "staging" {
		fmt.Println("environment: staging")
	} else if env == "local" {
		fmt.Println("environment: local")
	} else if env == "production-migrating" {
		fmt.Println("environment: production-migrating")
	} else {
		fmt.Println("Error loading .env file")
	}

	// データベース接続の初期化
	db, err := initDB()
	if err != nil {
		log.Fatal(err)
	}

	if env == "production-migrating" {
		fmt.Println("OS Exit")
		os.Exit(0)
	}

	//store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		log.Fatal("環境変数 OPENAI_API_KEY が設定されていません")
	}

	// DI の設定
	userRepo := infrastructure.NewUserRepository(db)
	userUseCase := usecase.NewUserUseCase(userRepo)
	userController := _interface.NewUserController(userUseCase)

	router := gin.Default()

	//router.Use(middleware.CORS())

	// ルーティングの設定
	router.Handle("GET", "/health", health)
	api := router.Group("/api")
	{
		users := api.Group("/users")
		{
			users.POST("", userController.CreateUser)       // POST /api/users
			users.GET("/:id", userController.GetUser)       // GET /api/users/:id
			users.GET("", userController.GetAllUsers)       // GET /api/users
			users.PUT("", userController.UpdateUser)        // PUT /api/users
			users.DELETE("/:id", userController.DeleteUser) // DELETE /api/users/:id
		}
	}

	log.Fatal(http.ListenAndServe(":8080", router))
}

// DB接続の初期化
func initDB() (*gorm.DB, error) {
	// .envファイルの読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// 環境変数から接続情報を取得
	var dbName string
	env := os.Getenv("ENV")
	switch env {
	case "staging":
		dbName = os.Getenv("DB_NAME_STAGING")
	case "production-migrating":
		dbName = os.Getenv("DB_NAME_PRODUCTION")
	default:
		dbName = os.Getenv("DB_NAME")
	}
	if dbName == "" {
		return nil, fmt.Errorf("DB_NAME is not set")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	// 接続文字列の構築
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&multiStatements=true",
		dbUser, dbPassword, dbHost, dbPort, dbName,
	)

	// データベースに接続
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}

	_, err = db.DB()
	if err != nil {
		rollbar.Error(err)
		panic(err)
	}

	db.Logger = db.Logger.LogMode(logger.Info)

	fmt.Println("DB migrated")

	return db, nil
}

func health(c *gin.Context) {
	health := "ok"
	c.JSON(200, health)
}
