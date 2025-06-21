package infrastructure

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/job_events/domain"
	"gorm.io/gorm"
)

type JobEventRepository struct {
	db *gorm.DB
}

func NewJobEventRepository(db *gorm.DB) *JobEventRepository {
	return &JobEventRepository{db: db}
}

func (r *JobEventRepository) Create(jobEvent *domain.JobEvent) error {
	return r.db.Create(jobEvent).Error
}

func (r *JobEventRepository) FindByID(id uint) (*domain.JobEvent, error) {
	var jobEvent domain.JobEvent
	err := r.db.First(&jobEvent, id).Error
	if err != nil {
		return nil, err
	}
	return &jobEvent, nil
}

func (r *JobEventRepository) FindByCompanyID(companyID uint) ([]*domain.JobEvent, error) {
	var jobEvents []*domain.JobEvent
	err := r.db.Where("company_id = ?", companyID).Find(&jobEvents).Error
	if err != nil {
		return nil, err
	}
	return jobEvents, nil
}

func (r *JobEventRepository) GetAll() ([]*domain.JobEvent, error) {
	var jobEvents []*domain.JobEvent
	err := r.db.Find(&jobEvents).Error
	if err != nil {
		return nil, err
	}
	return jobEvents, nil
}

func (r *JobEventRepository) Update(jobEvent *domain.JobEvent) error {
	return r.db.Save(jobEvent).Error
}

func (r *JobEventRepository) Delete(id uint) error {
	return r.db.Delete(&domain.JobEvent{}, id).Error
}
