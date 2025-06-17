"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/calender/calendar-view"
import { EventForm } from "@/components/calender/event-form"
import { storage, type Event } from "@/lib/supabase"

export default function CalendarPage() {
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

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">カレンダー</h2>
          <Button onClick={() => setShowEventForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            予定追加
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <CalendarView events={events} />
      </main>

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
