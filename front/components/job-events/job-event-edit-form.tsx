"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { type Company, storage } from "@/lib/supabase";

interface JobEventEditFormProps {
  jobEvent: JobEventResponse;
  companyName: string;
  onSave: () => void;
  onCancel: () => void;
}

export function JobEventEditForm({
  jobEvent,
  companyName,
  onSave,
  onCancel,
}: JobEventEditFormProps) {
  const [formData, setFormData] = useState({
    company_id: jobEvent.company_id.toString(),
    job_title: jobEvent.job_title,
    job_type: jobEvent.job_type,
    job_description: jobEvent.job_description,
    start_date: jobEvent.start_date.split("T")[0], // YYYY-MM-DD format
    start_time: jobEvent.start_date.split("T")[1]?.split(".")[0] || "", // HH:MM:SS format
    deadline: jobEvent.deadline.split("T")[0], // YYYY-MM-DD format
    deadline_time: jobEvent.deadline.split("T")[1]?.split(".")[0] || "", // HH:MM:SS format
    event_url: jobEvent.event_url,
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await storage.getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Failed to load companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return;

    try {
      setIsSaving(true);

      // Combine date and time for proper ISO format
      const startDateTime = formData.start_time
        ? `${formData.start_date}T${formData.start_time}`
        : `${formData.start_date}T00:00:00`;

      const deadlineDateTime = formData.deadline_time
        ? `${formData.deadline}T${formData.deadline_time}`
        : `${formData.deadline}T23:59:59`;

      const updateData: JobEventRequest = {
        user_id: jobEvent.user_id,
        company_id: Number.parseInt(formData.company_id),
        job_title: formData.job_title,
        job_type: formData.job_type,
        job_description: formData.job_description,
        start_date: new Date(startDateTime).toISOString(),
        deadline: new Date(deadlineDateTime).toISOString(),
        event_url: formData.event_url,
      };

      await updateJobEvent(jobEvent.id.toString(), updateData);
      onSave();
    } catch (error) {
      console.error("Failed to update job event:", error);
      alert("更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>JobEvent編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">企業名</label>
            <Select
              value={formData.company_id}
              onValueChange={(value) => handleInputChange("company_id", value)}
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

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              イベントタイトル
            </label>
            <Input
              value={formData.job_title}
              onChange={(e) => handleInputChange("job_title", e.target.value)}
              placeholder="例: 2025年度新卒採用説明会"
              required={true}
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              イベントタイプ
            </label>
            <Select
              value={formData.job_type}
              onValueChange={(value) => handleInputChange("job_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="説明会">説明会</SelectItem>
                <SelectItem value="面接">面接</SelectItem>
                <SelectItem value="ES締切">ES締切</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-2">詳細説明</label>
            <Textarea
              value={formData.job_description}
              onChange={(e) =>
                handleInputChange("job_description", e.target.value)
              }
              placeholder="イベントの詳細説明を入力してください"
              rows={4}
              required={true}
            />
          </div>

          {/* Start Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                応募開始日
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
                required={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                応募開始時間
              </label>
              <Input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  handleInputChange("start_time", e.target.value)
                }
              />
            </div>
          </div>

          {/* Deadline Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                応募締切日
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                required={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                応募締切時間
              </label>
              <Input
                type="time"
                value={formData.deadline_time}
                onChange={(e) =>
                  handleInputChange("deadline_time", e.target.value)
                }
              />
            </div>
          </div>

          {/* Event URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              イベントURL
            </label>
            <Input
              type="url"
              value={formData.event_url}
              onChange={(e) => handleInputChange("event_url", e.target.value)}
              placeholder="https://example.com/event"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isSaving}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
