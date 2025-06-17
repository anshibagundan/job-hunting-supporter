"use client"

import { ESManager } from "@/components/es/es-manager"

export default function ESPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">ES管理</h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESManager />
      </main>
    </div>
  )
}
