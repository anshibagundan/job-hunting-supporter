"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/calender/calendar-view";
import { EventForm } from "@/components/calender/event-form";
import { storage, type Event } from "@/lib/supabase";
import {
  fetchAllJobEvents,
  createJobEvent,
  type JobEventRequest,
} from "@/components/job-events/api";
import { jobEventToEvent } from "@/lib/job-event-utils";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    const loadAllEvents = async () => {
      try {
        // APIからJobEventsを取得して変換
        const jobEvents = await fetchAllJobEvents();
        const companies = await storage.getCompanies();

        const convertedJobEvents: Event[] = [];
        jobEvents.forEach((jobEvent) => {
          const company = companies.find(
            (c) => parseInt(c.id) === jobEvent.company_id
          );
          if (company) {
            convertedJobEvents.push(jobEventToEvent(jobEvent, company.name));
          }
        });

        setEvents(convertedJobEvents);
      } catch (error) {
        console.error("Failed to load events:", error);
        // エラー時は空配列を設定
        setEvents([]);
      }
    };

    loadAllEvents();
  }, []);

  const handleAddEvent = async (eventData: Omit<Event, "id">) => {
    try {
      // EventからJobEventRequestに変換
      const jobEventRequest: JobEventRequest = {
        user_id: 1, // TODO: 実際のユーザーIDを取得
        company_id: eventData.company_id,
        job_title: eventData.title,
        job_type: eventData.type,
        job_description: eventData.notes || "",
        start_date: new Date().toISOString(), // TODO: 適切な開始日を設定
        deadline: new Date(
          eventData.date + (eventData.time ? `T${eventData.time}` : "")
        ).toISOString(),
        event_url: eventData.event_url || "",
      };

      // APIで作成
      await createJobEvent(jobEventRequest);

      // リストを再読み込み
      const jobEvents = await fetchAllJobEvents();
      const companies = await storage.getCompanies();

      const convertedJobEvents: Event[] = [];
      jobEvents.forEach((jobEvent) => {
        const company = companies.find(
          (c) => parseInt(c.id) === jobEvent.company_id
        );
        if (company) {
          convertedJobEvents.push(jobEventToEvent(jobEvent, company.name));
        }
      });

      setEvents(convertedJobEvents);
      setShowEventForm(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">カレンダー</h1>
        <Button onClick={() => setShowEventForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          予定追加
        </Button>
      </div>

      <main className="overflow-auto">
        <CalendarView events={events} />
      </main>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <EventForm
              onSubmit={handleAddEvent}
              onCancel={() => setShowEventForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
