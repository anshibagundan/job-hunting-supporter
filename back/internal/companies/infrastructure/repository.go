package infrastructure

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	"gorm.io/gorm"
)

type CompanyRepository struct {
	db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

func (r *CompanyRepository) Create(company *domain.Company) error {
	return r.db.Create(company).Error
}

func (r *CompanyRepository) FindByID(id uint) (*domain.Company, error) {
	var company domain.Company
	err := r.db.First(&company, id).Error
	if err != nil {
		return nil, err
	}
	return &company, nil
}

func (r *CompanyRepository) GetAll() ([]*domain.Company, error) {
	var companys []*domain.Company
	err := r.db.Find(&companys).Error
	if err != nil {
		return nil, err
	}
	return companys, nil
}

func (r *CompanyRepository) Update(company *domain.Company) error {
	return r.db.Save(company).Error
}

func (r *CompanyRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Company{}, id).Error
}
