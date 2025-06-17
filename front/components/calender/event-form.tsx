"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event } from "@/lib/supabase"

interface EventFormProps {
  onSubmit: (event: Omit<Event, "id">) => void
  onCancel: () => void
}

export function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    company_name: "",
    type: "" as Event["type"],
    title: "",
    date: "",
    time: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      company_id: "", // Not used in current implementation
      company_name: formData.company_name,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      time: formData.time || undefined,
      notes: formData.notes || undefined,
    })
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">新しい予定を追加</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">企業名</label>
          <Input
            value={formData.company_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">種別</label>
          <Select
            value={formData.type}
            onValueChange={(value: Event["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="種別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ES締切">ES締切</SelectItem>
              <SelectItem value="面接">面接</SelectItem>
              <SelectItem value="説明会">説明会</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">タイトル</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="例: 一次面接、ES提出"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">日付</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">時間</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">備考</label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="場所、準備事項など"
            rows={3}
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <Button type="submit">追加</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
