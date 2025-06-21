package infrastructure

import (
	companies_domain "github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	"github.com/anshibagundan/job-hunting-supporter/internal/interviews/domain"
	"gorm.io/gorm"
)

type InterviewService struct {
	db *gorm.DB
}

func NewInterviewService(db *gorm.DB) *InterviewService {
	return &InterviewService{db: db}
}

// Helper function to convert Company to CompanyResponse
func (i *InterviewService) convertToCompanyResponse(company companies_domain.Company) companies_domain.CompanyResponse {
	return companies_domain.CompanyResponse{
		ID:          company.ID,
		Name:        company.Name,
		WebURL:      company.WebURL,
		Description: company.Description,
		Img:         company.Img,
		Industry:    company.Industry,
	}
}

// Helper function to convert Interview to InterviewResponse
func (i *InterviewService) convertToInterviewResponse(interview domain.Interview, company companies_domain.Company) *domain.InterviewResponse {
	return &domain.InterviewResponse{
		ID:           interview.ID,
		Company:      i.convertToCompanyResponse(company),
		JobEventID:   interview.JobEventID,
		UserID:       interview.UserID,
		InterviewAt:  interview.InterviewAt,
		Stage:        interview.Stage,
		Transcript:   interview.Transcript,
		AudioSummary: interview.AudioSummary,
		TextNote:     interview.TextNote,
		Location:     interview.Location,
		MeetingURL:   interview.MeetingURL,
		CreatedAt:    interview.CreatedAt,
		UpdatedAt:    interview.UpdatedAt,
	}
}

func (i *InterviewService) FindByIDWithCompany(id uint) (*domain.InterviewResponse, error) {
	var interview domain.Interview
	var company companies_domain.Company

	// Interview情報を取得
	err := i.db.First(&interview, id).Error
	if err != nil {
		return nil, err
	}

	// Company情報を取得
	err = i.db.First(&company, interview.CompanyID).Error
	if err != nil {
		return nil, err
	}

	return i.convertToInterviewResponse(interview, company), nil
}

func (i *InterviewService) FindByUserIDWithCompany(userID uint) ([]*domain.InterviewResponse, error) {
	var interviews []domain.Interview
	err := i.db.Where("user_id = ?", userID).Find(&interviews).Error
	if err != nil {
		return nil, err
	}

	var responses []*domain.InterviewResponse
	for _, interview := range interviews {
		var company companies_domain.Company
		err = i.db.First(&company, interview.CompanyID).Error
		if err != nil {
			continue // Skip if company not found
		}
		responses = append(responses, i.convertToInterviewResponse(interview, company))
	}

	return responses, nil
}

func (i *InterviewService) FindByCompanyIDWithCompany(companyID uint) ([]*domain.InterviewResponse, error) {
	var interviews []domain.Interview
	var company companies_domain.Company

	// Company情報を事前に取得
	err := i.db.First(&company, companyID).Error
	if err != nil {
		return nil, err
	}

	// 該当企業のInterview情報を取得
	err = i.db.Where("company_id = ?", companyID).Find(&interviews).Error
	if err != nil {
		return nil, err
	}

	var responses []*domain.InterviewResponse
	for _, interview := range interviews {
		responses = append(responses, i.convertToInterviewResponse(interview, company))
	}

	return responses, nil
}

func (i *InterviewService) FindByUserIDAndCompanyIDWithCompany(userID, companyID uint) ([]*domain.InterviewResponse, error) {
	var interviews []domain.Interview
	var company companies_domain.Company

	// Company情報を事前に取得
	err := i.db.First(&company, companyID).Error
	if err != nil {
		return nil, err
	}

	// 該当ユーザー・企業のInterview情報を取得
	err = i.db.Where("user_id = ? AND company_id = ?", userID, companyID).Find(&interviews).Error
	if err != nil {
		return nil, err
	}

	var responses []*domain.InterviewResponse
	for _, interview := range interviews {
		responses = append(responses, i.convertToInterviewResponse(interview, company))
	}

	return responses, nil
}

func (i *InterviewService) GetAllWithCompany() ([]*domain.InterviewResponse, error) {
	var interviews []domain.Interview
	err := i.db.Find(&interviews).Error
	if err != nil {
		return nil, err
	}

	var responses []*domain.InterviewResponse
	for _, interview := range interviews {
		var company companies_domain.Company
		err = i.db.First(&company, interview.CompanyID).Error
		if err != nil {
			continue // Skip if company not found
		}
		responses = append(responses, i.convertToInterviewResponse(interview, company))
	}

	return responses, nil
}
