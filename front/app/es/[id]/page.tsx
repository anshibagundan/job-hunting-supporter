"use client"

import { useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESDetail } from "@/components/es/es-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"

export default function ESDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { entries, deleteEntry } = useESEntries()

  const id = params.id as string

  // entryをuseMemoで最適化
  const entry = useMemo(() => {
    return entries.find((e) => e.id === id) || null
  }, [entries, id])

  // エントリーが見つからない場合は一覧に戻る
  useEffect(() => {
    if (entries.length > 0 && !entry) {
      router.push("/es")
    }
  }, [entry, entries.length, router])

  const handleBack = useCallback(() => {
    router.push("/es")
  }, [router])

  const handleEdit = useCallback(() => {
    router.push(`/es/${id}/edit`)
  }, [router, id])

  const handleDelete = useCallback((entryId: string) => {
    deleteEntry(entryId)
    router.push("/es")
  }, [deleteEntry, router])

  // エントリーが見つからない場合はローディング状態を表示
  if (!entry) {
    return null
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
