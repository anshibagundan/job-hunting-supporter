package domain

import "time"

type CompanyES struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	CompanyID uint      `gorm:"not null" json:"company_id"`
	Title     string    `gorm:"type:varchar(255);not null;default:''" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	AISummary string    `gorm:"type:text;column:ai_summary" json:"summary"`
	AIAdvice  string    `gorm:"type:text;column:ai_advice" json:"advice"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// Company represents company information for response
type Company struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	WebURL      string `json:"website"`
	Description string `json:"description"`
	Img         string `json:"image"`
	Industry    string `json:"industry"`
}

// CompanyESResponse represents the response structure with Company details
type CompanyESResponse struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Company   Company   `json:"company"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Summary   string    `json:"summary"`
	Advice    string    `json:"advice"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
