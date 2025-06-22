package usecase

import (
	"time"

	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

func NewCompanyUseCase(repo domain.CompanyRepository, genaiClient genaidomain.GenAIClient) *CompanyUseCase {
	return &CompanyUseCase{
		repo:        repo,
		genaiClient: genaiClient,
	}
}

type CompanyUseCase struct {
	repo        domain.CompanyRepository
	genaiClient genaidomain.GenAIClient
}

func (u *CompanyUseCase) CreateCompany(company *domain.Company) error {
	return u.repo.Create(company)
}

func (u *CompanyUseCase) GetCompany(id uint) (*domain.Company, error) {
	return u.repo.FindByID(id)
}

func (u *CompanyUseCase) GetAllCompanies() ([]*domain.Company, error) {
	return u.repo.GetAll()
}

func (u *CompanyUseCase) UpdateCompany(company *domain.Company) error {
	return u.repo.Update(company)
}

func (u *CompanyUseCase) DeleteCompany(id uint) error {
	return u.repo.Delete(id)
}

// GenerateCompanyInfo は企業名から企業情報を自動生成します
func (u *CompanyUseCase) GenerateCompanyInfo(companyName string) (*domain.Company, error) {
	// GenAIクライアントを使用して企業情報を生成
	companyInfo, err := u.genaiClient.GenerateCompanyInfo(companyName)
	if err != nil {
		return nil, err
	}

	// ドメインエンティティに変換
	company := &domain.Company{
		Name:            companyInfo.Name,
		WebURL:          companyInfo.WebURL,
		Description:     companyInfo.Description,
		Img:             companyInfo.Img,
		Industry:        companyInfo.Industry,
		ScrapeTargetURL: companyInfo.WebURL, // デフォルトでウェブサイトURLを設定
		LastScrapeTime:  time.Now(),
	}

	return company, nil
}
