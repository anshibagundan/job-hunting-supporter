"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { type Company, type InterviewLog, type Event } from "@/lib/supabase"
import { CompanyDetailHeader } from "@/components/company/company-detail-header"
import { CompanyHeader } from "@/components/company/company-header"
import { CompanyRelatedDataTabs } from "@/components/company/company-related-data-tabs"
import { LoadingSpinner, NotFoundMessage } from "@/components/common/loading-states"
import { useCompanyESEntries } from "@/components/company/hooks/useCompanyESEntries"
import { useCompanyJobEvents } from "@/components/company/hooks/useCompanyJobEvents"
import { jobEventToEvent } from "@/lib/job-event-utils"
import { fetchCompanyById, convertCompanyToFrontend } from "@/components/company/api"
import { fetchInterviewsByCompanyID, deleteInterview } from "@/components/interview/api"
import {useCompanyInterviewLogs} from "@/components/company/hooks/useCompanyInterviewLogs";

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // APIからESデータを取得
  const { entries: esEntries, isLoading: esLoading, deleteEntry } = useCompanyESEntries(companyId)
  // APIからJobEventsデータを取得
  const { jobEvents, isLoading: jobEventsLoading } = useCompanyJobEvents(companyId)
  // APIから面接ログを取得
  const { logs: interviewLogs, isLoading: interviewLogsLoading } = useCompanyInterviewLogs(companyId)

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
      // APIから企業データを取得
      const companyResponse = await fetchCompanyById(companyId)
      const foundCompany = convertCompanyToFrontend(companyResponse)

      if (!foundCompany) {
        router.push('/company')
        return
      }

      setCompany(foundCompany)

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
      // APIから削除
      await deleteInterview(logId)
    } catch (error) {
      console.error('面接ログの削除に失敗しました:', error)
    }
  }

  const handleEdit = () => {
    router.push(`/company/${companyId}/edit`)
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
        companyId={companyId}
        onBack={() => router.push('/company')}
        onEdit={handleEdit}
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
            onNavigateToInterview={() => router.push('/interview/new?companyId=' + companyId)}
            onNavigateToCalendar={() => router.push('/calendar')}
          />
        </div>
      </main>
    </div>
  )
}
