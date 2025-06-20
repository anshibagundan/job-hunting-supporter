"use client"

import { useRouter } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESList } from "@/components/es/es-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function ESPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { entries, deleteEntry, isLoading } = useESEntries(user?.id || "")

  const handleSelectEntry = (id: string) => {
    router.push(`/es/${id}`)
  }

  const handleCreateNew = () => {
    router.push("/es/new")
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">ES一覧</h2>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div>読み込み中...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">ES一覧</h2>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESList
          entries={entries}
          onSelectEntry={handleSelectEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>
    </div>
  )
}
