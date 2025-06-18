package infrastructure

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	"gorm.io/gorm"
)

type InterviewRepository struct {
	db *gorm.DB
}

func NewInterviewRepository(db *gorm.DB) *InterviewRepository {
	return &InterviewRepository{db: db}
}

func (r *InterviewRepository) Create(interview *domain.Interview) error {
	return r.db.Create(interview).Error
}

func (r *InterviewRepository) FindByID(id uint) (*domain.Interview, error) {
	var interview domain.Interview
	err := r.db.First(&interview, id).Error
	if err != nil {
		return nil, err
	}
	return &interview, nil
}

func (r *InterviewRepository) GetAll() ([]*domain.Interview, error) {
	var interviews []*domain.Interview
	err := r.db.Find(&interviews).Error
	if err != nil {
		return nil, err
	}
	return interviews, nil
}

func (r *InterviewRepository) Update(interview *domain.Interview) error {
	return r.db.Save(interview).Error
}

func (r *InterviewRepository) Delete(id uint) error {
	return r.db.Delete(&domain.Interview{}, id).Error
}
