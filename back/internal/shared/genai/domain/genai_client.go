package domain

type GenAIClient interface {
	GenerateTranscriptFromAudio(path string) (string, error)
	AnalyzeESContent(content string) (summary string, advice string, err error)
}
