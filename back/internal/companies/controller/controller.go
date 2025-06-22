package controller

import (
	"strconv"

	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/usecase"
	"github.com/gin-gonic/gin"
)

func NewCompanyController(useCase *usecase.CompanyUseCase) *CompanyController {
	return &CompanyController{useCase: useCase}
}

type CompanyController struct {
	useCase *usecase.CompanyUseCase
}

func (c *CompanyController) CreateCompany(ctx *gin.Context) {
	var company domain.Company
	if err := ctx.ShouldBindJSON(&company); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.CreateCompany(&company); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create Company"})
		return
	}

	ctx.JSON(201, gin.H{"message": "Company created successfully"})
}

func (c *CompanyController) GetCompany(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Company ID"})
		return
	}

	company, err := c.useCase.GetCompany(uint(id))
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Company not found"})
		return
	}

	ctx.JSON(200, company)
}

func (c *CompanyController) GetAllCompanies(ctx *gin.Context) {
	companies, err := c.useCase.GetAllCompanies()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Companies"})
		return
	}

	ctx.JSON(200, companies)
}

func (c *CompanyController) UpdateCompany(ctx *gin.Context) {
	var company domain.Company
	if err := ctx.ShouldBindJSON(&company); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.UpdateCompany(&company); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update Company"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Company updated successfully"})
}

func (c *CompanyController) DeleteCompany(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Company ID"})
		return
	}
	if err := c.useCase.DeleteCompany(uint(id)); err != nil {
		ctx.JSON(404, gin.H{"error": "Company not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Company deleted successfully"})
}

// GenerateCompanyInfoRequest represents the request payload for generating company info
type GenerateCompanyInfoRequest struct {
	Name string `json:"name" binding:"required"`
}

// GenerateCompanyInfo - 企業情報の自動生成エンドポイント
func (c *CompanyController) GenerateCompanyInfo(ctx *gin.Context) {
	var req GenerateCompanyInfoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	company, err := c.useCase.GenerateCompanyInfo(req.Name)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to generate company info", "details": err.Error()})
		return
	}

	// レスポンス用の構造体に変換
	response := domain.CompanyResponse{
		ID:          0, // 新規作成なのでIDは0
		Name:        company.Name,
		WebURL:      company.WebURL,
		Description: company.Description,
		Img:         company.Img,
		Industry:    company.Industry,
	}

	ctx.JSON(200, response)
}
