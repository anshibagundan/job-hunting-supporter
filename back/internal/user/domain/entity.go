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

type User struct {
	ID          uint             `gorm:"primaryKey" json:"id"`
	Name        string           `gorm:"not null" json:"name"`                     // ユーザー名
	FirebaseUID string           `gorm:"uniqueIndex;not null" json:"firebase_uid"` // FirebaseのユーザーID
	Email       string           `gorm:"uniqueIndex;not null" json:"email"`        // メールアドレス
	Icon        string           `gorm:"not null" json:"icon"`                     // アイコンURL
	BasicES     string           `gorm:"type:text" json:"basic_es"`                // 基本ES
	Summary     string           `gorm:"type:text" json:"summary"`                 // 基本ESの分析要約
	AdviceItems AdviceItemsJSON  `gorm:"type:jsonb" json:"advice_items"`           // 基本ESの項目別分析結果
	CreatedAt   time.Time        `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time        `gorm:"autoUpdateTime" json:"updated_at"`
}
