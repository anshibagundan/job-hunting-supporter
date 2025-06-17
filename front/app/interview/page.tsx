"use client"

import { InterviewLogger } from "@/components/interview/interview-logger"

export default function InterviewPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">面接ログ</h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <InterviewLogger />
      </main>
    </div>
  )
}
