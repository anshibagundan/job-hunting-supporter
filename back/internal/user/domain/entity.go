package domain

import "time"

type User struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`                     // ユーザー名
	FirebaseUID string    `gorm:"uniqueIndex;not null" json:"firebase_uid"` // FirebaseのユーザーID
	Email       string    `gorm:"uniqueIndex;not null" json:"email"`        // メールアドレス
	Icon        string    `gorm:"not null" json:"icon"`                     // アイコンURL
	BasicES     string    `gorm:"type:text" json:"basic_es"`                // 基本ES
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
