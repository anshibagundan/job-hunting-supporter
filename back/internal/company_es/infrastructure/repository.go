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