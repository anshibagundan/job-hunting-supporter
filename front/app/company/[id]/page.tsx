"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Building2, Globe, FileText, Mic, Calendar, ArrowLeft, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { storage, type Company, type ESEntry, type InterviewLog, type Event } from "@/lib/supabase"

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
      const companyESEntries = allESEntries.filter(es => es.company_name === foundCompany.name)
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
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">企業情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">企業が見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            企業一覧に戻る
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 企業基本情報 */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {company.image ? (
                    <img
                      src={company.image}
                      alt={`${company.name}のロゴ`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{company.name}</CardTitle>
                  <Badge variant="secondary" className="mb-3">
                    {company.industry}
                  </Badge>
                  <CardDescription className="text-base">
                    {company.description || "企業の詳細情報はありません。"}
                  </CardDescription>
                  {company.website && (
                    <div className="flex items-center gap-2 mt-3 text-blue-600">
                      <Globe className="h-4 w-4" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 企業に関連する情報 */}
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

            <TabsContent value="es" className="space-y-4">
              {esEntries.length > 0 ? (
                esEntries.map((es) => (
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
                            onClick={() => router.push('/es')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            詳細表示
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteES(es.id)}
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
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      この企業のESはまだ登録されていません。
                      <br />
                      <Button
                        variant="link"
                        className="p-0 mt-2"
                        onClick={() => router.push('/es')}
                      >
                        ESを作成する
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="interviews" className="space-y-4">
              {interviewLogs.length > 0 ? (
                interviewLogs.map((log) => (
                  <Card key={log.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Mic className="h-5 w-5" />
                            面接ログ
                          </CardTitle>
                          <CardDescription>
                            {new Date(log.date).toLocaleDateString("ja-JP")}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/interview')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            詳細表示
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInterviewLog(log.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {log.summary && (
                        <div className="mb-3">
                          <h4 className="font-medium text-sm text-gray-700 mb-1">面接要約</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {log.summary.slice(0, 200)}...
                          </p>
                        </div>
                      )}
                      {log.transcript && (
                        <div className="mb-3">
                          <h4 className="font-medium text-sm text-gray-700 mb-1">内容</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {log.transcript.slice(0, 150)}...
                          </p>
                        </div>
                      )}
                      {log.questions && log.questions.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-md">
                          <h4 className="font-medium text-sm text-green-900 mb-1">質問一覧</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            {log.questions.slice(0, 3).map((question, index) => (
                              <li key={index}>• {question}</li>
                            ))}
                            {log.questions.length > 3 && (
                              <li className="text-green-600">他{log.questions.length - 3}件</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Mic className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      この企業の面接ログはまだ登録されていません。
                      <br />
                      <Button
                        variant="link"
                        className="p-0 mt-2"
                        onClick={() => router.push('/interview')}
                      >
                        面接ログを作成する
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              {events.length > 0 ? (
                events.map((event) => (
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
                          onClick={() => router.push('/calendar')}
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
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      この企業の予定はまだ登録されていません。
                      <br />
                      <Button
                        variant="link"
                        className="p-0 mt-2"
                        onClick={() => router.push('/calendar')}
                      >
                        予定を作成する
                      </Button>
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
