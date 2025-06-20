import { FileText, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type ESEntry } from "@/lib/supabase"

interface ESListProps {
  esEntries: ESEntry[]
  onDelete: (esId: string) => void
  onViewDetail: () => void
  onCreateNew: () => void
}

export function ESList({ esEntries, onDelete, onViewDetail, onCreateNew }: ESListProps) {
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
      {esEntries.map((es) => (
        <Card key={es.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{es.title}</CardTitle>
                <CardDescription>
                  {new Date(es.created_at).toLocaleDateString("ja-JP")}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetail}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  詳細表示
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(es.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3">
              {es.content.slice(0, 200)}...
            </p>
            {es.summary && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-sm text-blue-900 mb-1">AI要約</h4>
                <p className="text-sm text-blue-800 line-clamp-2">
                  {es.summary.slice(0, 150)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
