"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { storage, type Company, type InterviewLog, type Event } from "@/lib/supabase"
import { CompanyDetailHeader } from "@/components/company/company-detail-header"
import { CompanyHeader } from "@/components/company/company-header"
import { CompanyRelatedDataTabs } from "@/components/company/company-related-data-tabs"
import { LoadingSpinner, NotFoundMessage } from "@/components/common/loading-states"
import { useCompanyESEntries } from "@/components/company/hooks/useCompanyESEntries"

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

  useEffect(() => {
    if (companyId) {
      loadCompanyData()
    }
  }, [companyId])

  const loadCompanyData = async () => {
    try {
      const companies = await storage.getCompanies()
      const foundCompany = companies.find(c => c.id === companyId)

      if (!foundCompany) {
        router.push('/home')
        return
      }

      setCompany(foundCompany)

      // 面接ログとイベントはまだローカルストレージから取得（必要に応じて後でAPI化）
      const allInterviewLogs = storage.getInterviewLogs()
      const companyInterviewLogs = allInterviewLogs.filter(log => log.company_name === foundCompany.name)
      setInterviewLogs(companyInterviewLogs)

      const allEvents = storage.getEvents()
      const companyEvents = allEvents.filter(event => event.company_name === foundCompany.name)
      setEvents(companyEvents)

    } catch (error) {
      console.error('企業データの読み込みに失敗しました:', error)
      router.push('/home')
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

  const handleDeleteInterviewLog = (logId: string) => {
    const allLogs = storage.getInterviewLogs()
    const updatedLogs = allLogs.filter(log => log.id !== logId)
    storage.saveInterviewLogs(updatedLogs)
    setInterviewLogs(prev => prev.filter(log => log.id !== logId))
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
        onBack={() => router.push('/home')}
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
