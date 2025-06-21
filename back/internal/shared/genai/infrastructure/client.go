package genaiinfra

import (
	"context"
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"

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

func (g *GenAIClientImpl) AnalyzeESContent(content string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
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
		return "", "", nil, fmt.Errorf("summary generation failed: %w", err)
	}

	// 改善アドバイスを生成するプロンプト
	advicePrompt := fmt.Sprintf(`以下のエントリーシート内容を分析し、各項目の達成度を%で評価し、改善アドバイスを提供してください。

【分析対象】
%s

【評価・アドバイス項目】
以下の各項目について、現在の達成度を0-100%で評価し、その理由と具体的な改善提案を提供してください。

1. 具体性の向上（数値や成果の追加）
2. 企業との関連性の明確化
3. 文章構成の改善提案
4. インパクトの向上方法
5. 読みやすさの改善

【出力形式】
各項目について以下の形式で出力してください：

## 1. 具体性の向上（数値や成果の追加）
**達成度: XX%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

## 2. 企業との関連性の明確化
**達成度: XX%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

## 3. 文章構成の改善提案
**達成度: XX%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

## 4. インパクトの向上方法
**達成度: XX%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

## 5. 読みやすさの改善
**達成度: XX%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

建設的で具体的なアドバイスを日本語で提供してください。`, content)

	adviceContents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(advicePrompt),
		}, genai.RoleUser),
	}

	adviceResp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", adviceContents, nil)
	if err != nil {
		return summaryResp.Text(), "", nil, fmt.Errorf("advice generation failed: %w", err)
	}

	// アドバイステキストから構造化データを抽出
	adviceText := adviceResp.Text()
	adviceItemsList := parseAdviceResponse(adviceText)

	return summaryResp.Text(), adviceText, adviceItemsList, nil
}

// parseAdviceResponse は、AIの応答から構造化されたアドバイス情報を抽出します
func parseAdviceResponse(adviceText string) []domain.AdviceItem {
	categories := []string{
		"具体性の向上（数値や成果の追加）",
		"企業との関連性の明確化", 
		"文章構成の改善提案",
		"インパクトの向上方法",
		"読みやすさの改善",
	}

	var adviceItems []domain.AdviceItem
	
	// 各カテゴリーについてセクションごとに処理
	for i, category := range categories {
		// セクション番号とカテゴリー名でセクションを特定
		sectionStart := fmt.Sprintf("## %d. %s", i+1, category)
		nextSectionStart := ""
		if i+1 < len(categories) {
			nextSectionStart = fmt.Sprintf("## %d. %s", i+2, categories[i+1])
		}
		
		// セクション全体を抽出
		startIdx := strings.Index(adviceText, sectionStart)
		if startIdx == -1 {
			// セクションが見つからない場合はデフォルト値
			adviceItems = append(adviceItems, domain.AdviceItem{
				Category:    category,
				Achievement: 50,
				Reason:      "解析中にエラーが発生しました",
				Suggestion:  "詳細な分析は後ほど実施してください",
			})
			continue
		}
		
		// セクション終了位置を特定
		endIdx := len(adviceText)
		if nextSectionStart != "" {
			if nextIdx := strings.Index(adviceText[startIdx+1:], "##"); nextIdx != -1 {
				endIdx = startIdx + 1 + nextIdx
			}
		}
		
		section := adviceText[startIdx:endIdx]
		
		// デフォルト値
		achievement := 50
		reason := "解析中にエラーが発生しました"
		suggestion := "詳細な分析は後ほど実施してください"
		
		// 達成度を抽出（より柔軟なパターン）
		achievementRe := regexp.MustCompile(`\*\*達成度:\s*(\d+)%[!\*]*`)
		if match := achievementRe.FindStringSubmatch(section); len(match) >= 2 {
			if parsed, err := strconv.Atoi(match[1]); err == nil {
				achievement = parsed
			}
		}
		
		// 評価理由を抽出
		reasonRe := regexp.MustCompile(`\*\*評価理由:\*\*\s*([^*]+?)(?:\*\*|$)`)
		if match := reasonRe.FindStringSubmatch(section); len(match) >= 2 {
			reason = strings.TrimSpace(match[1])
		}
		
		// 改善提案を抽出
		suggestionRe := regexp.MustCompile(`\*\*改善提案:\*\*\s*([^#]+?)(?:##|$)`)
		if match := suggestionRe.FindStringSubmatch(section); len(match) >= 2 {
			suggestion = strings.TrimSpace(match[1])
		}
		
		adviceItems = append(adviceItems, domain.AdviceItem{
			Category:    category,
			Achievement: achievement,
			Reason:      reason,
			Suggestion:  suggestion,
		})
	}

	return adviceItems
}
