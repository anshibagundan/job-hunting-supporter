package domain

import (
	"github.com/anshibagundan/job-hunting-supporter/internal/companies/domain"
	"time"
)

type Interview struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       uint      `gorm:"not null" json:"user_id"`      // ユーザーID
	CompanyID    uint      `gorm:"not null" json:"company_id"`   // 会社ID
	JobEventID   uint      `gorm:"not null" json:"job_event_id"` // 求人イベントID
	InterviewAt  time.Time `gorm:"not null" json:"interview_at"` // 面接日時
	Stage        string    `gorm:"not null" json:"stage"`        // 面接ステージ（例: 一次面接、最終面接など）
	AudioFile    string    `gorm:"column:audio_note_path" json:"audio_file"`
	Transcript   string    `gorm:"type:text" json:"transcript"`      // 面接の文字起こし
	AudioSummary string    `gorm:"type:text" json:"audio_summary"`   // 音声の要約
	TextNote     string    `gorm:"type:text" json:"text_note"`       // 面接のテキストメモ
	Location     string    `gorm:"type:text" json:"location"`        // 面接場所（オンラインの場合は空文字）
	MeetingURL   string    `gorm:"type:text" json:"meeting_url"`     // オンライン面接のURL
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"` // 作成日時
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"` // 更新日時
}

// InterviewResponse represents the response structure for an interview
type InterviewResponse struct {
	ID          uint                   `json:"id"`
	Company     domain.CompanyResponse `json:"company"` // 会社情報
	JobEventID  uint                   `json:"job_event_id"`
	UserID      uint                   `json:"user_id"`
	InterviewAt time.Time              `json:"interview_at"`
	Stage       string                 `json:"stage"`

	Transcript   string `json:"transcript"`    // 面接の文字起こし
	AudioSummary string `json:"audio_summary"` // 音声の要約
	TextNote     string `json:"text_note"`     // 面接のテキストメモ

	Location   string `json:"location"`    // 面接場所（オンラインの場合は空文字）
	MeetingURL string `json:"meeting_url"` // オンライン面接のURL

	CreatedAt time.Time `json:"created_at"` // 作成日時
	UpdatedAt time.Time `json:"updated_at"` // 更新日時
}
