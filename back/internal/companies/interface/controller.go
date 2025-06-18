package _interface

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/usecase"
	"github.com/gin-gonic/gin"
	"strconv"
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
	companys, err := c.useCase.GetAllCompanys()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to fetch Companys"})
		return
	}

	ctx.JSON(200, companys)
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
