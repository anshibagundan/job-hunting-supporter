package domain

type GenAIClient interface {
	GenerateTranscriptFromAudio(path string) (string, error)
	AnalyzeInterviewContent(content string) (summary string, err error)
	AnalyzeESContent(content string) (summary string, advice string, err error)
}
