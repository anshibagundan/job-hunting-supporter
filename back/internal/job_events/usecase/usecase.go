package usecase

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/job_events/domain"
)

func NewJobEventUseCase(repo domain.JobEventRepository) *JobEventUseCase {
	return &JobEventUseCase{
		repo: repo,
	}
}

type JobEventUseCase struct {
	repo domain.JobEventRepository
}

func (u *JobEventUseCase) CreateJobEvent(jobEvent *domain.JobEvent) error {
	return u.repo.Create(jobEvent)
}

func (u *JobEventUseCase) GetJobEvent(id uint) (*domain.JobEvent, error) {
	return u.repo.FindByID(id)
}

func (u *JobEventUseCase) GetJobEventsByCompanyID(companyID uint) ([]*domain.JobEvent, error) {
	return u.repo.FindByCompanyID(companyID)
}

func (u *JobEventUseCase) GetJobEventsByUserID(userID uint) ([]*domain.JobEvent, error) {
	return u.repo.FindByUserID(userID)
}

func (u *JobEventUseCase) GetAllJobEvents() ([]*domain.JobEvent, error) {
	return u.repo.GetAll()
}

func (u *JobEventUseCase) UpdateJobEvent(jobEvent *domain.JobEvent) error {
	return u.repo.Update(jobEvent)
}

func (u *JobEventUseCase) DeleteJobEvent(id uint) error {
	return u.repo.Delete(id)
}
