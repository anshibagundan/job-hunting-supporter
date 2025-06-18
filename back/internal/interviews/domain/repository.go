package domain

type InterviewRepository interface {
	Create(interview *Interview) error
	FindByID(id uint) (*Interview, error)
	GetAll() ([]*Interview, error)
	Update(interview *Interview) error
	Delete(id uint) error
}
