import { useState, useMemo, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ESItem } from "./es-item"
import type { ESEntry } from "@/lib/supabase"

interface ESListProps {
  entries: ESEntry[]
  onSelectEntry: (id: string) => void
  onDeleteEntry: (id: string) => void
}

export function ESList({
  entries,
  onSelectEntry,
  onDeleteEntry,
}: ESListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return entries

    return entries.filter(entry =>
      entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [entries, searchTerm])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleDeleteEntry = useCallback((id: string) => {
    onDeleteEntry(id)
  }, [onDeleteEntry])

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="企業名、タイトル、内容で検索..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredEntries.map((entry) => (
          <ESItem
            key={entry.id}
            entry={entry}
            onSelect={onSelectEntry}
            onDelete={handleDeleteEntry}
          />
        ))}

        {filteredEntries.length === 0 && searchTerm && (
          <p className="text-gray-500 text-center py-8">
            「{searchTerm}」に一致するESが見つかりません
          </p>
        )}

        {entries.length === 0 && (
          <p className="text-gray-500 text-center py-8">ESがありません</p>
        )}
      </div>

      {searchTerm && (
        <div className="mt-2 text-xs text-gray-500">
          {filteredEntries.length}件中 {entries.length}件を表示
        </div>
      )}
    </div>
  )
}
