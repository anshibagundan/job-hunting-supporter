"use client"

import { useState } from "react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Mic, LogOut } from "lucide-react"
import { CalendarView } from "@/components/calendar-view"
import { ESManager } from "@/components/es-manager"
import { InterviewLog } from "@/components/interview-log"

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("calendar")
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">就活ダッシュボード</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  ようこそ、{user.firstName || user.emailAddresses[0].emailAddress}さん
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              スケジュール
            </TabsTrigger>
            <TabsTrigger value="es" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              ES管理
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              面接ログ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarView
              events={[]} // ここに実際のイベントデータを渡す
            />
          </TabsContent>

          <TabsContent value="es">
            <ESManager />
          </TabsContent>

          <TabsContent value="interview">
            <InterviewLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
