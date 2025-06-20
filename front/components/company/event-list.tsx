import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Event } from "@/lib/supabase"

interface EventListProps {
  events: Event[]
  onViewCalendar: () => void
  onCreateNew: () => void
}

export function EventList({ events, onViewCalendar, onCreateNew }: EventListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            この企業の予定はまだ登録されていません。
            <br />
            <Button
              variant="link"
              className="p-0 mt-2"
              onClick={onCreateNew}
            >
              予定を作成する
            </Button>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{event.type}</Badge>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString("ja-JP")}
                    {event.time && ` ${event.time}`}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCalendar}
              >
                <Calendar className="h-4 w-4 mr-2" />
                カレンダーで確認
              </Button>
            </div>
          </CardHeader>
          {event.notes && (
            <CardContent>
              <p className="text-sm text-gray-600">{event.notes}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
