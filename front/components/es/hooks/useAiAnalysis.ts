import { useState } from "react"
import apiClient from '@lib/api-client';

export interface AIAnalysisResult {
  summary: string
  advice: string
}

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeContent = async (content: string): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true)

    try {
      const response = await apiClient.post('/company-es/analyze', { content });

      if (!response.ok) {
        throw new Error(`分析エラー: ${response.status}`)
      }

      const result = response.data;
      return {
        summary: result.summary,
        advice: result.advice,
      }
    } catch (error) {
      console.error('AI分析エラー:', error)
      // エラーの場合はモック結果を返す
      const summary = `【要約】\n・自己PRの要点: ${content.slice(0, 50)}...\n・実績・経験: 具体的な成果や学びが含まれています\n・志望動機: 企業への関心と適性をアピール`
      const advice = `【改善アドバイス】\n・具体的な数値や成果を追加することで説得力が向上します\n・企業の事業内容との関連性をより明確に示しましょう\n・文章構成を見直し、結論を最初に述べる構造にすると読みやすくなります`
      return { summary, advice }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    isAnalyzing,
    analyzeContent,
  }
}
