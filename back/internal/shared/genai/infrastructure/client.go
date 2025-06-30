package genaiinfra

import (
	"context"
	"encoding/json"
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

// デフォルトの評価カテゴリ
var defaultEvaluationCategories = []string{
	"具体性の向上（数値や成果の追加）",
	"企業との関連性の明確化",
	"文章構成の改善提案",
	"インパクトの向上方法",
	"読みやすさの改善",
}

// デフォルトの企業分析評価カテゴリ
var defaultCompanyEvaluationCategories = []string{
	"企業理解と志望動機の明確化",
	"企業文化・価値観との適合性",
	"業界知識と関連性の表現",
	"具体的な貢献可能性の提示",
	"企業が求める人材像との一致度",
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

// generateCompanyAdvicePrompt は企業情報を含む動的なアドバイスプロンプトを生成します
func generateCompanyAdvicePrompt(content string, companyName string, companyDescription string, industry string, categories []string) string {
	// カテゴリ一覧を動的に生成
	categoriesText := ""
	for i, category := range categories {
		categoriesText += fmt.Sprintf("%d. %s\n", i+1, category)
	}

	// 出力形式を動的に生成
	outputFormat := ""
	for i, category := range categories {
		outputFormat += fmt.Sprintf(`## %d. %s
**達成度: XX%%**
**評価理由:** [企業の特色を踏まえた現在の状況の説明]
**改善提案:** [企業に特化した具体的な改善アドバイス]

`, i+1, category)
	}

	return fmt.Sprintf(`以下のエントリーシート内容を企業情報と照らし合わせて分析し、各項目の達成度を%%で評価し、企業に特化した改善アドバイスを提供してください。

【分析対象ES】
%s

【企業情報】
企業名: %s
業界: %s
企業説明: %s

【評価・アドバイス項目】
以下の各項目について、企業の特色を踏まえた現在の達成度を0-100%%で評価し、その理由と具体的な改善提案を提供してください。

%s
【出力形式】
各項目について以下の形式で出力してください：

%s企業の特色を活かした建設的で具体的なアドバイスを日本語で提供してください。`, content, companyName, industry, companyDescription, categoriesText, outputFormat)
}

// generateAdvicePrompt は動的にアドバイスプロンプトを生成します
func generateAdvicePrompt(content string, categories []string) string {
	// カテゴリ一覧を動的に生成
	categoriesText := ""
	for i, category := range categories {
		categoriesText += fmt.Sprintf("%d. %s\n", i+1, category)
	}

	// 出力形式を動的に生成
	outputFormat := ""
	for i, category := range categories {
		outputFormat += fmt.Sprintf(`## %d. %s
**達成度: XX%%**
**評価理由:** [現在の状況の説明]
**改善提案:** [具体的な改善アドバイス]

`, i+1, category)
	}

	return fmt.Sprintf(`以下のエントリーシート内容を分析し、各項目の達成度を%%で評価し、改善アドバイスを提供してください。

【分析対象】
%s

【評価・アドバイス項目】
以下の各項目について、現在の達成度を0-100%%で評価し、その理由と具体的な改善提案を提供してください。

%s
【出力形式】
各項目について以下の形式で出力してください：

%s建設的で具体的なアドバイスを日本語で提供してください。`, content, categoriesText, outputFormat)
}

func (g *GenAIClientImpl) AnalyzeESContent(content string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
	return g.AnalyzeESContentWithCategories(content, defaultEvaluationCategories)
}

func (g *GenAIClientImpl) AnalyzeESContentWithCategories(content string, categories []string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
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

	// 改善アドバイスを生成するプロンプト（動的カテゴリを使用）
	advicePrompt := generateAdvicePrompt(content, categories)

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
	adviceItemsList := parseAdviceResponse(adviceText, categories)

	return summaryResp.Text(), adviceText, adviceItemsList, nil
}

// AnalyzeBaseESContent は基本ES分析（企業情報なし）を実行します
func (g *GenAIClientImpl) AnalyzeBaseESContent(content string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
	return g.AnalyzeBaseESContentWithCategories(content, defaultEvaluationCategories)
}

func (g *GenAIClientImpl) AnalyzeBaseESContentWithCategories(content string, categories []string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
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

	// アドバイスを生成するプロンプト（動的カテゴリを使用）
	advicePrompt := generateAdvicePrompt(content, categories)

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
	adviceItemsList := parseAdviceResponse(adviceText, categories)

	return summaryResp.Text(), adviceText, adviceItemsList, nil
}

// parseAdviceResponse は、AI応答から構造化されたアドバイス情報を抽出します
func parseAdviceResponse(adviceText string, categories []string) []domain.AdviceItem {

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

		// 達成度を抽出（**達成度: XX%**形式）
		achievementRe := regexp.MustCompile(`\*\*達成度:\s*(\d+)%\*\*`)
		if match := achievementRe.FindStringSubmatch(section); len(match) >= 2 {
			if parsed, err := strconv.Atoi(match[1]); err == nil {
				achievement = parsed
			}
		}

		// 評価理由を抽出（改行を考慮）
		reasonRe := regexp.MustCompile(`\*\*評価理由:\*\*\s*([^\*]+?)(?:\*\*改善提案|$)`)
		if match := reasonRe.FindStringSubmatch(section); len(match) >= 2 {
			reason = strings.TrimSpace(match[1])
		}

		// 改善提案を抽出（改行を考慮）
		suggestionRe := regexp.MustCompile(`\*\*改善提案:\*\*\s*(.+?)(?:\n\n##|$)`)
		if match := suggestionRe.FindStringSubmatch(strings.ReplaceAll(section, "\n", " ")); len(match) >= 2 {
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

// GenerateESContent は BaseES、企業説明、ESタイトルからESの内容を自動生成します
func (g *GenAIClientImpl) GenerateESContent(baseES string, companyDescription string, esTitle string) (content string, err error) {
	ctx := context.Background()

	// ES自動生成のプロンプト
	prompt := fmt.Sprintf(`
あなたは就職活動のエントリーシート作成をサポートするAIアシスタントです。
以下の情報を基に、具体的で説得力のあるエントリーシート内容を生成してください。

【基本ES（ユーザーの自己PR）】
%s

【企業情報・説明】
%s

【ESのタイトル・テーマ】
%s

【生成時の注意点】
1. ユーザーの基本ESの内容を活かしつつ、企業の特色に合わせてカスタマイズしてください
2. 企業の事業内容、価値観、求める人材像に言及してください
3. 具体的なエピソードや経験を含めてください
4. 400-600文字程度で作成してください
5. 読みやすい文章構成にしてください
6. 志望動機の場合は「なぜその企業なのか」を明確にしてください
7. 自己PRの場合は「その企業でどう活かせるか」を示してください

【期待する出力】
企業に合わせたオリジナルのエントリーシート内容を日本語で出力してください。
`, baseES, companyDescription, esTitle)

	contents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(prompt),
		}, genai.RoleUser),
	}

	resp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", contents, nil)
	if err != nil {
		return "", fmt.Errorf("ES content generation failed: %w", err)
	}

	return resp.Text(), nil
}

// AnalyzeESContentWithCompany は企業情報を含めたES内容の分析を行います
func (g *GenAIClientImpl) AnalyzeESContentWithCompany(content string, companyName string, companyDescription string, industry string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
	return g.AnalyzeESContentWithCompanyAndCategories(content, companyName, companyDescription, industry, defaultCompanyEvaluationCategories)
}

func (g *GenAIClientImpl) AnalyzeESContentWithCompanyAndCategories(content string, companyName string, companyDescription string, industry string, categories []string) (summary string, advice string, adviceItems []domain.AdviceItem, err error) {
	ctx := context.Background()

	// 企業情報を含めた要約を生成するプロンプト
	summaryPrompt := fmt.Sprintf(`以下のエントリーシート内容を企業情報と照らし合わせて分析し、要約を作成してください。

【分析対象ES】
%s

【企業情報】
企業名: %s
業界: %s
企業説明: %s

【要約の観点】
1. 自己PRの核となる要点
2. 具体的な実績・経験
3. 志望動機の要点
4. 企業との適合性
5. 文字数や構成について

企業の特色や求める人材像との関連性も含めて日本語で簡潔に要約してください。`, content, companyName, industry, companyDescription)

	summaryContents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(summaryPrompt),
		}, genai.RoleUser),
	}

	summaryResp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", summaryContents, nil)
	if err != nil {
		return "", "", nil, fmt.Errorf("summary generation failed: %w", err)
	}

	// 企業情報を含めた改善アドバイスを生成するプロンプト（動的カテゴリを使用）
	advicePrompt := generateCompanyAdvicePrompt(content, companyName, companyDescription, industry, categories)

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
	adviceItemsList := parseAdviceResponse(adviceText, categories)

	return summaryResp.Text(), adviceText, adviceItemsList, nil
}

