package genaiinfra

import (
	"context"
	"fmt"
	"log"

	"github.com/anshibagundan/job-hunting-supporter/internal/shared/genai/domain"
	"google.golang.org/genai"
)

type GenAIClientImpl struct {
	client *genai.Client
}

func NewGenAIClient(apiKey string) domain.GenAIClient {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}
	return &GenAIClientImpl{client: client}
}

func (g *GenAIClientImpl) GenerateTranscriptFromAudio(path string) (string, error) {
	fmt.Println("Generating transcript from audio file:", path)
	ctx := context.Background()
	uploadedFile, err := g.client.Files.UploadFromPath(ctx, path, nil)
	if err != nil {
		return "", fmt.Errorf("upload failed: %w", err)
	}

	fmt.Println("File uploaded successfully:", uploadedFile.URI)

	contents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText("Generate a transcript of the speech."),
			genai.NewPartFromURI(uploadedFile.URI, uploadedFile.MIMEType),
		}, genai.RoleUser),
	}

	fmt.Println("Generating content with model: gemini-2.0-flash")

	resp, err := g.client.Models.GenerateContent(ctx, "gemini-2.0-flash", contents, nil)
	if err != nil {
		return "", fmt.Errorf("generate content failed: %w", err)
	}
	return resp.Text(), nil
}
