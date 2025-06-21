"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/supabase"

interface CalendarViewProps {
  events: Event[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "ES締切":
        return "bg-red-100 text-red-800"
      case "面接":
        return "bg-blue-100 text-blue-800"
      case "説明会":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEventClick = (event: Event) => {
    if (event.isJobEvent && event.id) {
      router.push(`/calendar/${event.id}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {currentYear}年{currentMonth + 1}月
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
            月
          </Button>
          <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
            週
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-24"></div>
              }

              const dayEvents = getEventsForDay(day)
              const isToday =
                today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear

              return (
                <div
                  key={day}
                  className={`h-24 p-2 border rounded-lg ${
                    isToday ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                  } hover:bg-gray-50`}
                >
                  <div className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)}`}
                        title={`${event.company_name} - ${event.title}`}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.company_name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2}件</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">今後の予定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter((event) => new Date(event.date) >= today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <div 
                  key={event.id} 
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                    event.isJobEvent ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div>
                    <div className="font-medium">{event.company_name}</div>
                    <div className="text-sm text-gray-600">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {event.date} {event.time && `${event.time}`}
                    </div>
                    {event.isJobEvent && event.event_url && (
                      <a 
                        href={event.event_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        詳細を見る
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                    {event.isJobEvent && (
                      <div className="text-xs text-gray-500">求人イベント</div>
                    )}
                  </div>
                </div>
              ))}
            {events.filter((event) => new Date(event.date) >= today).length === 0 && (
              <p className="text-gray-500 text-center py-4">予定がありません</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
