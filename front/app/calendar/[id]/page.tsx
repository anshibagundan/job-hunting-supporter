"use client";

import { ArrowLeft, Edit2, ExternalLink, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoadingSpinner,
  NotFoundMessage,
} from "@/components/common/loading-states";
import {
  deleteJobEvent,
  fetchJobEvent,
  type JobEventResponse,
} from "@/components/job-events/api";
import { JobEventEditForm } from "@/components/job-events/job-event-edit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/supabase";

export default function JobEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [jobEvent, setJobEvent] = useState<JobEventResponse | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobEventData();
  }, [loadJobEventData]);

  const loadJobEventData = async () => {
    try {
      setLoading(true);

      // IDからjob-event-プレフィックスを削除
      const jobEventId = eventId.replace("job-event-", "");

      // 個別のJobEventを取得
      const found = await fetchJobEvent(jobEventId);

      if (!found) {
        router.push("/calendar");
        return;
      }

      setJobEvent(found);

      // 企業名を取得
      const companies = await storage.getCompanies();
      const company = companies.find(
        (c) => Number.parseInt(c.id) === found.company_id
      );
      setCompanyName(company?.name || "不明な企業");
    } catch (error) {
      console.error("Failed to load job event:", error);
      router.push("/calendar");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!jobEvent) return;

    if (confirm("このJobEventを削除してもよろしいですか？")) {
      try {
        await deleteJobEvent(jobEvent.id.toString());
        router.push("/calendar");
      } catch (error) {
        console.error("Failed to delete job event:", error);
        alert("削除に失敗しました");
      }
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    loadJobEventData(); // データを再読み込み
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "面接":
        return "bg-red-100 text-red-800";
      case "説明会":
        return "bg-blue-100 text-blue-800";
      case "ES締切":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner message="JobEvent情報を読み込み中..." />;
  }

  if (!jobEvent) {
    return <NotFoundMessage message="JobEventが見つかりません" />;
  }

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleEditCancel} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-semibold text-gray-900">JobEvent編集</h1>
        </div>

        <JobEventEditForm
          jobEvent={jobEvent}
          companyName={companyName}
          onSave={handleEditComplete}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/calendar")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            カレンダーに戻る
          </Button>
          <h1 className="text-3xl font-semibold text-gray-900">予定詳細</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            編集
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </Button>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{jobEvent.job_title}</CardTitle>
              <Badge className={getEventTypeColor(jobEvent.job_type)}>
                {jobEvent.job_type}
              </Badge>
            </div>
            <p className="text-lg text-gray-600">{companyName}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">詳細情報</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {jobEvent.job_description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">応募開始日</h4>
                <p className="text-gray-600">
                  {new Date(jobEvent.start_date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">応募締切</h4>
                <p className="text-gray-600">
                  {new Date(jobEvent.deadline).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {jobEvent.event_url && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">関連リンク</h4>
                <Button
                  variant="outline"
                  onClick={() => window.open(jobEvent.event_url, "_blank")}
                  className="w-full justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  イベント詳細ページを開く
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">作成日時</h4>
                <p className="text-sm text-gray-500">
                  {new Date(jobEvent.created_at).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">最終更新</h4>
                <p className="text-sm text-gray-500">
                  {new Date(jobEvent.updated_at).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
