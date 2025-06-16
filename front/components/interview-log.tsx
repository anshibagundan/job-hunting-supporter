"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Mic, Upload, Eye, FileAudio } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InterviewEntry {
  id: string
  company_name: string
  position: string
  interview_date: string
  transcript: string
  summary: string
  feedback: string
  created_at: string
}

export default function InterviewLog() {
  const [entries, setEntries] = useState<InterviewEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<InterviewEntry | null>(null)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    company_name: "",
    position: "",
    interview_date: "",
    notes: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data, error } = await supabase
        .from("interview_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching interview entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const processAudio = async (file: File) => {
    const formData = new FormData()
    formData.append("audio", file)

    try {
      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Transcription failed")

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error processing audio:", error)
      return {
        transcript: "音声の文字起こしに失敗しました。",
        summary: "音声処理に失敗しました。",
        feedback: "音声処理に失敗しました。",
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      let transcript = ""
      let summary = ""
      let feedback = ""

      if (audioFile) {
        // 音声ファイルを処理
        const audioResult = await processAudio(audioFile)
        transcript = audioResult.transcript
        summary = audioResult.summary
        feedback = audioResult.feedback
      } else if (formData.notes) {
        // テキストのみの場合は簡単な分析
        transcript = formData.notes
        summary = "手動入力による面接記録"
        feedback = "音声ファイルをアップロードすると、より詳細な分析が可能です。"
      }

      const { error } = await supabase.from("interview_entries").insert([
        {
          company_name: formData.company_name,
          position: formData.position,
          interview_date: formData.interview_date,
          transcript,
          summary,
          feedback,
          user_id: session.user.id,
        },
      ])

      if (error) throw error

      toast({
        title: "面接ログを保存しました",
        description: `${formData.company_name}の面接記録を保存しました`,
      })

      setFormData({
        company_name: "",
        position: "",
        interview_date: "",
        notes: "",
      })
      setAudioFile(null)
      setIsDialogOpen(false)
      fetchEntries()
    } catch (error) {
      toast({
        title: "エラー",
        description: "面接ログの保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 音声ファイルかチェック
      if (file.type.startsWith("audio/") || file.name.endsWith(".m4a")) {
        setAudioFile(file)
      } else {
        toast({
          title: "ファイル形式エラー",
          description: "音声ファイル（.mp3, .m4a, .wav等）を選択してください",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">面接ログ</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              面接ログを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新しい面接ログを追加</DialogTitle>
              <DialogDescription>音声ファイルをアップロードすると、自動で文字起こしと分析を行います</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">企業名</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">職種・ポジション</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="例: エンジニア職"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interview_date">面接日</Label>
                <Input
                  id="interview_date"
                  type="date"
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio">音声ファイル（オプション）</Label>
                <div className="flex items-center gap-4">
                  <Input id="audio" type="file" accept="audio/*,.m4a" onChange={handleFileChange} className="flex-1" />
                  {audioFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileAudio className="w-4 h-4" />
                      {audioFile.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">メモ・手動入力</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="面接の内容や感想を入力してください（音声ファイルがない場合）"
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    処理中...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    面接ログを保存
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mic className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                まだ面接ログが登録されていません。
                <br />
                「面接ログを追加」ボタンから最初のログを登録してみましょう。
              </p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      {entry.company_name}
                    </CardTitle>
                    <CardDescription>
                      {entry.position && `${entry.position} • `}
                      {new Date(entry.interview_date).toLocaleDateString("ja-JP")}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedEntry(entry)}>
                    <Eye className="w-4 h-4 mr-2" />
                    詳細
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">面接要約</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{entry.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">フィードバック</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{entry.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 詳細表示ダイアログ */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEntry?.company_name}</DialogTitle>
            <DialogDescription>
              {selectedEntry?.position && `${selectedEntry.position} • `}
              {selectedEntry && new Date(selectedEntry.interview_date).toLocaleDateString("ja-JP")}
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">文字起こし・内容</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{selectedEntry.transcript}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">面接要約</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedEntry.summary}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">フィードバック・改善点</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm">{selectedEntry.feedback}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
