package controller

import (
	"fmt"
	"strconv"

	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/usecase"
	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
	"github.com/gin-gonic/gin"
)

// CreateCompanyESRequest represents the request payload for creating CompanyES
type CreateCompanyESRequest struct {
	UserID      uint                     `json:"user_id" binding:"required"`
	CompanyID   uint                     `json:"company_id" binding:"required"`
	Title       string                   `json:"title" binding:"required"`
	Content     string                   `json:"content" binding:"required"`
	Summary     string                   `json:"summary"`
	Advice      string                   `json:"advice"`
	AdviceItems []genaidomain.AdviceItem `json:"advice_items"`
}

// UpdateCompanyESRequest represents the request payload for updating CompanyES
type UpdateCompanyESRequest struct {
	ID          uint                     `json:"id" binding:"required"`
	UserID      uint                     `json:"user_id" binding:"required"`
	CompanyID   uint                     `json:"company_id" binding:"required"`
	Title       string                   `json:"title" binding:"required"`
	Content     string                   `json:"content" binding:"required"`
	Summary     string                   `json:"summary"`
	Advice      string                   `json:"advice"`
	AdviceItems []genaidomain.AdviceItem `json:"advice_items"`
}

func NewCompanyESController(useCase *usecase.CompanyESUseCase) *CompanyESController {
	return &CompanyESController{useCase: useCase}
}

type CompanyESController struct {
	useCase *usecase.CompanyESUseCase
}

func (c *CompanyESController) CreateCompanyES(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateCompanyESRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// DTOからドメインエンティティに変換
	companyES := domain.CompanyES{
		UserID:      userID.(uint), // 認証ミドルウェアから UserID を取得
		CompanyID:   req.CompanyID,
		Title:       req.Title,
		Content:     req.Content,
		AISummary:   req.Summary,
		AIAdvice:    req.Advice,
		AdviceItems: domain.AdviceItemsJSON(req.AdviceItems),
	}

	if err := c.useCase.CreateCompanyES(&companyES); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create CompanyES", "details": err.Error()})
		return
	}

	ctx.JSON(201, companyES)
}

func (c *CompanyESController) GetCompanyES(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid CompanyES ID"})
		return
	}

	// 認証ミドルウェアから UserID を取得
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized access"})
		return
	}

	fmt.Printf("Fetching CompanyES with ID: %d for UserID: %d\n", id, userID)

	companyES, err := c.useCase.GetCompanyESWithCompany(uint(id), userID.(uint))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "CompanyES not found"})
		return
	}

	ctx.JSON(200, companyES)
}

func (c *CompanyESController) GetCompanyESsByUserID(ctx *gin.Context) {
	userIDStr := ctx.Param("userID")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID"})
		return
	}

	companyESs, err := c.useCase.GetCompanyESsByUserIDWithCompany(uint(userID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) GetCompanyESsByCompanyID(ctx *gin.Context) {
	companyIDStr := ctx.Param("companyID")
	companyID, err := strconv.Atoi(companyIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Company ID"})
		return
	}

	// 認証ミドルウェアから UserID を取得
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// ユーザーIDと企業IDで絞り込んで取得
	companyESs, err := c.useCase.GetCompanyESsByCompanyIDWithCompany(uint(companyID), userID.(uint))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) GetCompanyESByUserIDAndCompanyID(ctx *gin.Context) {
	userIDStr := ctx.Param("userID")
	companyIDStr := ctx.Param("companyID")

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID"})
		return
	}

	companyID, err := strconv.Atoi(companyIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Company ID"})
		return
	}

	companyESs, err := c.useCase.GetCompanyESByUserIDAndCompanyIDWithCompany(uint(userID), uint(companyID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) GetAllCompanyESs(ctx *gin.Context) {
	// 認証ミドルウェアから UserID を取得
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	companyESs, err := c.useCase.GetAllCompanyESsWithCompany(userID.(uint))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) UpdateCompanyES(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid CompanyES ID"})
		return
	}

	var req UpdateCompanyESRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// DTOからドメインエンティティに変換
	companyES := domain.CompanyES{
		ID:          uint(id),
		UserID:      userID.(uint), // 認証ミドルウェアから UserID を取得
		CompanyID:   req.CompanyID,
		Title:       req.Title,
		Content:     req.Content,
		AISummary:   req.Summary,
		AIAdvice:    req.Advice,
		AdviceItems: domain.AdviceItemsJSON(req.AdviceItems),
	}

	if err := c.useCase.UpdateCompanyES(&companyES, userID.(uint)); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update CompanyES", "details": err.Error()})
		return
	}

	// 更新されたエンティティを企業情報と一緒に返す
	updatedCompanyES, err := c.useCase.GetCompanyESWithCompany(uint(id), userID.(uint))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch updated CompanyES"})
		return
	}

	ctx.JSON(200, updatedCompanyES)
}

func (c *CompanyESController) DeleteCompanyES(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid CompanyES ID"})
		return
	}

	// 認証ミドルウェアから UserID を取得
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	if err := c.useCase.DeleteCompanyES(uint(id), userID.(uint)); err != nil {
		ctx.JSON(404, gin.H{"error": "CompanyES not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "CompanyES deleted successfully"})
}

type AnalyzeRequest struct {
	Content   string `json:"content" binding:"required"`
	CompanyID uint   `json:"company_id" binding:"required"`
}

type AnalyzeResponse struct {
	Summary     string                   `json:"summary"`
	Advice      string                   `json:"advice"`
	AdviceItems []genaidomain.AdviceItem `json:"adviceItems"`
}

func (c *CompanyESController) AnalyzeCompanyES(ctx *gin.Context) {
	var req AnalyzeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	summary, advice, adviceItems, err := c.useCase.AnalyzeContentWithCompany(req.Content, req.CompanyID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to analyze content"})
		return
	}

	response := AnalyzeResponse{
		Summary:     summary,
		Advice:      advice,
		AdviceItems: adviceItems,
	}

	ctx.JSON(200, response)
}

type GenerateESRequest struct {
	BaseES             string `json:"base_es" binding:"required"`
	CompanyDescription string `json:"company_description" binding:"required"`
	ESTitle            string `json:"es_title" binding:"required"`
}

type GenerateESResponse struct {
	Content string `json:"content"`
}

// GenerateESContent - ES内容の自動生成エンドポイント
func (c *CompanyESController) GenerateESContent(ctx *gin.Context) {
	var req GenerateESRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	content, err := c.useCase.GenerateESContent(req.BaseES, req.CompanyDescription, req.ESTitle)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to generate ES content", "details": err.Error()})
		return
	}

	response := GenerateESResponse{
		Content: content,
	}

	ctx.JSON(200, response)
}
