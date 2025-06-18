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

func (r *JobEventRepository) Create(jobEvents *domain.JobEvent) error {
	return r.db.Create(jobEvents).Error
}

func (r *JobEventRepository) FindByID(id uint) (*domain.JobEvent, error) {
	var jobEvents domain.JobEvent
	err := r.db.First(&jobEvents, id).Error
	if err != nil {
		return nil, err
	}
	return &jobEvents, nil
}

func (r *JobEventRepository) GetAll() ([]*domain.JobEvent, error) {
	var jobEvents []*domain.JobEvent
	err := r.db.Find(&jobEvents).Error
	if err != nil {
		return nil, err
	}
	return jobEvents, nil
}

func (r *JobEventRepository) Update(jobEvents *domain.JobEvent) error {
	return r.db.Save(jobEvents).Error
}

func (r *JobEventRepository) Delete(id uint) error {
	return r.db.Delete(&domain.JobEvent{}, id).Error
}
