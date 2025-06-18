package usecase

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
)

func NewCompanyUseCase(repo domain.CompanyRepository) *CompanyUseCase {
	return &CompanyUseCase{
		repo: repo,
	}
}

type CompanyUseCase struct {
	repo domain.CompanyRepository
}

func (u *CompanyUseCase) CreateCompany(company *domain.Company) error {
	return u.repo.Create(company)
}

func (u *CompanyUseCase) GetCompany(id uint) (*domain.Company, error) {
	return u.repo.FindByID(id)
}

func (u *CompanyUseCase) GetAllCompanys() ([]*domain.Company, error) {
	return u.repo.GetAll()
}

func (u *CompanyUseCase) UpdateCompany(company *domain.Company) error {
	return u.repo.Update(company)
}

func (u *CompanyUseCase) DeleteCompany(id uint) error {
	return u.repo.Delete(id)
}
