package domain

import "time"

type JobEvent struct {
	ID             uint      `gorm:"primaryKey"`
	CompanyID      uint      `gorm:"not null"`        // 企業ID
	JobTitle       string    `gorm:"not null"`        // イベント名　例: 「2023年新卒採用説明会」、「FEサマーインターンシップ」など
	JobType        string    `gorm:"not null"`        // イベントの種類（例: 説明会、インターンシップ、面接など）
	JobDescription string    `gorm:"not null"`        // イベントの詳細説明
	StartDate      time.Time `gorm:"not null"`        // イベントの応募開始日時
	Deadline       time.Time `gorm:"not null"`        // イベントの応募締切日時
	EventURL       string    `gorm:"not null;unique"` // イベントの詳細URL
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
}
