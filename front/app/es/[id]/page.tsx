"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { fetchES } from "@/components/es/api"
import { ESDetail } from "@/components/es/es-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import { type ESEntry } from "@/lib/supabase"

export default function ESDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [entry, setEntry] = useState<ESEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    const fetchESEntry = async () => {
      try {
        setIsLoading(true)
        const esEntry = await fetchES(id)
        setEntry(esEntry)
      } catch (error) {
        console.error('Failed to fetch ES entry:', error)
        setError('ESの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchESEntry()
    }
  }, [id])

  const handleBack = () => {
    router.push("/es")
  }

  const handleEdit = () => {
    router.push(`/es/${id}/edit`)
  }

  const handleDelete = async (entryId: string) => {
    try {
      // deleteEntry logic here if needed
      router.push("/es")
    } catch (error) {
      console.error('Failed to delete ES entry:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">ES詳細</h2>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div>読み込み中...</div>
        </main>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">ES詳細</h2>
          </div>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-red-500">{error || 'ESが見つかりません'}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
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
            <h2 className="text-lg font-semibold text-gray-900">
              ES詳細 - {entry.company.name}
            </h2>
          </div>

          <Button
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            編集
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESDetail
          entry={entry}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
