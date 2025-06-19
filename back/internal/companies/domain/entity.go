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
