"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { storage, type Company, type InterviewLog, type Event } from "@/lib/supabase"
import { CompanyDetailHeader } from "@/components/company/company-detail-header"
import { CompanyHeader } from "@/components/company/company-header"
import { CompanyRelatedDataTabs } from "@/components/company/company-related-data-tabs"
import { LoadingSpinner, NotFoundMessage } from "@/components/common/loading-states"
import { useCompanyESEntries } from "@/components/company/hooks/useCompanyESEntries"
import { useCompanyJobEvents } from "@/components/company/hooks/useCompanyJobEvents"
import { jobEventToEvent } from "@/lib/job-event-utils"
import { fetchInterviewsByCompanyID, deleteInterview } from "@/components/interview/api"

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [interviewLogs, setInterviewLogs] = useState<InterviewLog[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // APIからESデータを取得
  const { entries: esEntries, isLoading: esLoading, deleteEntry } = useCompanyESEntries(companyId)
  // APIからJobEventsデータを取得
  const { jobEvents, isLoading: jobEventsLoading } = useCompanyJobEvents(companyId)

  useEffect(() => {
    if (companyId) {
      loadCompanyData()
    }
  }, [companyId])

  useEffect(() => {
    if (jobEvents.length > 0 && company) {
      const convertedEvents = jobEvents.map(jobEvent => jobEventToEvent(jobEvent, company.name))
      setEvents(prevEvents => [...prevEvents, ...convertedEvents])
    }
  }, [jobEvents, company])

  const loadCompanyData = async () => {
    try {
      const companies = await storage.getCompanies()
      const foundCompany = companies.find(c => c.id.toString() === companyId)

      if (!foundCompany) {
        router.push('/company')
        return
      }

      setCompany(foundCompany)

      // インタビューログをAPIから取得
      try {
        const companyInterviewLogs = await fetchInterviewsByCompanyID(companyId)
        setInterviewLogs(companyInterviewLogs)
      } catch (error) {
        console.error('インタビューログの取得に失敗しました:', error)
        // APIエラーの場合は空配列を設定
        setInterviewLogs([])
      }

    } catch (error) {
      console.error('企業データの読み込みに失敗しました:', error)
      router.push('/company')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteES = async (esId: string) => {
    try {
      await deleteEntry(esId)
    } catch (error) {
      console.error('ES削除に失敗しました:', error)
    }
  }

  const handleDeleteInterviewLog = async (logId: string) => {
    try {
      await deleteInterview(logId)
      // 削除成功後、ローカル状態からも削除
      setInterviewLogs(prev => prev.filter(log => log.id !== logId))
    } catch (error) {
      console.error('インタビューログの削除に失敗しました:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner message="企業情報を読み込み中..." />
  }

  if (!company) {
    return <NotFoundMessage message="企業が見つかりません" />
  }

  return (
    <div className="flex-1 flex flex-col">
      <CompanyDetailHeader
        companyName={company.name}
        onBack={() => router.push('/company')}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <CompanyHeader company={company} />
          <CompanyRelatedDataTabs
            esEntries={esEntries}
            interviewLogs={interviewLogs}
            events={events}
            companyId={companyId}
            onDeleteES={handleDeleteES}
            onDeleteInterviewLog={handleDeleteInterviewLog}
            onNavigateToInterview={() => router.push('/interview')}
            onNavigateToCalendar={() => router.push('/calendar')}
          />
        </div>
      </main>
    </div>
  )
}
