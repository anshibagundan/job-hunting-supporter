import { Mic, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type InterviewLog } from "@/lib/supabase"

interface InterviewLogListProps {
  interviewLogs: InterviewLog[]
  onDelete: (logId: string) => void
  onViewDetail: () => void
  onCreateNew: () => void
}

export function InterviewLogList({ interviewLogs, onDelete, onViewDetail, onCreateNew }: InterviewLogListProps) {
  const onViewDetails = (logId: string) => {
    window.location.href = `/interview/${logId}`
  }


  if (interviewLogs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Mic className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            この企業の面接ログはまだ登録されていません。
            <br />
            <Button
              variant="link"
              className="p-0 mt-2"
              onClick={onCreateNew}
            >
              面接ログを作成する
            </Button>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {interviewLogs.map((log) => (
        <Card key={log.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  面接ログ
                </CardTitle>
                <CardDescription>
                  {new Date(log.interviewAt).toLocaleDateString("ja-JP")}
                  {log.stage ? ` - ${log.stage}` : ""}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails.bind(null, log.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  詳細表示
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(log.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {log.audioSummary && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-1">面接要約</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {log.audioSummary.slice(0, 200)}...
                </p>
              </div>
            )}
            {log.textNote && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-700 mb-1">面接メモ</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {log.textNote.slice(0, 150)}...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
