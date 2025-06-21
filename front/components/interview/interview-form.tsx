"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Mic, Upload, Calendar, MapPin, Video, Building, FileText, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AudioUploader from "@/components/interview/recorder/media-recorder"
import { fetchAllCompanies, convertCompanyToFrontend } from "@/components/company/api"
import type { InterviewLog, Company } from "@/lib/supabase"

interface InterviewFormProps {
  onSubmit: (data: {
    InterviewLog: InterviewLog
  }) => Promise<void>
  onCancel: () => void
  initialData?: Partial<InterviewLog>
  title?: string
}

export function InterviewForm({ onSubmit, onCancel, initialData, title }: InterviewFormProps) {
  const [formData, setFormData] = useState({
    company: initialData?.company || null,
    interviewAt: initialData?.interviewAt ? 
      new Date(initialData.interviewAt).toISOString().slice(0, 16) : "",
    stage: initialData?.stage || "一次面接",
    location: initialData?.location || "",
    meetingUrl: initialData?.meetingUrl || "",
    textNote: initialData?.textNote || "",
    audioSummary: initialData?.audioSummary || "",
  })
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 企業リストを取得（APIから直接）
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const backendCompanies = await fetchAllCompanies()
        const companiesData = backendCompanies.map(convertCompanyToFrontend)
        console.log("Loaded companies:", companiesData)
        setCompanies(companiesData)
      } catch (error) {
        console.error('Failed to load companies:', error)
      } finally {
        setCompaniesLoading(false)
      }
    }
    loadCompanies()
  }, [])

  const handleCompanyChange = useCallback((companyId: string) => {
    const selectedCompany = companies.find(c => c.id === companyId)
    if (selectedCompany) {
      setFormData(prev => ({ ...prev, company: selectedCompany }))
    }
  }, [companies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.company) {
      console.error("Company is required")
      return
    }
    setIsProcessing(true)
    
    try {
      await onSubmit({
        InterviewLog: {
          id: initialData?.id || "",
          userId: initialData?.userId || "1", // 固定値（JWTミドルウェアで上書きされる）
          company: formData.company,
          jobEventId: initialData?.jobEventId || "1", // 固定値
          interviewAt: formData.interviewAt ? new Date(formData.interviewAt).toISOString() : new Date().toISOString(),
          stage: formData.stage,
          location: formData.location,
          meetingUrl: formData.meetingUrl,
          textNote: formData.textNote,
          audioSummary: formData.audioSummary,
          audioFile: audioFile || null, // 音声ファイルはオプション
          createdAt: initialData?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title || "面接ログ"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Building className="h-4 w-4" />
              <h3 className="text-sm font-semibold">基本情報</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">企業名 *</Label>
                <Select
                  value={formData.company?.id || ""}
                  onValueChange={handleCompanyChange}
                  required
                  disabled={companiesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={companiesLoading ? "企業情報を読み込み中..." : "企業を選択してください"} />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stage">選考段階 *</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, stage: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選考段階を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="カジュアル面談">カジュアル面談</SelectItem>
                    <SelectItem value="一次面接">一次面接</SelectItem>
                    <SelectItem value="二次面接">二次面接</SelectItem>
                    <SelectItem value="三次面接">三次面接</SelectItem>
                    <SelectItem value="最終面接">最終面接</SelectItem>
                    <SelectItem value="内定">内定</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="interviewAt">面接日時 *</Label>
              <Input
                id="interviewAt"
                type="datetime-local"
                value={formData.interviewAt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, interviewAt: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <h3 className="text-sm font-semibold">面接場所</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  面接場所
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="例: 東京オフィス 2F会議室"
                />
              </div>
              
              <div>
                <Label htmlFor="meetingUrl">
                  <Video className="h-3 w-3 inline mr-1" />
                  オンライン面接URL
                </Label>
                <Input
                  id="meetingUrl"
                  type="url"
                  value={formData.meetingUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, meetingUrl: e.target.value }))
                  }
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Mic className="h-4 w-4" />
              <h3 className="text-sm font-semibold">面接内容</h3>
            </div>
            
            {/* Audio Upload */}
            <div>
              <Label>音声ファイル（オプション）</Label>
              <p className="text-xs text-gray-500 mb-2">
                音声をアップロードすると、AIが自動で文字起こしと要約を生成します
              </p>
              <AudioUploader 
                audioFile={audioFile}
                onFileChange={setAudioFile}
              />
            </div>
            
            {/* Manual Notes */}
            <div>
              <Label htmlFor="textNote">
                <FileText className="h-3 w-3 inline mr-1" />
                面接メモ
              </Label>
              <Textarea
                id="textNote"
                value={formData.textNote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, textNote: e.target.value }))
                }
                rows={8}
                placeholder="面接の内容や感想を入力してください...&#10;例：&#10;- 質問された内容&#10;- 自分の回答&#10;- 面接官の印象&#10;- 気づいたこと"
              />
            </div>
          </div>

          {/* AI Generated Fields (Editable) */}
          {initialData?.audioSummary && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">AI生成要約（編集可能）</h3>
                </div>
                
                <div>
                  <Label htmlFor="audioSummary">
                    <Brain className="h-3 w-3 inline mr-1" />
                    面接要約（Markdown記法対応）
                  </Label>
                  <Textarea
                    id="audioSummary"
                    value={formData.audioSummary || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, audioSummary: e.target.value }))
                    }
                    rows={6}
                    placeholder="AI生成された要約を編集できます。Markdown記法が使用できます。"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    **太字**、*斜体*、- リスト、## 見出し などのMarkdown記法が使用できます
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  {audioFile ? "保存・分析" : "保存"}
                </>
              )}
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