"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { InterviewForm } from "@/components/interview/interview-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { interviewApi } from "@/components/interview/api"
import type { InterviewLog } from "@/lib/supabase"

export default function EditInterviewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [log, setLog] = useState<InterviewLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const interviewLog = await interviewApi.getById(id)
        setLog(interviewLog)
      } catch (error) {
        console.error("Failed to fetch interview log:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchLog()
    }
  }, [id])

  const handleBack = () => {
    router.push(`/interview/${id}`)
  }

  const handleSubmit = async (data: {
    company: any
    interviewAt: string
    stage: string
    location?: string
    meetingUrl?: string
    textNote: string
    audioSummary?: string
    audioFile?: File | null
  }) => {
    try {
      await interviewApi.update(id, {
        company_id: data.company.id,
        interview_at: data.interviewAt,
        stage: data.stage,
        location: data.location,
        meeting_url: data.meetingUrl,
        text_note: data.textNote,
        audio_summary: data.audioSummary, // AI要約の更新対応
      })
      router.push(`/interview/${id}`)
    } catch (error) {
      console.error("Failed to update interview log:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">面接ログ編集</h2>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div>読み込み中...</div>
        </main>
      </div>
    )
  }

  if (!log) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/interview")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">面接ログ編集</h2>
          </div>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-red-500">面接ログが見つかりません</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            詳細に戻る
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            面接ログ編集 - {log.company.name || "未設定"}
          </h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <InterviewForm
            onSubmit={handleSubmit}
            onCancel={handleBack}
            initialData={log}
            title="面接ログ編集"
          />
        </div>
      </main>
    </div>
  )
}