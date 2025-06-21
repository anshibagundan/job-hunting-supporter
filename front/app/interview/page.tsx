"use client"

import { useRouter } from "next/navigation"
import { useInterviewLogs } from "@/components/interview/hooks/useInterviewLogs"
import { InterviewList } from "@/components/interview/interview-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUserProfile } from "@/hooks/useAuth"

export default function InterviewPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useUserProfile()
  const { logs, selectedLog, isLoading, deleteLog, selectLog } = useInterviewLogs()

  const handleSelectLog = (id: string) => {
    router.push(`/interview/${id}`)
  }

  const handleCreateNew = () => {
    router.push("/interview/new")
  }

  const handleDeleteLog = async (id: string) => {
    try {
      await deleteLog(id)
    } catch (error) {
      console.error("Failed to delete log:", error)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">ユーザー情報を取得できませんでした</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">面接ログ一覧</h2>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <InterviewList
          logs={logs}
          selectedLog={selectedLog}
          onSelectLog={(log) => handleSelectLog(log.id)}
          onDeleteLog={handleDeleteLog}
          onNewLog={handleCreateNew}
        />
      </main>
    </div>
  )
}
