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
	uploadedFile, err := g.client.Files.UploadFromPath(ctx, path, &genai.UploadFileConfig{
		MIMEType: "audio/wav",
	})
	if err != nil {
		log.Printf("upload failed: %v", err) // ← ここ
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
		log.Printf("generate content failed: %v", err)
		return "", fmt.Errorf("generate content failed: %w", err)
	}

	return resp.Text(), nil
}

func (g *GenAIClientImpl) AnalyzeInterviewContent(content string) (summary string, err error) {
	ctx := context.Background()

	// 要約を生成するプロンプト
	summaryPrompt := fmt.Sprintf(`
	以下のテキストは、ある候補者との面接内容を文字起こししたものです。
	
	この内容を読み取り、以下の観点に基づいて要約してください：
	
	- 面接全体の流れ（質問→回答など）
	- 候補者の話した経験やスキル
	- 強み・弱み、アピールポイント
	- 面接官からのフィードバック（あれば）
	- 総合的な印象（面接の手応えなど）
	
	【面接文字起こし】
	%s
	`, content)

	summaryContents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(summaryPrompt),
		}, genai.RoleUser),
	}

	summaryResp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", summaryContents, nil)
	if err != nil {
		return "", fmt.Errorf("summary generation failed: %w", err)
	}

	return summaryResp.Text(), nil

}

func (g *GenAIClientImpl) AnalyzeESContent(content string) (summary string, advice string, err error) {
	ctx := context.Background()

	// 要約を生成するプロンプト
	summaryPrompt := fmt.Sprintf(`以下のエントリーシート内容を分析し、要約を作成してください。

【分析対象】
%s

【要約の観点】
1. 自己PRの核となる要点
2. 具体的な実績・経験
3. 志望動機の要点
4. 文字数や構成について

日本語で簡潔に要約してください。`, content)

	summaryContents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(summaryPrompt),
		}, genai.RoleUser),
	}

	summaryResp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", summaryContents, nil)
	if err != nil {
		return "", "", fmt.Errorf("summary generation failed: %w", err)
	}

	// 改善アドバイスを生成するプロンプト
	advicePrompt := fmt.Sprintf(`以下のエントリーシート内容に対して、改善アドバイスを提供してください。

【分析対象】
%s

【アドバイスの観点】
1. 具体性の向上（数値や成果の追加）
2. 企業との関連性の明確化
3. 文章構成の改善提案
4. インパクトの向上方法
5. 読みやすさの改善

建設的で具体的なアドバイスを日本語で提供してください。`, content)

	adviceContents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(advicePrompt),
		}, genai.RoleUser),
	}

	adviceResp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", adviceContents, nil)
	if err != nil {
		return summaryResp.Text(), "", fmt.Errorf("advice generation failed: %w", err)
	}

	return summaryResp.Text(), adviceResp.Text(), nil
}
