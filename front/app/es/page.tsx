"use client"

import { useRouter } from "next/navigation"
import { useESEntries } from "@/components/es/hooks/useEsEntries"
import { ESList } from "@/components/es/es-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ESPage() {
  const router = useRouter()
  const { entries, deleteEntry } = useESEntries()

  const handleSelectEntry = (id: string) => {
    router.push(`/es/${id}`)
  }

  const handleCreateNew = () => {
    router.push("/es/new")
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
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
