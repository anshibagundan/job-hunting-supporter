package domain

import "time"

type User struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"not null"`             // ユーザー名
	FirebaseUID string    `gorm:"uniqueIndex;not null"` // FirebaseのユーザーID
	Email       string    `gorm:"uniqueIndex;not null"` // メールアドレス
	Icon        string    `gorm:"not null"`             // アイコンURL
	BasicES     string    `gorm:"type:text"`            // 基本ES
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}
