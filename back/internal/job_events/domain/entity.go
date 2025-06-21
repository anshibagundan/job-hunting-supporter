package domain

import "time"

type JobEvent struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserID         uint      `gorm:"not null" json:"user_id"`          // ユーザーID
	CompanyID      uint      `gorm:"not null" json:"company_id"`       // 企業ID
	JobTitle       string    `gorm:"not null" json:"job_title"`        // イベント名　例: 「2023年新卒採用説明会」、「FEサマーインターンシップ」など
	JobType        string    `gorm:"not null" json:"job_type"`         // イベントの種類（例: 説明会、インターンシップ、面接など）
	JobDescription string    `gorm:"not null" json:"job_description"`  // イベントの詳細説明
	StartDate      time.Time `gorm:"not null" json:"start_date"`       // イベントの応募開始日時
	Deadline       time.Time `gorm:"not null" json:"deadline"`         // イベントの応募締切日時
	EventURL       string    `gorm:"not null;unique" json:"event_url"` // イベントの詳細URL
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
