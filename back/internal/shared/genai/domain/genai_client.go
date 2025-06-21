package domain

type AdviceItem struct {
	Category    string `json:"category"`
	Achievement int    `json:"achievement"`
	Reason      string `json:"reason"`
	Suggestion  string `json:"suggestion"`
}

type GenAIClient interface {
	GenerateTranscriptFromAudio(path string) (string, error)
	AnalyzeESContent(content string) (summary string, advice string, adviceItems []AdviceItem, err error)
}
