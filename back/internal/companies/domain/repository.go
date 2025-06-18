package domain

type CompanyRepository interface {
	Create(company *Company) error
	FindByID(id uint) (*Company, error)
	GetAll() ([]*Company, error)
	Update(company *Company) error
	Delete(id uint) error
}