// GenerateCompanyInfo は企業名から企業情報を自動生成します
func (g *GenAIClientImpl) GenerateCompanyInfo(companyName string) (domain.CompanyInfo, error) {
	ctx := context.Background()

	// 企業情報生成のプロンプト
	prompt := fmt.Sprintf(`
あなたは企業情報を調査・生成するAIアシスタントです。
以下の企業名について、公開されている情報を基に企業情報を生成してください。

【企業名】
%s

【生成すべき情報】
1. 企業名（正式名称）
2. ウェブサイトURL（企業の公式サイト）
3. 企業説明（事業内容、バリュー、パーパス、ミッション、製品、求めている人材について詳しく）
4. 企業ロゴ画像URL（利用可能な場合）
5. 業界（例: IT、製造、金融、サービス等）

【出力形式】
以下のJSON形式で出力してください：
{
  "name": "企業の正式名称",
  "website": "https://www.example.com",
  "description": "企業の詳細な説明（バリュー、パーパス、ミッション、製品、求めている人材について400-600文字）",
  "image": "企業ロゴのURL（利用可能な場合）またはプレースホルダー画像URL",
  "industry": "業界名"
}

【注意事項】
- 最新の公開情報を基に正確な情報を提供してください
- 企業説明では、バリューやパーパス、ミッション、主要製品・サービス、求めている人材像について詳しく記載してください
- ウェブサイトURLは正確なものを提供してください
- 画像URLが不明な場合は "https://via.placeholder.com/300x200?text=Company+Logo" を使用してください

JSONのみを出力し、余計な説明は含めないでください。
`, companyName)

	contents := []*genai.Content{
		genai.NewContentFromParts([]*genai.Part{
			genai.NewPartFromText(prompt),
		}, genai.RoleUser),
	}

	resp, err := g.client.Models.GenerateContent(ctx, "gemini-1.5-flash", contents, nil)
	if err != nil {
		return domain.CompanyInfo{}, fmt.Errorf("company info generation failed: %w", err)
	}

	responseText := resp.Text()

	// JSONレスポンスをパースして構造体に変換
	var companyInfo domain.CompanyInfo

	// JSON部分を抽出（```json と ``` で囲まれている場合の対応）
	jsonStart := strings.Index(responseText, "{")
	jsonEnd := strings.LastIndex(responseText, "}")

	if jsonStart == -1 || jsonEnd == -1 {
		return domain.CompanyInfo{}, fmt.Errorf("invalid JSON response from AI")
	}

	jsonText := responseText[jsonStart : jsonEnd+1]

	// JSONをパース
	err = json.Unmarshal([]byte(jsonText), &companyInfo)
	if err != nil {
		// パースエラーの場合は、デフォルト値で構造体を作成
		return domain.CompanyInfo{
			Name:        companyName,
			WebURL:      "https://www.example.com",
			Description: fmt.Sprintf("%sに関する詳細な企業情報を取得できませんでした。", companyName),
			Img:         "https://via.placeholder.com/300x200?text=Company+Logo",
			Industry:    "その他",
		}, fmt.Errorf("failed to parse company info JSON: %w", err)
	}

	return companyInfo, nil
}
