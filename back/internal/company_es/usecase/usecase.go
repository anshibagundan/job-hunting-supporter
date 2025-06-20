package usecase

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
)

func NewCompanyESUseCase(repo domain.CompanyESRepository) *CompanyESUseCase {
	return &CompanyESUseCase{
		repo: repo,
	}
}

type CompanyESUseCase struct {
	repo domain.CompanyESRepository
}

func (u *CompanyESUseCase) CreateCompanyES(companyES *domain.CompanyES) error {
	return u.repo.Create(companyES)
}

func (u *CompanyESUseCase) GetCompanyES(id uint) (*domain.CompanyES, error) {
	return u.repo.FindByID(id)
}

func (u *CompanyESUseCase) GetCompanyESsByUserID(userID uint) ([]*domain.CompanyES, error) {
	return u.repo.FindByUserID(userID)
}

func (u *CompanyESUseCase) GetCompanyESsByCompanyID(companyID uint) ([]*domain.CompanyES, error) {
	return u.repo.FindByCompanyID(companyID)
}

func (u *CompanyESUseCase) GetCompanyESByUserIDAndCompanyID(userID, companyID uint) ([]*domain.CompanyES, error) {
	return u.repo.FindByUserIDAndCompanyID(userID, companyID)
}

func (u *CompanyESUseCase) GetAllCompanyESs() ([]*domain.CompanyES, error) {
	return u.repo.GetAll()
}

func (u *CompanyESUseCase) UpdateCompanyES(companyES *domain.CompanyES) error {
	return u.repo.Update(companyES)
}

func (u *CompanyESUseCase) DeleteCompanyES(id uint) error {
	return u.repo.Delete(id)
}