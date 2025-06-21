"use client"

import { useRouter } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESList } from "@/components/es/es-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUserProfile } from "@/hooks/useAuth"

export default function ESPage() {
  const router = useRouter()
  const { user, userProfile, isLoading: authLoading } = useUserProfile()
  const { entries, deleteEntry, isLoading } = useESEntries(userProfile?.id?.toString() || "")

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">ユーザー情報を取得できませんでした</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div>読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">ES一覧</h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      <main className="overflow-auto">
        <ESList
          entries={entries}
          onSelectEntry={handleSelectEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>
    </div>
  )
}
