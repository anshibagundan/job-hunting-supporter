package usecase

import (
	"fmt"

	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/user/domain"
)

func NewUserUseCase(repo domain.UserRepository, genaiClient genaidomain.GenAIClient) *UserUseCase {
	return &UserUseCase{
		repo:        repo,
		genaiClient: genaiClient,
	}
}

type UserUseCase struct {
	repo        domain.UserRepository
	genaiClient genaidomain.GenAIClient
}

func (u *UserUseCase) CreateUser(user *domain.User) error {
	return u.repo.Create(user)
}

func (u *UserUseCase) GetUser(id uint) (*domain.User, error) {
	return u.repo.FindByID(id)
}

func (u *UserUseCase) GetAllUsers() ([]*domain.User, error) {
	return u.repo.GetAll()
}

func (u *UserUseCase) UpdateUser(user *domain.User) error {
	return u.repo.Update(user)
}

func (u *UserUseCase) UpdateUserPartial(id uint, updates map[string]interface{}) error {
	return u.repo.UpdatePartial(id, updates)
}

func (u *UserUseCase) DeleteUser(id uint) error {
	return u.repo.Delete(id)
}

func (u *UserUseCase) GetUserByFirebaseUID(firebaseUID string) (*domain.User, error) {
	return u.repo.FindByFirebaseUID(firebaseUID)
}

// AnalyzeBaseESContent - 基本ESの内容を分析する
func (u *UserUseCase) AnalyzeBaseESContent(content string) (summary string, advice string, adviceItems []genaidomain.AdviceItem, err error) {
	if content == "" {
		return "", "", nil, fmt.Errorf("content is empty")
	}

	// GenAI クライアントを使用して基本ESの分析を実行
	return u.genaiClient.AnalyzeBaseESContent(content)
}

// SaveBaseESAnalysisToProfile - 基本ES分析結果をユーザープロファイルに保存する
func (u *UserUseCase) SaveBaseESAnalysisToProfile(userID uint, summary string, adviceItems []genaidomain.AdviceItem) error {
	// ドメイン型に変換
	adviceItemsJSON := domain.AdviceItemsJSON(adviceItems)
	
	updates := map[string]interface{}{
		"summary":      summary,
		"advice_items": adviceItemsJSON,
	}
	
	return u.repo.UpdatePartial(userID, updates)
}
