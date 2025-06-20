package usecase

import (
	"fmt"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	genai_domain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

func NewInterviewUseCase(repo domain.InterviewRepository, genAI genai_domain.GenAIClient) *InterviewUseCase {
	return &InterviewUseCase{
		repo:  repo,
		genAI: genAI,
	}
}

type InterviewUseCase struct {
	repo  domain.InterviewRepository
	genAI genai_domain.GenAIClient
}

func (u *InterviewUseCase) CreateInterview(interview *domain.Interview) error {
	return u.repo.Create(interview)
}

func (u *InterviewUseCase) GetInterview(id uint) (*domain.Interview, error) {
	return u.repo.FindByID(id)
}

func (u *InterviewUseCase) GetAllInterviews() ([]*domain.Interview, error) {
	return u.repo.GetAll()
}

func (u *InterviewUseCase) UpdateInterview(interview *domain.Interview) error {
	return u.repo.Update(interview)
}

func (u *InterviewUseCase) DeleteInterview(id uint) error {
	return u.repo.Delete(id)
}

func (u *InterviewUseCase) Transcribe(filePath string) (string, error) {
	fmt.Println("Transcribing audio file:", filePath)
	return u.genAI.GenerateTranscriptFromAudio(filePath)
}
