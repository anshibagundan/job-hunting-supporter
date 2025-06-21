package domain

import "time"

type Company struct {
	ID              uint      `gorm:"primaryKey"`
	Name            string    `gorm:"not null;unique"` // 企業名
	WebURL          string    `gorm:"not null;unique"` // 企業のウェブサイトURL
	Description     string    `gorm:"not null"`        // 企業の説明
	Img             string    `gorm:"not null"`        // 企業のロゴ画像URL
	Industry        string    `gorm:"not null"`        // 業種（例: IT、製造、サービスなど）
	ScrapeTargetURL string    `gorm:"not null;unique"` // スクレイピング対象のURL
	LastScrapeTime  time.Time `gorm:"not null"`        // 最後にスクレイピングを行った日時
	CreatedAt       time.Time `gorm:"autoCreateTime"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime"`
}

// CompanyResponse represents the response structure for a company
type CompanyResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	WebURL      string `json:"website"`
	Description string `json:"description"`
	Img         string `json:"image"`
	Industry    string `json:"industry"`
}
