"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { InterviewForm } from "@/components/interview/interview-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { interviewApi } from "@/components/interview/api"
import { useUserProfile} from "@/hooks/useAuth";
import { InterviewLog} from "@lib/supabase";

function NewInterviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserProfile()
  const companyId = searchParams.get("companyId")

  const handleBack = () => {
    router.push("/interview")
  }

  const handleSubmit = async (data: {
    InterviewLog: InterviewLog
  }) => {
    try {
      const createdLog = await interviewApi.create(data.InterviewLog)
      router.push(`/interview/${createdLog.id}`)
    } catch (error) {
      console.error("Failed to create interview log:", error)
    }
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
            一覧に戻る
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">新規面接ログ作成</h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <InterviewForm
            onSubmit={handleSubmit}
            onCancel={handleBack}
          />
        </div>
      </main>
    </div>
  )
}

export default function NewInterviewPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    }>
      <NewInterviewContent />
    </Suspense>
  )
}