"use client"

import { useState, useEffect } from "react"
import { Calendar, FileText, Mic, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/calendar-view"
import { ESManager } from "@/components/es-manager"
import { InterviewLogger } from "@/components/interview-logger"
import { EventForm } from "@/components/event-form"
import { storage, type Event } from "@/lib/supabase"

type View = "calendar" | "es" | "interview"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("calendar")
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)

  useEffect(() => {
    // Load initial data
    setEvents(storage.getEvents())
  }, [])

  const handleAddEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    }
    const updatedEvents = [...events, newEvent]
    setEvents(updatedEvents)
    storage.saveEvents(updatedEvents)
    setShowEventForm(false)
  }

  const renderContent = () => {
    switch (currentView) {
      case "calendar":
        return <CalendarView events={events} />
      case "es":
        return <ESManager />
      case "interview":
        return <InterviewLogger />
      default:
        return <CalendarView events={events} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">就活ダッシュボード</h1>
        </div>
        <nav className="mt-6">
          <Button
            variant={currentView === "calendar" ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
            onClick={() => setCurrentView("calendar")}
          >
            <Calendar className="mr-3 h-4 w-4" />
            カレンダー
          </Button>
          <Button
            variant={currentView === "es" ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
            onClick={() => setCurrentView("es")}
          >
            <FileText className="mr-3 h-4 w-4" />
            ES管理
          </Button>
          <Button
            variant={currentView === "interview" ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
            onClick={() => setCurrentView("interview")}
          >
            <Mic className="mr-3 h-4 w-4" />
            面接ログ
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentView === "calendar" && "カレンダー"}
              {currentView === "es" && "ES管理"}
              {currentView === "interview" && "面接ログ"}
            </h2>
            {currentView === "calendar" && (
              <Button onClick={() => setShowEventForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                予定追加
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <EventForm onSubmit={handleAddEvent} onCancel={() => setShowEventForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
