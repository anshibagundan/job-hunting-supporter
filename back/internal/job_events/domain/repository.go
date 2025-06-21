package domain

type JobEventRepository interface {
	Create(jobEvent *JobEvent) error
	FindByID(id uint) (*JobEvent, error)
	FindByCompanyID(companyID uint) ([]*JobEvent, error)
	FindByUserID(userID uint) ([]*JobEvent, error)
	GetAll() ([]*JobEvent, error)
	Update(jobEvent *JobEvent) error
	Delete(id uint) error
}
