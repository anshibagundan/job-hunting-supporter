// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	// 生成AI関連
	genai_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/infrastructure"

	// 認証関連
	auth_controller "github.com/anshibagundan/job-hunting-supporter/internal/auth/controller"
	user_controller "github.com/anshibagundan/job-hunting-supporter/internal/user/controller"
	"github.com/anshibagundan/job-hunting-supporter/pkg/auth"
	"github.com/anshibagundan/job-hunting-supporter/pkg/firebase"
	// ユーザー関連
	user_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/user/infrastructure"
	user_usecase "github.com/anshibagundan/job-hunting-supporter/internal/user/usecase"

	company_controller "github.com/anshibagundan/job-hunting-supporter/internal/companies/controller"
	// 企業関連
	company_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/companies/infrastructure"
	company_usecase "github.com/anshibagundan/job-hunting-supporter/internal/companies/usecase"

	interview_controller "github.com/anshibagundan/job-hunting-supporter/internal/interviews/controller"
	// 面接関連
	interview_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/interviews/infrastructure"
	interview_usecase "github.com/anshibagundan/job-hunting-supporter/internal/interviews/usecase"

	jobevent_controller "github.com/anshibagundan/job-hunting-supporter/internal/job_events/controller"
	// ジョブイベント関連
	jobevent_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/job_events/infrastructure"
	jobevent_usecase "github.com/anshibagundan/job-hunting-supporter/internal/job_events/usecase"

	companyes_controller "github.com/anshibagundan/job-hunting-supporter/internal/company_es/controller"
	// 企業ES関連
	companyes_infrastructure "github.com/anshibagundan/job-hunting-supporter/internal/company_es/infrastructure"
	companyes_usecase "github.com/anshibagundan/job-hunting-supporter/internal/company_es/usecase"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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
	// 既存の機能用（音声転写など）
	genAIClient := genai_infrastructure.NewGenAIClient(os.Getenv("GEMINI_API_KEY"))
	// ES分析専用
	esAnalysisClient := genai_infrastructure.NewGenAIClient(os.Getenv("AI_ANALYZE_API_KEY"))

	userRepo := user_infrastructure.NewUserRepository(db)
	userUseCase := user_usecase.NewUserUseCase(userRepo)
	userController := user_controller.NewUserController(userUseCase)

	companyRepo := company_infrastructure.NewCompanyRepository(db)
	companyUseCase := company_usecase.NewCompanyUseCase(companyRepo)
	companyController := company_controller.NewCompanyController(companyUseCase)

	interviewRepo := interview_infrastructure.NewInterviewRepository(db)
	interviewSerevice := interview_infrastructure.NewInterviewService(db)
	interviewUseCase := interview_usecase.NewInterviewUseCase(interviewRepo, interviewSerevice, genAIClient)
	interviewController := interview_controller.NewInterviewController(interviewUseCase)

	jobEventRepo := jobevent_infrastructure.NewJobEventRepository(db)
	jobEventUseCase := jobevent_usecase.NewJobEventUseCase(jobEventRepo)
	jobEventController := jobevent_controller.NewJobEventController(jobEventUseCase)

	companyESRepo := companyes_infrastructure.NewCompanyESRepository(db)
	companyESUseCase := companyes_usecase.NewCompanyESUseCase(companyESRepo, esAnalysisClient)
	companyESController := companyes_controller.NewCompanyESController(companyESUseCase)

	// JWT初期化
	auth.InitJWT()

	// Firebase Admin SDK初期化
	if err := firebase.InitFirebaseAdmin(); err != nil {
		log.Printf("Firebase initialization failed: %v", err)
	}

	// 認証コントローラー初期化
	authController := auth_controller.NewAuthController(userUseCase)

	router := gin.Default()

	//router.Use(middleware.CORS())
	// CORSの設定
	router.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			// 必要に応じて複数オリジン対応も可能
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Header("Access-Control-Allow-Credentials", "true") // 認証系があるなら必須

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// ルーティングの設定
	router.Handle("GET", "/health", health)
	api := router.Group("/api")
	{
		// 認証エンドポイント（認証不要）
		api.POST("/auth/firebase-login", authController.LoginWithFirebase)
		api.POST("/auth/logout", authController.Logout)

		// 認証が必要なエンドポイント
		protected := api.Group("")
		//protected.Use(middleware.AuthRequired())
		{
			protected.GET("/auth/me", authController.GetCurrentUser)

			// 認証が必要なエンドポイント
			interviews := protected.Group("/interviews")
			{
				interviews.POST("", interviewController.CreateInterview)                     // JSON用
				interviews.POST("/with-audio", interviewController.CreateInterviewWithAudio) // FormData用
				interviews.GET("/:id", interviewController.GetInterview)
				interviews.GET("", interviewController.GetAllInterviews)
				interviews.PUT("/:id", interviewController.UpdateInterview)
				interviews.DELETE("/:id", interviewController.DeleteInterview)
				interviews.GET("/user/:userID", interviewController.GetInterviewsByUserID)
				interviews.GET("/company/:companyID", interviewController.GetInterviewsByCompanyID)
				interviews.POST("/upload-audio", interviewController.UploadAudio)
			}
		}
		users := api.Group("/users")
		{
			users.POST("", userController.CreateUser)                                 // POST /api/users
			users.POST("/sync", userController.SyncFirebaseUser)                      // POST /api/users/sync
			users.GET("/:id", userController.GetUser)                                 // GET /api/users/:id
			users.GET("/firebase/:firebase_uid", userController.GetUserByFirebaseUID) // GET /api/users/firebase/:firebase_uid
			users.GET("", userController.GetAllUsers)                                 // GET /api/users
			users.PUT("/:id", userController.UpdateUser)                              // PUT /api/users/:id
			users.DELETE("/:id", userController.DeleteUser)                           // DELETE /api/users/:id
		}

		companies := api.Group("/companies")
		{
			companies.POST("", companyController.CreateCompany)       // POST /api/companies
			companies.GET("/:id", companyController.GetCompany)       // GET /api/companies/:id
			companies.GET("", companyController.GetAllCompanies)      // GET /api/companies
			companies.PUT("", companyController.UpdateCompany)        // PUT /api/companies
			companies.DELETE("/:id", companyController.DeleteCompany) // DELETE /api/companies/:id
		}

		jobEvents := api.Group("/job-events")
		{
			jobEvents.POST("", jobEventController.CreateJobEvent)                            // POST /api/job-events
			jobEvents.GET("/:id", jobEventController.GetJobEvent)                            // GET /api/job-events/:id
			jobEvents.GET("", jobEventController.GetAllJobEvents)                            // GET /api/job-events
			jobEvents.GET("/company/:companyID", jobEventController.GetJobEventsByCompanyID) // GET /api/job-events/company/:companyID
			jobEvents.GET("/user/:userID", jobEventController.GetJobEventsByUserID)          // GET /api/job-events/user/:userID
			jobEvents.PUT("", jobEventController.UpdateJobEvent)                             // PUT /api/job-events
			jobEvents.DELETE("/:id", jobEventController.DeleteJobEvent)                      // DELETE /api/job-events/:id
		}

		companyESs := api.Group("/company-es")
		{
			companyESs.POST("", companyESController.CreateCompanyES)                                                 // POST /api/company-es
			companyESs.GET("/:id", companyESController.GetCompanyES)                                                 // GET /api/company-es/:id
			companyESs.GET("", companyESController.GetAllCompanyESs)                                                 // GET /api/company-es
			companyESs.GET("/user/:userID", companyESController.GetCompanyESsByUserID)                               // GET /api/company-es/user/:userID
			companyESs.GET("/company/:companyID", companyESController.GetCompanyESsByCompanyID)                      // GET /api/company-es/company/:companyID
			companyESs.GET("/user/:userID/company/:companyID", companyESController.GetCompanyESByUserIDAndCompanyID) // GET /api/company-es/user/:userID/company/:companyID
			companyESs.PUT("/:id", companyESController.UpdateCompanyES)                                              // PUT /api/company-es/:id
			companyESs.DELETE("/:id", companyESController.DeleteCompanyES)                                           // DELETE /api/company-es/:id
			companyESs.POST("/analyze", companyESController.AnalyzeCompanyES)                                        // POST /api/company-es/analyze
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
