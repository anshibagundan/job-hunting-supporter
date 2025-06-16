import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    // 実際のWhisper APIを使用する場合のコード例
    // const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    //   body: formData,
    // })

    // デモ用のモック文字起こし結果
    const mockTranscript = `面接官: 本日はお忙しい中お時間をいただき、ありがとうございます。まず自己紹介をお願いします。

応募者: ありがとうございます。私は○○大学の△△学部で情報工学を専攻している□□と申します。大学では主にWebアプリケーション開発を学んでおり、チーム開発の経験もあります。

面接官: プログラミングはいつ頃から始められましたか？

応募者: 大学1年生の時に授業で初めて触れて、その面白さに魅力を感じました。特にユーザーが実際に使えるものを作れることに興味を持ち、独学でReactやNode.jsを学習しました。

面接官: 弊社を志望される理由を教えてください。

応募者: 御社の「技術で社会課題を解決する」という理念に強く共感しました。特に教育分野でのDX推進に取り組まれている点が、私の将来やりたいことと一致しています。`

    // GPTで面接内容を分析
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `あなたは就活支援の専門家です。面接の文字起こしを分析し、以下の形式でJSONレスポンスを返してください：

{
  "transcript": "文字起こし内容（そのまま）",
  "summary": "面接の要点を3-4行で要約",
  "feedback": "応答の改善点やアドバイスを3-4行で提供"
}

分析の観点：
- 質問への回答の適切さ
- 具体性と説得力
- 志望動機の明確さ
- コミュニケーション能力
- 改善すべき点

日本語で回答し、建設的で実用的なアドバイスを心がけてください。`,
      prompt: `以下の面接の文字起こしを分析してください：\n\n${mockTranscript}`,
    })

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({
        transcript: mockTranscript,
        summary: analysis.summary,
        feedback: analysis.feedback,
      })
    } catch (parseError) {
      return NextResponse.json({
        transcript: mockTranscript,
        summary: "面接内容を確認しました。全体的に良い回答ができていました。",
        feedback: "具体的なエピソードを交えることで、より説得力のある回答になります。",
      })
    }
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
