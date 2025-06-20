import type React from "react"
import { useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useESForm } from "@/components/es/hooks/useEsForm"
import { useAIAnalysis } from "@/components/es/hooks/useAiAnalysis"
import type { ESEntry } from "@/lib/supabase"

interface ESFormProps {
  entry?: ESEntry | null
  onSubmit: (entry: ESEntry) => void
  onCancel: () => void
}

export function ESForm({ entry, onSubmit, onCancel }: ESFormProps) {
  const { formData, updateField, resetForm, isFormValid } = useESForm(entry)
  const { isAnalyzing, analyzeContent } = useAIAnalysis()

  // 編集モードかどうかを判定
  const isEditMode = useMemo(() => Boolean(entry), [entry])

  // フォームタイトルをuseMemoで最適化
  const formTitle = useMemo(() => {
    return entry ? "ES編集" : "新しいES"
  }, [entry])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) return

    // 新しいエントリーを作成（IDと作成日時を設定）
    const newEntry: ESEntry = {
      ...formData,
      id: formData.id || Date.now().toString(),
      created_at: formData.created_at || new Date().toISOString(),
    }

    onSubmit(newEntry)
    if (!isEditMode) {
      resetForm()
    }
  }, [formData, isFormValid, onSubmit, resetForm, isEditMode])

  const handleAnalyze = useCallback(async () => {
    if (!formData.content.trim()) return

    const result = await analyzeContent(formData.content)
    // 分析結果をformDataに反映
    updateField("summary", result.summary)
    updateField("advice", result.advice)
  }, [formData.content, analyzeContent, updateField])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">企業名</label>
            <Input
              value={formData.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">タイトル</label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="例: 志望動機、自己PR"
              required
            />
          </div>          <div>
            <label className="block text-sm font-medium mb-2">内容</label>
            <Textarea
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={10}
              placeholder="ESの内容を入力してください..."
              required
            />
          </div>

          {/* AI分析結果表示 */}
          {(formData.summary || formData.advice) && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI分析 - 要約</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {formData.summary}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI分析 - アドバイス</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {formData.advice}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex space-x-2">
            <Button type="submit" disabled={!isFormValid()}>
              保存
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !formData.content.trim()}
            >
              {isAnalyzing ? "分析中..." : isEditMode ? "再分析" : "分析"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
