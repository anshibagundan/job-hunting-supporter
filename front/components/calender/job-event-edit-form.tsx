"use client";

import { useState } from "react";
import {
  type JobEventRequest,
  type JobEventResponse,
  updateJobEvent,
} from "@/components/job-events/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Company } from "@/lib/supabase";

interface JobEventEditFormProps {
  jobEvent: JobEventResponse;
  companyName: string;
  companies: Company[];
  onSave: () => void;
  onCancel: () => void;
}

export function JobEventEditForm({
  jobEvent,
  companyName,
  companies,
  onSave,
  onCancel,
}: JobEventEditFormProps) {
  const [formData, setFormData] = useState({
    job_title: jobEvent.job_title,
    job_type: jobEvent.job_type,
    job_description: jobEvent.job_description,
    start_date: new Date(jobEvent.start_date).toISOString().slice(0, 16), // datetime-local形式
    deadline: new Date(jobEvent.deadline).toISOString().slice(0, 16),
    event_url: jobEvent.event_url,
    company_id: jobEvent.company_id.toString(),
    company_name: companyName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const updateRequest: JobEventRequest = {
        user_id: jobEvent.user_id,
        company_id: Number.parseInt(formData.company_id),
        job_title: formData.job_title,
        job_type: formData.job_type,
        job_description: formData.job_description,
        start_date: new Date(formData.start_date).toISOString(),
        deadline: new Date(formData.deadline).toISOString(),
        event_url: formData.event_url,
      };

      await updateJobEvent(jobEvent.id.toString(), updateRequest);
      onSave();
    } catch (error) {
      console.error("Failed to update job event:", error);
      alert("更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>JobEvent編集</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">企業名</label>
            <Select
              value={formData.company_id}
              onValueChange={(value) => {
                const company = companies.find(
                  (c) => c.id.toString() === value
                );
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
            <label className="block text-sm font-medium mb-2">
              イベント種別
            </label>
            <Select
              value={formData.job_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, job_type: value }))
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
              value={formData.job_title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, job_title: e.target.value }))
              }
              placeholder="例: 2024年新卒採用説明会"
              required={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">詳細説明</label>
            <Textarea
              value={formData.job_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  job_description: e.target.value,
                }))
              }
              placeholder="イベントの詳細を入力してください"
              rows={4}
              required={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                応募開始日時
              </label>
              <Input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                required={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                応募締切日時
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                required={true}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              イベントURL
            </label>
            <Input
              type="url"
              value={formData.event_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, event_url: e.target.value }))
              }
              placeholder="https://example.com/event"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
