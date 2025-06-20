package infrastructure

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
	"gorm.io/gorm"
)

type CompanyESRepository struct {
	db *gorm.DB
}

func NewCompanyESRepository(db *gorm.DB) *CompanyESRepository {
	return &CompanyESRepository{db: db}
}

func (r *CompanyESRepository) Create(companyES *domain.CompanyES) error {
	return r.db.Create(companyES).Error
}

func (r *CompanyESRepository) FindByID(id uint) (*domain.CompanyES, error) {
	var companyES domain.CompanyES
	err := r.db.First(&companyES, id).Error
	if err != nil {
		return nil, err
	}
	return &companyES, nil
}

func (r *CompanyESRepository) FindByUserID(userID uint) ([]*domain.CompanyES, error) {
	var companyESs []*domain.CompanyES
	err := r.db.Where("user_id = ?", userID).Find(&companyESs).Error
	if err != nil {
		return nil, err
	}
	return companyESs, nil
}

func (r *CompanyESRepository) FindByCompanyID(companyID uint) ([]*domain.CompanyES, error) {
	var companyESs []*domain.CompanyES
	err := r.db.Where("company_id = ?", companyID).Find(&companyESs).Error
	if err != nil {
		return nil, err
	}
	return companyESs, nil
}

func (r *CompanyESRepository) FindByUserIDAndCompanyID(userID, companyID uint) ([]*domain.CompanyES, error) {
	var companyESs []*domain.CompanyES
	err := r.db.Where("user_id = ? AND company_id = ?", userID, companyID).Find(&companyESs).Error
	if err != nil {
		return nil, err
	}
	return companyESs, nil
}

func (r *CompanyESRepository) GetAll() ([]*domain.CompanyES, error) {
	var companyESs []*domain.CompanyES
	err := r.db.Find(&companyESs).Error
	if err != nil {
		return nil, err
	}
	return companyESs, nil
}

func (r *CompanyESRepository) Update(companyES *domain.CompanyES) error {
	return r.db.Save(companyES).Error
}

func (r *CompanyESRepository) Delete(id uint) error {
	return r.db.Delete(&domain.CompanyES{}, id).Error
}

// Methods to get responses with Company details
func (r *CompanyESRepository) FindByIDWithCompany(id uint) (*domain.CompanyESResponse, error) {
	var result struct {
		domain.CompanyES
		CompanyName        string `gorm:"column:name"`
		CompanyWebURL      string `gorm:"column:web_url"`
		CompanyDescription string `gorm:"column:description"`
		CompanyImg         string `gorm:"column:img"`
		CompanyIndustry    string `gorm:"column:industry"`
	}

	err := r.db.Table("company_es").
		Select("company_es.*, companies.name, companies.web_url, companies.description, companies.img, companies.industry").
		Joins("LEFT JOIN companies ON company_es.company_id = companies.id").
		Where("company_es.id = ?", id).
		First(&result).Error

	if err != nil {
		return nil, err
	}

	response := &domain.CompanyESResponse{
		ID:     result.ID,
		UserID: result.UserID,
		Company: domain.Company{
			ID:          result.CompanyID,
			Name:        result.CompanyName,
			WebURL:      result.CompanyWebURL,
			Description: result.CompanyDescription,
			Img:         result.CompanyImg,
			Industry:    result.CompanyIndustry,
		},
		Title:     result.Title,
		Content:   result.Content,
		Summary:   result.AISummary,
		Advice:    result.AIAdvice,
		CreatedAt: result.CreatedAt,
		UpdatedAt: result.UpdatedAt,
	}

	return response, nil
}

func (r *CompanyESRepository) FindByUserIDWithCompany(userID uint) ([]*domain.CompanyESResponse, error) {
	var results []struct {
		domain.CompanyES
		CompanyName        string `gorm:"column:name"`
		CompanyWebURL      string `gorm:"column:web_url"`
		CompanyDescription string `gorm:"column:description"`
		CompanyImg         string `gorm:"column:img"`
		CompanyIndustry    string `gorm:"column:industry"`
	}

	err := r.db.Table("company_es").
		Select("company_es.*, companies.name, companies.web_url, companies.description, companies.img, companies.industry").
		Joins("LEFT JOIN companies ON company_es.company_id = companies.id").
		Where("company_es.user_id = ?", userID).
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	responses := make([]*domain.CompanyESResponse, len(results))
	for i, result := range results {
		responses[i] = &domain.CompanyESResponse{
			ID:     result.ID,
			UserID: result.UserID,
			Company: domain.Company{
				ID:          result.CompanyID,
				Name:        result.CompanyName,
				WebURL:      result.CompanyWebURL,
				Description: result.CompanyDescription,
				Img:         result.CompanyImg,
				Industry:    result.CompanyIndustry,
			},
			Title:     result.Title,
			Content:   result.Content,
			Summary:   result.AISummary,
			Advice:    result.AIAdvice,
			CreatedAt: result.CreatedAt,
			UpdatedAt: result.UpdatedAt,
		}
	}

	return responses, nil
}

