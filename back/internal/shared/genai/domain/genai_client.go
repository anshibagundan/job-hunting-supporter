package domain

type GenAIClient interface {
	GenerateTranscriptFromAudio(path string) (string, error)
}
