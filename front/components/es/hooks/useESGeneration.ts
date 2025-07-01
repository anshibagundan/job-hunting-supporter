import { useCallback, useState } from "react";
import { generateESContent } from "@/components/es/api";

export interface ESGenerationResult {
  content: string;
}

export function useESGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = useCallback(
    async (
      baseES: string,
      companyDescription: string,
      esTitle: string
    ): Promise<ESGenerationResult> => {
      if (!baseES.trim() || !companyDescription.trim() || !esTitle.trim()) {
        throw new Error("BaseES、企業説明、ESタイトルがすべて必要です");
      }

      try {
        setIsGenerating(true);
        const result = await generateESContent(
          baseES,
          companyDescription,
          esTitle
        );
        return { content: result.content };
      } catch (error) {
        console.error("ES generation failed:", error);
        throw new Error("ES生成に失敗しました");
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    isGenerating,
    generateContent,
  };
}
