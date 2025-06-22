"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart3, FileText, Loader2 } from "lucide-react";
import { useBaseESAnalysis, type BaseESAnalysisResult } from "@/components/es/hooks/useBaseESAnalysis";
import { useState } from "react";

interface BaseESAnalysisProps {
  baseES: string;
}

export function BaseESAnalysis({ baseES }: BaseESAnalysisProps) {
  const { isAnalyzing, analyzeContent } = useBaseESAnalysis();
  const [analysisResult, setAnalysisResult] = useState<BaseESAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!baseES.trim()) return;
    
    try {
      const result = await analyzeContent(baseES);
      setAnalysisResult(result);
    } catch (error) {
      console.error("基本ES分析エラー:", error);
    }
  };

  if (!baseES.trim()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            基本ES分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">基本ESが設定されていません</p>
            <p className="text-gray-400 text-sm">
              基本ESを入力すると、AI分析が利用できます
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              基本ES分析
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {analysisResult ? "再分析" : "分析実行"}
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysisResult ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">AI分析結果がありません</p>
              <p className="text-gray-400 text-sm">
                「分析実行」ボタンをクリックして基本ESを分析してください
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 分析要約 */}
              <div>
                <h4 className="font-medium text-lg mb-3">分析要約</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* 項目別達成度評価 */}
              {analysisResult.adviceItems && analysisResult.adviceItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    項目別達成度評価
                  </h4>
                  <div className="space-y-6">
                    {analysisResult.adviceItems.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium text-sm">{item.category}</h5>
                          <span className="text-sm font-medium text-blue-600">
                            {item.achievement}%
                          </span>
                        </div>
                        <Progress value={item.achievement} className="h-2" />
                        <div className="space-y-2 text-sm">
                          <div className="bg-yellow-50 p-3 rounded-md">
                            <span className="font-medium text-yellow-800">評価理由:</span>{" "}
                            <span className="text-yellow-700">{item.reason}</span>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md">
                            <span className="font-medium text-green-800">改善提案:</span>{" "}
                            <span className="text-green-700">{item.suggestion}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 詳細なアドバイス */}
              <div>
                <h4 className="font-medium text-lg mb-3">詳細なアドバイス</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {analysisResult.advice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
