"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Company, Event } from "@/lib/supabase";

interface EventFormProps {
  onSubmit: (event: Omit<Event, "id">) => void;
  onCancel: () => void;
  companies: Company[];
}

export function EventForm({ onSubmit, onCancel, companies }: EventFormProps) {
  const [formData, setFormData] = useState({
    company_id: "",
    company_name: "",
    type: "" as Event["type"],
    title: "",
    date: "",
    time: "",
    notes: "",
    start_date: "",
    event_url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      company_id: Number.parseInt(formData.company_id) || 0, // 数値に変換
      company_name: formData.company_name,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      time: formData.time || undefined,
      notes: formData.notes || undefined,
      start_date: formData.start_date || undefined,
      event_url: formData.event_url || undefined,
      isJobEvent: true, // JobEvent として作成
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">新しい予定を追加</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">企業名</label>
          <Select
            value={formData.company_id}
            onValueChange={(value) => {
              const company = companies.find((c) => c.id.toString() === value);
              if (company) {
                setFormData((prev) => ({
                  ...prev,
                  company_id: value,
                  company_name: company.name,
                }));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="企業を選択" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">種別</label>
          <Select
            value={formData.type}
            onValueChange={(value: Event["type"]) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="例: 一次面接、ES提出"
            required={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">日付</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              required={true}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">時間</label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">応募開始日</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, start_date: e.target.value }))
            }
            placeholder="応募開始日"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">イベントURL</label>
          <Input
            type="url"
            value={formData.event_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, event_url: e.target.value }))
            }
            placeholder="https://example.com/event"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">備考</label>
          <Textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
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
  );
}
