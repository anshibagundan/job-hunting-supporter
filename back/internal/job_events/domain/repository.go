package domain

type JobEventRepository interface {
	Create(jobEvents *JobEvent) error
	FindByID(id uint) (*JobEvent, error)
	GetAll() ([]*JobEvent, error)
	Update(jobEvents *JobEvent) error
	Delete(id uint) error
}
