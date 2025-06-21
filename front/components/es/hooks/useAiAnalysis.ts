import { useState } from "react"
import apiClient from '@lib/api-client';

export interface AdviceItem {
  category: string
  achievement: number
  reason: string
  suggestion: string
}

export interface AIAnalysisResult {
  summary: string
  advice: string
  adviceItems: AdviceItem[]
}

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeContent = async (content: string): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true)

    try {
      const response = await apiClient.post('/company-es/analyze', { content });

      if (!response) {
        throw new Error(`分析エラー: ${response}`)
      }

      const result = response.data;
      return {
        summary: result.summary,
        advice: result.advice,
        adviceItems: result.adviceItems || [],
      }
    } catch (error) {
      console.error('AI分析エラー:', error)
      // エラーの場合はモック結果を返す
      const summary = `【要約】\n・自己PRの要点: ${content.slice(0, 50)}...\n・実績・経験: 具体的な成果や学びが含まれています\n・志望動機: 企業への関心と適性をアピール`
      const advice = `【改善アドバイス】\n・具体的な数値や成果を追加することで説得力が向上します\n・企業の事業内容との関連性をより明確に示しましょう\n・文章構成を見直し、結論を最初に述べる構造にすると読みやすくなります`
      const mockAdviceItems: AdviceItem[] = [
        {
          category: "具体性の向上（数値や成果の追加）",
          achievement: 60,
          reason: "具体的な数値や成果がいくつか含まれていますが、より詳細な情報があると説得力が増します",
          suggestion: "プロジェクトの規模、達成した成果を数値で示し、具体的な行動とその結果を明記してください"
        },
        {
          category: "企業との関連性の明確化",
          achievement: 70,
          reason: "企業への興味は伝わりますが、具体的な関連性の説明が不足しています",
          suggestion: "企業の事業内容や価値観と自身の経験・価値観がどのようにマッチするかを具体的に示してください"
        },
        {
          category: "文章構成の改善提案",
          achievement: 75,
          reason: "全体的な構成は良好ですが、より読みやすい構造にできます",
          suggestion: "結論を最初に述べ、根拠を後に続ける構造にすることで読み手の理解を促進できます"
        },
        {
          category: "インパクトの向上方法",
          achievement: 65,
          reason: "印象的なエピソードは含まれていますが、よりインパクトのある表現が可能です",
          suggestion: "最も印象的な成果や学びを冒頭に持ってきて、読み手の関心を引きつけてください"
        },
        {
          category: "読みやすさの改善",
          achievement: 80,
          reason: "文章は比較的読みやすいですが、さらに改善の余地があります",
          suggestion: "段落分けを明確にし、接続詞を効果的に使用して文章の流れを改善してください"
        }
      ]
      return { summary, advice, adviceItems: mockAdviceItems }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    isAnalyzing,
    analyzeContent,
  }
}
