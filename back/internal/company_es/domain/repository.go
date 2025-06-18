package domain

type CompanyESRepository interface {
	Create(companyES *CompanyES) error
	FindByID(id uint) (*CompanyES, error)
	FindByUserID(userID uint) ([]*CompanyES, error)
	FindByCompanyID(companyID uint) ([]*CompanyES, error)
	FindByUserIDAndCompanyID(userID, companyID uint) ([]*CompanyES, error)
	GetAll() ([]*CompanyES, error)
	Update(companyES *CompanyES) error
	Delete(id uint) error
}