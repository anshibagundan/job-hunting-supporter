"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { storage, type Company, type ESEntry, type InterviewLog, type Event } from "@/lib/supabase"
import { CompanyDetailHeader } from "@/components/company/company-detail-header"
import { CompanyHeader } from "@/components/company/company-header"
import { CompanyRelatedDataTabs } from "@/components/company/company-related-data-tabs"
import { LoadingSpinner, NotFoundMessage } from "@/components/common/loading-states"

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [esEntries, setESEntries] = useState<ESEntry[]>([])
  const [interviewLogs, setInterviewLogs] = useState<InterviewLog[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (companyId) {
      loadCompanyData()
    }
  }, [companyId])

  const loadCompanyData = () => {
    try {
      const companies = storage.getCompanies()
      const foundCompany = companies.find(c => c.id === companyId)

      if (!foundCompany) {
        router.push('/home')
        return
      }

      setCompany(foundCompany)

      // その企業に関連するES、面接ログ、イベントを取得
      const allESEntries = storage.getESEntries()
      const companyESEntries = allESEntries.filter(es => es.company.id === foundCompany.id)
      setESEntries(companyESEntries)

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

  const handleDeleteES = (esId: string) => {
    const allESEntries = storage.getESEntries()
    const updatedEntries = allESEntries.filter(es => es.id !== esId)
    storage.saveESEntries(updatedEntries)
    setESEntries(prev => prev.filter(es => es.id !== esId))
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
