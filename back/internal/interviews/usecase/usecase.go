package usecase

import (
	"fmt"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	genai_domain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

func NewInterviewUseCase(repo domain.InterviewRepository, service domain.InterviewService, genAI genai_domain.GenAIClient) *InterviewUseCase {
	return &InterviewUseCase{
		repo:    repo,
		service: service,
		genAI:   genAI,
	}
}

type InterviewUseCase struct {
	repo    domain.InterviewRepository
	service domain.InterviewService
	genAI   genai_domain.GenAIClient
}

// Basic CRUD operations using repository
func (u *InterviewUseCase) CreateInterview(interview *domain.Interview) error {

	return u.repo.Create(interview)
}

func (u *InterviewUseCase) UpdateInterview(interview *domain.Interview) error {
	return u.repo.Update(interview)
}

func (u *InterviewUseCase) DeleteInterview(id uint) error {
	return u.repo.Delete(id)
}

// Operations with Company information using service
func (u *InterviewUseCase) GetInterviewWithCompany(id uint) (*domain.InterviewResponse, error) {
	return u.service.FindByIDWithCompany(id)
}

func (u *InterviewUseCase) GetAllInterviewsWithCompany() ([]*domain.InterviewResponse, error) {
	return u.service.GetAllWithCompany()
}

func (u *InterviewUseCase) GetInterviewsByUserIDWithCompany(userID uint) ([]*domain.InterviewResponse, error) {
	return u.service.FindByUserIDWithCompany(userID)
}

func (u *InterviewUseCase) GetInterviewsByCompanyIDWithCompany(companyID uint) ([]*domain.InterviewResponse, error) {
	return u.service.FindByCompanyIDWithCompany(companyID)
}

func (u *InterviewUseCase) GetInterviewsByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*domain.InterviewResponse, error) {
	return u.service.FindByUserIDAndCompanyIDWithCompany(userID, companyID)
}

// Legacy methods for backward compatibility (if needed)
func (u *InterviewUseCase) GetInterview(id uint) (*domain.Interview, error) {
	return u.repo.FindByID(id)
}

func (u *InterviewUseCase) GetAllInterviews() ([]*domain.Interview, error) {
	return u.repo.GetAll()
}

// Audio transcription
func (u *InterviewUseCase) Transcribe(filePath string) (string, error) {
	fmt.Println("Transcribing audio file:", filePath)
	return u.genAI.GenerateTranscriptFromAudio(filePath)
}

func (u *InterviewUseCase) AnalyzeInterviewContent(content string) (string, error) {
	fmt.Println("Generating transcript from audio file:", content)
	return u.genAI.AnalyzeInterviewContent(content)
}
