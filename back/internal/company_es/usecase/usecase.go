package usecase

import (
	"fmt"

	companyUsecase "github.com/anshibagundan/job-hunting-supporter/internal/companies/usecase"
	"github.com/anshibagundan/job-hunting-supporter/internal/company_es/domain"
	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

func NewCompanyESUseCase(repo domain.CompanyESRepository, genaiClient genaidomain.GenAIClient, companyUseCase *companyUsecase.CompanyUseCase) *CompanyESUseCase {
	return &CompanyESUseCase{
		repo:           repo,
		genaiClient:    genaiClient,
		companyUseCase: companyUseCase,
	}
}

type CompanyESUseCase struct {
	repo           domain.CompanyESRepository
	genaiClient    genaidomain.GenAIClient
	companyUseCase *companyUsecase.CompanyUseCase
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

func (u *CompanyESUseCase) UpdateCompanyES(companyES *domain.CompanyES, requestUserID uint) error {
	// 既存のESを取得して権限チェック
	existing, err := u.repo.FindByID(companyES.ID)
	if err != nil {
		return err
	}
	
	// 権限チェック：自分のESのみ更新可能
	if existing.UserID != requestUserID {
		return fmt.Errorf("access denied: you can only update your own ES")
	}
	
	return u.repo.Update(companyES)
}

func (u *CompanyESUseCase) DeleteCompanyES(id uint, requestUserID uint) error {
	// 既存のESを取得して権限チェック
	existing, err := u.repo.FindByID(id)
	if err != nil {
		return err
	}
	
	// 権限チェック：自分のESのみ削除可能
	if existing.UserID != requestUserID {
		return fmt.Errorf("access denied: you can only delete your own ES")
	}
	
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
func (u *CompanyESUseCase) GetCompanyESWithCompany(id uint, requestUserID uint) (*domain.CompanyESResponse, error) {
	companyES, err := u.repo.FindByIDWithCompany(id)
	if err != nil {
		return nil, err
	}
	
	// 権限チェック：自分のESデータのみアクセス可能
	if companyES.UserID != requestUserID {
		return nil, fmt.Errorf("access denied: you can only view your own ES")
	}
	
	return companyES, nil
}

func (u *CompanyESUseCase) GetCompanyESsByUserIDWithCompany(userID uint) ([]*domain.CompanyESResponse, error) {
	return u.repo.FindByUserIDWithCompany(userID)
}

func (u *CompanyESUseCase) GetCompanyESsByCompanyIDWithCompany(companyID uint, requestUserID uint) ([]*domain.CompanyESResponse, error) {
	// ユーザーIDと企業IDで絞り込んで取得
	return u.repo.FindByUserIDAndCompanyIDWithCompany(requestUserID, companyID)
}

func (u *CompanyESUseCase) GetCompanyESByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*domain.CompanyESResponse, error) {
	return u.repo.FindByUserIDAndCompanyIDWithCompany(userID, companyID)
}

func (u *CompanyESUseCase) GetAllCompanyESsWithCompany(requestUserID uint) ([]*domain.CompanyESResponse, error) {
	// 自分のESデータのみ取得
	return u.repo.FindByUserIDWithCompany(requestUserID)
}

// GenerateESContent - BaseESと企業情報からES内容を自動生成
func (u *CompanyESUseCase) GenerateESContent(baseES string, companyDescription string, esTitle string) (content string, err error) {
	if baseES == "" {
		return "", fmt.Errorf("baseES is empty")
	}
	if companyDescription == "" {
		return "", fmt.Errorf("companyDescription is empty")
	}
	if esTitle == "" {
		return "", fmt.Errorf("esTitle is empty")
	}

	// GenAI クライアントを使用してES内容を自動生成
	return u.genaiClient.GenerateESContent(baseES, companyDescription, esTitle)
}

// AnalyzeContentWithCompany - 企業情報を含めたES内容の分析
func (u *CompanyESUseCase) AnalyzeContentWithCompany(content string, companyID uint) (summary string, advice string, adviceItems []genaidomain.AdviceItem, err error) {
	if content == "" {
		return "", "", nil, fmt.Errorf("content is empty")
	}

	// 企業情報を取得
	company, err := u.companyUseCase.GetCompany(companyID)
	if err != nil {
		return "", "", nil, fmt.Errorf("failed to get company information: %w", err)
	}

	// 企業情報を含めたプロンプトでGenAI分析を実行
	return u.genaiClient.AnalyzeESContentWithCompany(content, company.Name, company.Description, company.Industry)
}
