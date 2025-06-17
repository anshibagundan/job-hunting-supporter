"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { storage, type ESEntry } from "@/lib/supabase"

export function ESManager() {
  const [entries, setEntries] = useState<ESEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<ESEntry | null>(null)
  const [formData, setFormData] = useState({
    company_name: "",
    title: "",
    content: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    setEntries(storage.getESEntries())
  }, [])

  const mockAIAnalysis = (content: string) => {
    // Mock AI analysis - in real implementation, this would call OpenAI API
    const summary = `【要約】\n・自己PRの要点: ${content.slice(0, 50)}...\n・実績・経験: 具体的な成果や学びが含まれています\n・志望動機: 企業への関心と適性をアピール`

    const advice = `【改善アドバイス】\n・具体的な数値や成果を追加することで説得力が向上します\n・企業の事業内容との関連性をより明確に示しましょう\n・文章構成を見直し、結論を最初に述べる構造にすると読みやすくなります`

    return { summary, advice }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const { summary, advice } = mockAIAnalysis(formData.content)

    const newEntry: ESEntry = {
      id: Date.now().toString(),
      company_name: formData.company_name,
      title: formData.title,
      content: formData.content,
      summary,
      advice,
      created_at: new Date().toISOString(),
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)
    storage.saveESEntries(updatedEntries)

    setFormData({ company_name: "", title: "", content: "" })
    setShowForm(false)
    setIsAnalyzing(false)
  }

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    storage.saveESEntries(updatedEntries)
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* ES List */}
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ES一覧</h3>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>

        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className={`cursor-pointer transition-colors ${
                selectedEntry?.id === entry.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedEntry(entry)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{entry.company_name}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(entry.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h4 className="font-medium text-sm mb-1">{entry.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{entry.content.slice(0, 100)}...</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(entry.created_at).toLocaleDateString("ja-JP")}</p>
              </CardContent>
            </Card>
          ))}
          {entries.length === 0 && <p className="text-gray-500 text-center py-8">ESがありません</p>}
        </div>
      </div>

      {/* ES Detail/Form */}
      <div className="lg:col-span-2">
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>新しいES</CardTitle>
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
                  <label className="block text-sm font-medium mb-2">タイトル</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="例: 志望動機、自己PR"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">内容</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    placeholder="ESの内容を入力してください..."
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? "AI分析中..." : "保存・分析"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    キャンセル
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : selectedEntry ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedEntry.title}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {selectedEntry.company_name}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedEntry.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">{selectedEntry.content}</div>
              </CardContent>
            </Card>

            {selectedEntry.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI要約</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{selectedEntry.summary}</div>
                </CardContent>
              </Card>
            )}

            {selectedEntry.advice && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">改善アドバイス</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{selectedEntry.advice}</div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">ESを選択してください</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
