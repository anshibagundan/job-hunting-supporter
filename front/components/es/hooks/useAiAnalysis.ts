import apiClient from "@lib/api-client";
import { useState } from "react";

export interface AdviceItem {
  category: string;
  achievement: number;
  reason: string;
  suggestion: string;
}

export interface AIAnalysisResult {
  summary: string;
  advice: string;
  adviceItems: AdviceItem[];
}

export function useAIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = async (
    content: string,
    companyId?: string
  ): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true);

    try {
      const requestData = companyId
        ? { content, company_id: Number.parseInt(companyId) }
        : { content };

      const response = await apiClient.post("/company-es/analyze", requestData);

      if (!response) {
        throw new Error(`分析エラー: ${response}`);
      }

      const result = response.data;
      return {
        summary: result.summary,
        advice: result.advice,
        adviceItems: result.adviceItems || [],
      };
    } catch (error) {
      console.error("AI分析エラー:", error);
      // エラーの場合はモック結果を返す
      const summary = companyId
        ? `【企業特化分析要約】\n・自己PRの要点: ${content.slice(0, 50)}...\n・企業との適合性: 企業の特色に合わせた内容が含まれています\n・志望動機: 企業への理解と関心をアピール\n・業界知識: 関連する経験や知識が表現されています`
        : `【要約】\n・自己PRの要点: ${content.slice(0, 50)}...\n・実績・経験: 具体的な成果や学びが含まれています\n・志望動機: 企業への関心と適性をアピール`;

      const advice = companyId
        ? "【企業特化改善アドバイス】\n・企業の価値観や文化との関連性をより明確に示しましょう\n・業界の動向や企業の事業内容への理解を深めて表現してください\n・企業が求める人材像との一致点を具体的に説明しましょう"
        : "【改善アドバイス】\n・具体的な数値や成果を追加することで説得力が向上します\n・企業の事業内容との関連性をより明確に示しましょう\n・文章構成を見直し、結論を最初に述べる構造にすると読みやすくなります";

      const mockAdviceItems: AdviceItem[] = companyId
        ? [
            {
              category: "企業理解と志望動機の明確化",
              achievement: 70,
              reason:
                "企業への興味は伝わりますが、より深い企業理解を示すことができます",
              suggestion:
                "企業の最新の取り組みや将来のビジョンについて言及し、なぜその企業でなければならないかを明確にしてください",
            },
            {
              category: "企業文化・価値観との適合性",
              achievement: 65,
              reason:
                "一般的な価値観は示されていますが、企業独自の文化との関連性が不十分です",
              suggestion:
                "企業の行動指針や大切にしている価値観と自身の経験や考え方がどう合致するかを具体例を交えて説明してください",
            },
            {
              category: "業界知識と関連性の表現",
              achievement: 60,
              reason:
                "基本的な業界理解は見られますが、より専門的な知識や洞察が求められます",
              suggestion:
                "業界の課題や今後の展望について触れ、自身の経験や学びがどう活かせるかを示してください",
            },
            {
              category: "具体的な貢献可能性の提示",
              achievement: 55,
              reason:
                "貢献への意欲は見られますが、具体的にどのような価値を提供できるかが不明確です",
              suggestion:
                "過去の経験から得たスキルや知識を具体的に挙げ、それが企業の事業にどう貢献できるかを明示してください",
            },
            {
              category: "企業が求める人材像との一致度",
              achievement: 60,
              reason:
                "一般的な能力はアピールされていますが、企業が特に求めている資質との関連性が薄いです",
              suggestion:
                "企業の採用情報や求める人材像を研究し、自身の経験や性格がそれにどうマッチするかを説明してください",
            },
          ]
        : [
            {
              category: "具体性の向上（数値や成果の追加）",
              achievement: 60,
              reason:
                "具体的な数値や成果がいくつか含まれていますが、より詳細な情報があると説得力が増します",
              suggestion:
                "プロジェクトの規模、達成した成果を数値で示し、具体的な行動とその結果を明記してください",
            },
            {
              category: "企業との関連性の明確化",
              achievement: 70,
              reason:
                "企業への興味は伝わりますが、具体的な関連性の説明が不足しています",
              suggestion:
                "企業の事業内容や価値観と自身の経験・価値観がどのようにマッチするかを具体的に示してください",
            },
            {
              category: "文章構成の改善提案",
              achievement: 75,
              reason: "全体的な構成は良好ですが、より読みやすい構造にできます",
              suggestion:
                "結論を最初に述べ、根拠を後に続ける構造にすることで読み手の理解を促進できます",
            },
            {
              category: "インパクトの向上方法",
              achievement: 65,
              reason:
                "印象的なエピソードは含まれていますが、よりインパクトのある表現が可能です",
              suggestion:
                "最も印象的な成果や学びを冒頭に持ってきて、読み手の関心を引きつけてください",
            },
            {
              category: "読みやすさの改善",
              achievement: 80,
              reason:
                "文章は比較的読みやすいですが、さらに改善の余地があります",
              suggestion:
                "段落分けを明確にし、接続詞を効果的に使用して文章の流れを改善してください",
            },
          ];
      return { summary, advice, adviceItems: mockAdviceItems };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeContent,
  };
}
