package domain

type InterviewService interface {
	FindByIDWithCompany(id uint) (*InterviewResponse, error)
	FindByUserIDWithCompany(userID uint) ([]*InterviewResponse, error)
	FindByCompanyIDWithCompany(companyID uint) ([]*InterviewResponse, error)
	FindByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*InterviewResponse, error)
	GetAllWithCompany() ([]*InterviewResponse, error)
}