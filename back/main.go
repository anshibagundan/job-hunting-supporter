// main.go
package main

import (
	"fmt"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/infrastructure"
	_interface "github.com/anshibagundan/job-hunting-supporter/internal/user/interface"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/usecase"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
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
		dbName = os.Getenv("POSTGRES_DB_STAGING")
	case "production-migrating":
		dbName = os.Getenv("POSTGRES_DB_PRODUCTION")
	default:
		dbName = os.Getenv("POSTGRES_DB")
	}
	if dbName == "" {
		return nil, fmt.Errorf("DB_NAME is not set")
	}

	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbHost := os.Getenv("POSTGRES_HOST")
	dbPort := os.Getenv("POSTGRES_PORT")

	// 接続文字列の構築 (PostgreSQLのDSN形式)
	// format: "host=host user=user password=password dbname=dbname port=port sslmode=disable TimeZone=Asia/Tokyo"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
		dbHost, dbUser, dbPassword, dbName, dbPort,
	)

	// データベースに接続
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		// GORMのロガー設定（任意）
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}

	// 実際のDB接続をテスト (Ping)
	sqlDB, err := db.DB()
	if err != nil {
		// rollbar.Error(err) // rollbarを使用している場合、ここに含める
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}
	if err = sqlDB.Ping(); err != nil {
		// rollbar.Error(err) // rollbarを使用している場合、ここに含める
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	fmt.Println("Successfully connected to the database.")

	// マイグレーションをここで行う場合（例）
	// fmt.Println("DB migrated") // ここでの"migrated"は単なるメッセージ。実際のマイグレーションロジックは別途必要。

	return db, nil
}

func health(c *gin.Context) {
	health := "ok"
	c.JSON(200, health)
}
