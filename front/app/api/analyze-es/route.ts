import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `あなたは就活支援の専門家です。学生のエントリーシート（ES）を分析し、以下の形式でJSONレスポンスを返してください：

{
  "summary": "ESの要点を3-4行で要約",
  "feedback": "具体的な改善アドバイスを3-4行で提供"
}

分析の観点：
- 志望動機の明確さ
- 具体的なエピソードの有無
- 企業との適合性
- 文章の構成と読みやすさ
- 独自性・差別化要素

日本語で回答し、建設的で実用的なアドバイスを心がけてください。`,
      prompt: `以下のエントリーシートを分析してください：\n\n${content}`,
    })

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json(analysis)
    } catch (parseError) {
      // JSONパースに失敗した場合のフォールバック
      return NextResponse.json({
        summary: text.split("\n")[0] || "ES内容を確認しました。",
        feedback: text.split("\n").slice(1).join("\n") || "詳細な分析を行いました。",
      })
    }
  } catch (error) {
    console.error("Error analyzing ES:", error)
    return NextResponse.json({ error: "Failed to analyze ES" }, { status: 500 })
  }
}
