import { FileText, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo, useCallback } from "react"
import { type ESEntry } from "@/lib/supabase"
import { ESItem } from "./es-item"

interface ESListProps {
  esEntries: ESEntry[]
  onDelete: (esId: string) => void
  companyId?: string // 企業IDを追加
}

export function ESList({ esEntries, onDelete, companyId }: ESListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const onCreateNew = () => {
    // 企業IDがある場合はクエリパラメータとして渡す
    if (companyId) {
      window.location.href = `/es/new?companyId=${companyId}`
    } else {
      window.location.href = `/es/new`
    }
  }

  const onViewDetail = (esId: string) => {
    window.location.href = `/es/${esId}`
  }

  // フィルタリングされたESエントリ
  const filteredESEntries = useMemo(() => {
    if (!searchTerm.trim()) return esEntries

    return esEntries.filter(es =>
      es.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      es.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      es.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [esEntries, searchTerm])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  if (esEntries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            この企業のESはまだ登録されていません。
            <br />
            <Button
              variant="link"
              className="p-0 mt-2"
              onClick={onCreateNew}
            >
              ESを作成する
            </Button>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 検索バーと作成ボタン */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="企業名、タイトル、内容で検索..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreateNew}>
          新しいES作成
        </Button>
      </div>

      {/* ES一覧 */}
      {filteredESEntries.map((es) => (
        <ESItem
          key={es.id}
          es={es}
          onViewDetail={onViewDetail}
          onDelete={onDelete}
        />
      ))}

      {filteredESEntries.length === 0 && searchTerm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 text-center">
              「{searchTerm}」に一致するESが見つかりません
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
