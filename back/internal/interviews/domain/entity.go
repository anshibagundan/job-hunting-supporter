package domain

import "time"

type Interview struct {
	ID          uint      `gorm:"primaryKey"`
	CompanyID   uint      `gorm:"not null"` // 企業ID
	JobEventID  uint      `gorm:"not null"` // イベントID
	UserID      uint      `gorm:"not null"` // ユーザーID
	InterviewAt time.Time `gorm:"not null"` // 面接日時
	Stage       string    `gorm:"not null"` // 面接のステージ（例: 一次面接、最終面接など）

	AudioNotePath string `gorm:"type:text"` // 音声メモのパス
	Transcript    string `gorm:"type:text"` // 音声メモの文字起こし

	AudioSummary string `gorm:"type:text"` // 音声メモの要約
	TextNote     string `gorm:"type:text"` // テキストメモ

	Location   string `gorm:"type:text"` // 面接の場所（例: オンライン、オフィスなど）
	MeetingURL string `gorm:"type:text"` // オンライン面接の場合のURL

	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
