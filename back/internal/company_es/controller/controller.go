package controller

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/usecase"
	"github.com/gin-gonic/gin"
	"strconv"
)

func NewCompanyESController(useCase *usecase.CompanyESUseCase) *CompanyESController {
	return &CompanyESController{useCase: useCase}
}

type CompanyESController struct {
	useCase *usecase.CompanyESUseCase
}

func (c *CompanyESController) CreateCompanyES(ctx *gin.Context) {
	var companyES domain.CompanyES
	if err := ctx.ShouldBindJSON(&companyES); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.CreateCompanyES(&companyES); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create CompanyES"})
		return
	}

	ctx.JSON(201, gin.H{"message": "CompanyES created successfully"})
}

func (c *CompanyESController) GetCompanyES(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid CompanyES ID"})
		return
	}

	companyES, err := c.useCase.GetCompanyES(uint(id))
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

	companyESs, err := c.useCase.GetCompanyESsByUserID(uint(userID))
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

	companyESs, err := c.useCase.GetCompanyESsByCompanyID(uint(companyID))
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

	companyESs, err := c.useCase.GetCompanyESByUserIDAndCompanyID(uint(userID), uint(companyID))
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) GetAllCompanyESs(ctx *gin.Context) {
	companyESs, err := c.useCase.GetAllCompanyESs()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch CompanyESs"})
		return
	}

	ctx.JSON(200, companyESs)
}

func (c *CompanyESController) UpdateCompanyES(ctx *gin.Context) {
	var companyES domain.CompanyES
	if err := ctx.ShouldBindJSON(&companyES); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if err := c.useCase.UpdateCompanyES(&companyES); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update CompanyES"})
		return
	}

	ctx.JSON(200, gin.H{"message": "CompanyES updated successfully"})
}

func (c *CompanyESController) DeleteCompanyES(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid CompanyES ID"})
		return
	}
	
	if err := c.useCase.DeleteCompanyES(uint(id)); err != nil {
		ctx.JSON(404, gin.H{"error": "CompanyES not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "CompanyES deleted successfully"})
}