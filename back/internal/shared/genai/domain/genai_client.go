package domain

type AdviceItem struct {
	Category    string `json:"category"`
	Achievement int    `json:"achievement"`
	Reason      string `json:"reason"`
	Suggestion  string `json:"suggestion"`
}

type GenAIClient interface {
	GenerateTranscriptFromAudio(path string) (string, error)
	AnalyzeInterviewContent(content string) (summary string, err error)
	AnalyzeESContent(content string) (summary string, advice string, adviceItems []AdviceItem, err error)
	AnalyzeBaseESContent(content string) (summary string, advice string, adviceItems []AdviceItem, err error)
	AnalyzeESContentWithCompany(content string, companyName string, companyDescription string, industry string) (summary string, advice string, adviceItems []AdviceItem, err error)
	GenerateESContent(baseES string, companyDescription string, esTitle string) (content string, err error)
}
