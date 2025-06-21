package usecase

import (
	"fmt"

	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

func NewCompanyESUseCase(repo domain.CompanyESRepository, genaiClient genaidomain.GenAIClient) *CompanyESUseCase {
	return &CompanyESUseCase{
		repo:        repo,
		genaiClient: genaiClient,
	}
}

type CompanyESUseCase struct {
	repo        domain.CompanyESRepository
	genaiClient genaidomain.GenAIClient
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

// AnalyzeContent - 内容を分析するがDBには保存しない
func (u *CompanyESUseCase) AnalyzeContent(content string) (summary string, advice string, adviceItems []genaidomain.AdviceItem, err error) {
	if content == "" {
		return "", "", nil, fmt.Errorf("content is empty")
	}

	// GenAI クライアントを使用して実際の分析を実行
	return u.genaiClient.AnalyzeESContent(content)
}

// Methods to get responses with Company details
func (u *CompanyESUseCase) GetCompanyESWithCompany(id uint) (*domain.CompanyESResponse, error) {
	return u.repo.FindByIDWithCompany(id)
}

func (u *CompanyESUseCase) GetCompanyESsByUserIDWithCompany(userID uint) ([]*domain.CompanyESResponse, error) {
	return u.repo.FindByUserIDWithCompany(userID)
}

func (u *CompanyESUseCase) GetCompanyESsByCompanyIDWithCompany(companyID uint) ([]*domain.CompanyESResponse, error) {
	return u.repo.FindByCompanyIDWithCompany(companyID)
}

func (u *CompanyESUseCase) GetCompanyESByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*domain.CompanyESResponse, error) {
	return u.repo.FindByUserIDAndCompanyIDWithCompany(userID, companyID)
}

func (u *CompanyESUseCase) GetAllCompanyESsWithCompany() ([]*domain.CompanyESResponse, error) {
	return u.repo.GetAllWithCompany()
}
