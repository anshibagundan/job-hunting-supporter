"use client"

import { useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESForm } from "@/components/es/es-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { ESEntry } from "@/lib/supabase"

export default function ESEditPage() {
  const router = useRouter()
  const params = useParams()
  const { entries, updateEntry } = useESEntries()

  const id = params.id as string

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
    router.push(`/es/${id}`)
  }, [router, id])

  const handleSubmit = useCallback((updatedEntry: ESEntry) => {
    updateEntry(updatedEntry)
    router.push(`/es/${id}`)
  }, [updateEntry, router, id])

  const handleCancel = useCallback(() => {
    router.push(`/es/${id}`)
  }, [router, id])

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
            ES編集 - {entry?.company_name}
          </h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESForm
          entry={entry}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}