func (r *CompanyESRepository) FindByCompanyIDWithCompany(companyID uint) ([]*domain.CompanyESResponse, error) {
	var results []struct {
		domain.CompanyES
		CompanyName        string `gorm:"column:name"`
		CompanyWebURL      string `gorm:"column:web_url"`
		CompanyDescription string `gorm:"column:description"`
		CompanyImg         string `gorm:"column:img"`
		CompanyIndustry    string `gorm:"column:industry"`
	}

	err := r.db.Table("company_es").
		Select("company_es.*, companies.name, companies.web_url, companies.description, companies.img, companies.industry").
		Joins("LEFT JOIN companies ON company_es.company_id = companies.id").
		Where("company_es.company_id = ?", companyID).
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	responses := make([]*domain.CompanyESResponse, len(results))
	for i, result := range results {
		responses[i] = &domain.CompanyESResponse{
			ID:     result.ID,
			UserID: result.UserID,
			Company: domain.Company{
				ID:          result.CompanyID,
				Name:        result.CompanyName,
				WebURL:      result.CompanyWebURL,
				Description: result.CompanyDescription,
				Img:         result.CompanyImg,
				Industry:    result.CompanyIndustry,
			},
			Title:     result.Title,
			Content:   result.Content,
			Summary:   result.AISummary,
			Advice:    result.AIAdvice,
			CreatedAt: result.CreatedAt,
			UpdatedAt: result.UpdatedAt,
		}
	}

	return responses, nil
}

func (r *CompanyESRepository) FindByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*domain.CompanyESResponse, error) {
	var results []struct {
		domain.CompanyES
		CompanyName        string `gorm:"column:name"`
		CompanyWebURL      string `gorm:"column:web_url"`
		CompanyDescription string `gorm:"column:description"`
		CompanyImg         string `gorm:"column:img"`
		CompanyIndustry    string `gorm:"column:industry"`
	}

	err := r.db.Table("company_es").
		Select("company_es.*, companies.name, companies.web_url, companies.description, companies.img, companies.industry").
		Joins("LEFT JOIN companies ON company_es.company_id = companies.id").
		Where("company_es.user_id = ? AND company_es.company_id = ?", userID, companyID).
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	responses := make([]*domain.CompanyESResponse, len(results))
	for i, result := range results {
		responses[i] = &domain.CompanyESResponse{
			ID:     result.ID,
			UserID: result.UserID,
			Company: domain.Company{
				ID:          result.CompanyID,
				Name:        result.CompanyName,
				WebURL:      result.CompanyWebURL,
				Description: result.CompanyDescription,
				Img:         result.CompanyImg,
				Industry:    result.CompanyIndustry,
			},
			Title:     result.Title,
			Content:   result.Content,
			Summary:   result.AISummary,
			Advice:    result.AIAdvice,
			CreatedAt: result.CreatedAt,
			UpdatedAt: result.UpdatedAt,
		}
	}

	return responses, nil
}

func (r *CompanyESRepository) GetAllWithCompany() ([]*domain.CompanyESResponse, error) {
	var results []struct {
		domain.CompanyES
		CompanyName        string `gorm:"column:name"`
		CompanyWebURL      string `gorm:"column:web_url"`
		CompanyDescription string `gorm:"column:description"`
		CompanyImg         string `gorm:"column:img"`
		CompanyIndustry    string `gorm:"column:industry"`
	}

	err := r.db.Table("company_es").
		Select("company_es.*, companies.name, companies.web_url, companies.description, companies.img, companies.industry").
		Joins("LEFT JOIN companies ON company_es.company_id = companies.id").
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	responses := make([]*domain.CompanyESResponse, len(results))
	for i, result := range results {
		responses[i] = &domain.CompanyESResponse{
			ID:     result.ID,
			UserID: result.UserID,
			Company: domain.Company{
				ID:          result.CompanyID,
				Name:        result.CompanyName,
				WebURL:      result.CompanyWebURL,
				Description: result.CompanyDescription,
				Img:         result.CompanyImg,
				Industry:    result.CompanyIndustry,
			},
			Title:     result.Title,
			Content:   result.Content,
			Summary:   result.AISummary,
			Advice:    result.AIAdvice,
			CreatedAt: result.CreatedAt,
			UpdatedAt: result.UpdatedAt,
		}
	}

	return responses, nil
}
