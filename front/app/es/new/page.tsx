"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESForm } from "@/components/es/es-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { ESEntry } from "@/lib/supabase"

export default function ESNewPage() {
  const router = useRouter()
  const { addEntry } = useESEntries()

  const handleBack = useCallback(() => {
    router.push("/es")
  }, [router])

  const handleSubmit = useCallback((entry: ESEntry) => {
    addEntry(entry)
    router.push("/es")
  }, [addEntry, router])

  const handleCancel = useCallback(() => {
    router.push("/es")
  }, [router])

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
          <h2 className="text-lg font-semibold text-gray-900">
            新規ES作成
          </h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}
