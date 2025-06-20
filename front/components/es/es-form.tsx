import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useESForm } from "@/components/es/hooks/useEsForm"
import { useAIAnalysis } from "@/components/es/hooks/useAiAnalysis"
import { storage, type ESEntry } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"

interface ESFormProps {
  entry?: ESEntry | null
  onSubmit: (entry: ESEntry) => void
  onCancel: () => void
  preSelectedCompanyId?: string | null
}

export function ESForm({ entry, onSubmit, onCancel, preSelectedCompanyId }: ESFormProps) {
  const { formData, updateField, updateCompany, resetForm, isFormValid } = useESForm(entry, preSelectedCompanyId)
  const { isAnalyzing, analyzeContent } = useAIAnalysis()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [open, setOpen] = useState(false)

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
            <Button type="submit" disabled={!isFormValid() || isAnalyzing}>
              保存
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !formData.content.trim()}
            >
              {isAnalyzing ? "分析中..." : (formData.summary || formData.advice) ? "再分析" : "分析"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isAnalyzing}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
