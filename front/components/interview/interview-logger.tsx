"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Mic, Upload, Trash2, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { storage, type InterviewLog } from "@/lib/supabase"
import AudioUploader from "@/components/interview/recorder/media-recorder";

export function InterviewLogger() {
  const [logs, setLogs] = useState<InterviewLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedLog, setSelectedLog] = useState<InterviewLog | null>(null)
  const [formData, setFormData] = useState({
    company_name: "",
    date: "",
    notes: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setLogs(storage.getInterviewLogs())
  }, [])

  const mockAudioProcessing = (notes: string) => {
    // Mock audio transcription and analysis
    const transcript =
      notes ||
      `面接官: 本日はお忙しい中、お時間をいただきありがとうございます。まず自己紹介をお願いします。

応募者: ありがとうございます。私は○○大学の△△学部で情報工学を専攻している□□と申します。大学では主にWebアプリケーション開発を学んでおり、チーム開発の経験もあります。

面接官: プログラミングはいつ頃から始められましたか？

応募者: 大学1年生の時に授業で初めて触れて、その面白さに魅力を感じました。特にユーザーが実際に使えるものを作れることに興味を持ち、独学でReactやNode.jsを学習しました。

面接官: 弊社を志望される理由を教えてください。

応募者: 御社の「技術で社会課題を解決する」という理念に強く共感しました。特に教育分野でのDX推進に取り組まれている点が、私の将来やりたいことと一致しています。`

    const summary = `【面接要約】
・自己紹介: 情報工学専攻、Web開発経験あり
・技術経験: React、Node.js等を独学で習得
・志望動機: 技術による社会課題解決への共感
・印象: 学習意欲が高く、明確な目標を持っている`

    const questions = [
      "自己紹介をお願いします",
      "プログラミングはいつから始めましたか？",
      "弊社を志望する理由を教えてください",
      "学生時代に力を入れたことは何ですか？",
      "将来のキャリアビジョンを聞かせてください",
    ]

    return { transcript, summary, questions }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const { transcript, summary, questions } = mockAudioProcessing(formData.notes)

    const newLog: InterviewLog = {
      id: Date.now().toString(),
      company_name: formData.company_name,
      date: formData.date,
      transcript,
      summary,
      questions,
      created_at: new Date().toISOString(),
    }

    const updatedLogs = [...logs, newLog]
    setLogs(updatedLogs)
    storage.saveInterviewLogs(updatedLogs)

    setFormData({ company_name: "", date: "", notes: "" })
    setAudioFile(null)
    setShowForm(false)
    setIsProcessing(false)
  }

  const handleDelete = (id: string) => {
    const updatedLogs = logs.filter((log) => log.id !== id)
    setLogs(updatedLogs)
    storage.saveInterviewLogs(updatedLogs)
    if (selectedLog?.id === id) {
      setSelectedLog(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type.startsWith("audio/") || file.name.endsWith(".m4a"))) {
      setAudioFile(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Interview Log List */}
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">面接ログ</h3>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <Card
              key={log.id}
              className={`cursor-pointer transition-colors ${
                selectedLog?.id === log.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedLog(log)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{log.company_name}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(log.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-medium mb-1">面接日: {log.date}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{log.summary?.slice(0, 100)}...</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(log.created_at).toLocaleDateString("ja-JP")}</p>
              </CardContent>
            </Card>
          ))}
          {logs.length === 0 && <p className="text-gray-500 text-center py-8">面接ログがありません</p>}
        </div>
      </div>

      {/* Interview Log Detail/Form */}
      <div className="lg:col-span-2">
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>新しい面接ログ</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">企業名</label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">面接日</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <AudioUploader/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">メモ・手動入力</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={6}
                    placeholder="面接の内容や感想を入力してください..."
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        処理中...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        保存・分析
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    キャンセル
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : selectedLog ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedLog.company_name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {selectedLog.date}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedLog.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {selectedLog.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">面接要約</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{selectedLog.summary}</div>
                </CardContent>
              </Card>
            )}

            {selectedLog.questions && selectedLog.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">質問リスト</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLog.questions.map((question, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-500 mt-1">Q{index + 1}.</span>
                        <span className="text-sm">{question}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {selectedLog.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">文字起こし</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {selectedLog.transcript}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Mic className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">面接ログを選択してください</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
