package domain

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	genaidomain "github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
)

// AdviceItemsJSON は JSONB フィールドを処理するためのカスタム型
type AdviceItemsJSON []genaidomain.AdviceItem

// Value は database/sql/driver.Valuer インターフェースを実装
func (a AdviceItemsJSON) Value() (driver.Value, error) {
	if len(a) == 0 {
		return nil, nil
	}
	return json.Marshal(a)
}

// Scan は sql.Scanner インターフェースを実装
func (a *AdviceItemsJSON) Scan(value interface{}) error {
	if value == nil {
		*a = nil
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}

	return json.Unmarshal(bytes, a)
}

type CompanyES struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	UserID      uint            `gorm:"not null" json:"user_id"`
	CompanyID   uint            `gorm:"not null" json:"company_id"`
	Title       string          `gorm:"type:varchar(255);not null;default:''" json:"title"`
	Content     string          `gorm:"type:text;not null" json:"content"`
	AISummary   string          `gorm:"type:text;column:ai_summary" json:"summary"`
	AIAdvice    string          `gorm:"type:text;column:ai_advice" json:"advice"`
	AdviceItems AdviceItemsJSON `gorm:"type:jsonb;column:advice_items" json:"adviceItems"`
	CreatedAt   time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time       `gorm:"autoUpdateTime" json:"updated_at"`
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
	ID          uint            `json:"id"`
	UserID      uint            `json:"user_id"`
	Company     Company         `json:"company"`
	Title       string          `json:"title"`
	Content     string          `json:"content"`
	Summary     string          `json:"summary"`
	Advice      string          `json:"advice"`
	AdviceItems AdviceItemsJSON `json:"adviceItems"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
}
