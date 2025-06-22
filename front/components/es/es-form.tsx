import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Check, ChevronsUpDown, Wand2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useESForm } from "@/components/es/hooks/useEsForm"
import { useAIAnalysis } from "@/components/es/hooks/useAiAnalysis"
import { useESGeneration } from "@/components/es/hooks/useESGeneration"
import { useUserProfile } from "@/hooks/useAuth"
import { storage, type ESEntry, type AdviceItem } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"
import { SemiCircleProgress } from "@/components/ui/semi-circle-progress"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

interface ESFormProps {
  entry?: ESEntry | null
  onSubmit: (entry: ESEntry) => void
  onCancel: () => void
  preSelectedCompanyId?: string | null
}

export function ESForm({ entry, onSubmit, onCancel, preSelectedCompanyId }: ESFormProps) {
  const { formData, setFormData, updateField, updateCompany, resetForm, isFormValid } = useESForm(entry, preSelectedCompanyId)
  const { isAnalyzing, analyzeContent } = useAIAnalysis()
  const { isGenerating, generateContent } = useESGeneration()
  const { userProfile } = useUserProfile()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // ユーザーのBaseESを取得
  const userBaseES = userProfile?.basic_es || ""

  // 利用可能な企業リストを取得
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await storage.getCompanies()
        setCompanies(companiesData)
      } catch (error) {
        console.error('Failed to load companies:', error)
      } finally {
        setCompaniesLoading(false)
      }
    }

    loadCompanies()
  }, [])

  // 編集モードかどうかを判定
  const isEditMode = useMemo(() => Boolean(entry), [entry])

  // フォームタイトルをuseMemoで最適化
  const formTitle = useMemo(() => {
    return entry ? "ES編集" : "新しいES"
  }, [entry])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return
    onSubmit(formData)
    if (!isEditMode) {
      resetForm()
    }
  }, [formData, isFormValid, onSubmit, resetForm, isEditMode])

  const handleAnalyze = useCallback(async () => {
    if (!formData.content.trim() || !formData.company?.id) return

    const result = await analyzeContent(formData.content, formData.company.id)
    // 分析結果をformDataに反映
    updateField("summary", result.summary)
    updateField("advice", result.advice)
    setFormData(prev => ({ ...prev, adviceItems: result.adviceItems }))
  }, [formData.content, formData.company?.id, analyzeContent, updateField, setFormData])

  // ES自動生成機能
  const handleGenerate = useCallback(async () => {
    if (!formData.company?.id || !formData.title.trim() || !userBaseES.trim()) {
      alert("企業、タイトル、BaseESが必要です。プロフィールでBaseESを設定してください。")
      return
    }

    try {
      const result = await generateContent(userBaseES, formData.company.description, formData.title)
      updateField("content", result.content)
    } catch (error) {
      console.error("ES生成に失敗しました:", error)
      alert("ES生成に失敗しました")
    }
  }, [formData.company, formData.title, userBaseES, generateContent, updateField])

  // 達成度の色を決定する関数
  const getAchievementColor = (achievement: number) => {
    if (achievement >= 80) return "bg-green-500"
    if (achievement >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">企業名</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={companiesLoading}
                >
                  {formData.company?.name || (companiesLoading ? "企業情報を読み込み中..." : "企業を選択してください")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="企業を検索..." />
                  <CommandEmpty>企業が見つかりません。</CommandEmpty>
                  <CommandList>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {companies.map((company) => (
                        <CommandItem
                          key={company.id}
                          value={company.name}
                          onSelect={() => {
                            updateCompany(company)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.company?.id === company.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {company.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">タイトル</label>
            <Input
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="例: 志望動機、自己PR"
              required
            />
          </div>

          {/* AI自動生成ボタン */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-blue-900">AI自動生成</h3>
              <Wand2 className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 mb-3">
              BaseESと企業情報から、ESの内容を自動生成します
              {!userBaseES && (
                <span className="block text-red-600 mt-1">
                  ※ BaseESが設定されていません。プロフィールで設定してください。
                </span>
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating || !formData.company?.id || !formData.title.trim() || !userBaseES.trim()}
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isGenerating ? "生成中..." : "AI生成"}
            </Button>
          </div>

          <div>
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
          {formData.summary && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI分析 - 要約</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={formData.summary} />
                </CardContent>
              </Card>

              {/* 項目別達成度評価セクション */}
              {formData.adviceItems && formData.adviceItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">項目別達成度評価</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {formData.adviceItems.map((item, index) => (
                      <AdviceItemFormCard key={index} item={item} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            <Button type="submit" disabled={!isFormValid() || isAnalyzing || isGenerating}>
              保存
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAnalyze}
              disabled={isAnalyzing || isGenerating || !formData.content.trim() || !formData.company?.id}
            >
              {isAnalyzing ? "分析中..." : (formData.summary || formData.advice) ? "再分析" : "分析"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isAnalyzing || isGenerating}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface AdviceItemFormCardProps {
  item: {
    category: string;
    achievement: number;
    reason: string;
    suggestion: string;
  };
}

function AdviceItemFormCard({ item }: AdviceItemFormCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 達成度表示部分 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-base mb-2">{item.category}</h4>
        </div>
        <div className="flex items-center gap-4">
          <SemiCircleProgress value={item.achievement} size={100} strokeWidth={6} />
        </div>
      </div>

      {/* 詳細情報（クリックで表示/非表示） */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
          >
            <span className="text-sm text-gray-600">
              {isOpen ? "詳細を閉じる" : "詳細を表示"}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-1">評価理由</h5>
              <p className="text-sm text-gray-600">{item.reason}</p>
            </div>
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-1">改善提案</h5>
              <p className="text-sm text-gray-600">{item.suggestion}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
