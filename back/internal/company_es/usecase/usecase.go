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
func (u *CompanyESUseCase) AnalyzeContent(content string) (summary string, advice string, err error) {
	if content == "" {
		return "", "", fmt.Errorf("content is empty")
	}

	// GenAI クライアントを使用して実際の分析を実行
	return u.genaiClient.AnalyzeESContent(content)
}
