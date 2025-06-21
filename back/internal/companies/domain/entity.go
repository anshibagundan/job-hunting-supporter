package domain

import "time"

type Company struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Name            string    `gorm:"not null;unique" json:"name"`              // 企業名
	WebURL          string    `gorm:"not null;unique" json:"website"`           // 企業のウェブサイトURL
	Description     string    `gorm:"not null" json:"description"`              // 企業の説明
	Img             string    `gorm:"not null" json:"image"`                    // 企業のロゴ画像URL
	Industry        string    `gorm:"not null" json:"industry"`                 // 業種（例: IT、製造、サービスなど）
	ScrapeTargetURL string    `gorm:"not null;unique" json:"scrape_target_url"` // スクレイピング対象のURL
	LastScrapeTime  time.Time `gorm:"not null" json:"last_scrape_time"`         // 最後にスクレイピングを行った日時
	CreatedAt       time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt       time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
