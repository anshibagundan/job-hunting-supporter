import { FileText, Mic, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ESEntry, type InterviewLog, type Event } from "@/lib/supabase"
import { ESList } from "./es-list"
import { InterviewLogList } from "./interview-log-list"
import { EventList } from "./event-list"

interface CompanyRelatedDataTabsProps {
  esEntries: ESEntry[]
  interviewLogs: InterviewLog[]
  events: Event[]
  companyId: string // 企業IDを追加
  onDeleteES: (esId: string) => void
  onDeleteInterviewLog: (logId: string) => void
  onNavigateToInterview: () => void
  onNavigateToCalendar: () => void
}

export function CompanyRelatedDataTabs({
  esEntries,
  interviewLogs,
  events,
  companyId,
  onDeleteES,
  onDeleteInterviewLog,
  onNavigateToInterview,
  onNavigateToCalendar
}: CompanyRelatedDataTabsProps) {
  return (
    <Tabs defaultValue="es" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="es" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          ES ({esEntries.length})
        </TabsTrigger>
        <TabsTrigger value="interviews" className="flex items-center gap-2">
          <Mic className="h-4 w-4" />
          面接ログ ({interviewLogs.length})
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          予定 ({events.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="es">
        <ESList
          esEntries={esEntries}
          onDelete={onDeleteES}
          companyId={companyId}
        />
      </TabsContent>

      <TabsContent value="interviews">
        <InterviewLogList
          interviewLogs={interviewLogs}
          onDelete={onDeleteInterviewLog}
          onViewDetail={onNavigateToInterview}
          onCreateNew={onNavigateToInterview}
        />
      </TabsContent>

      <TabsContent value="events">
        <EventList
          events={events}
          onViewCalendar={onNavigateToCalendar}
          onCreateNew={onNavigateToCalendar}
        />
      </TabsContent>
    </Tabs>
  )
}
