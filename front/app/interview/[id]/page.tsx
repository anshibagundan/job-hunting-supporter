"use client";

import { ArrowLeft, Edit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { interviewApi } from "@/components/interview/api";
import { InterviewDetail } from "@/components/interview/interview-detail";
import { Button } from "@/components/ui/button";
import type { InterviewLog } from "@/lib/supabase";

export default function InterviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [log, setLog] = useState<InterviewLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    const fetchInterviewLog = async () => {
      try {
        setIsLoading(true);
        const interviewLog = await interviewApi.getById(id);
        setLog(interviewLog);
      } catch (error) {
        console.error("Failed to fetch interview log:", error);
        setError("b��n֗k1WW~W_");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInterviewLog();
    }
  }, [id]);

  const handleBack = () => {
    router.push("/interview");
  };

  const handleEdit = () => {
    router.push(`/interview/${id}/edit`);
  };

  const handleDelete = async (logId: string) => {
    try {
      await interviewApi.delete(logId);
      router.push("/interview");
    } catch (error) {
      console.error("Failed to delete interview log:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">面接ログ詳細</h2>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div>読み込み中...</div>
        </main>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              面接ログ詳細
            </h2>
          </div>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-red-500">
            {error || "面接ログが見つかりません"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧に戻る
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              面接ログ詳細 - {log.company?.name || "未設定"}
            </h2>
          </div>

          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            編集
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <InterviewDetail log={log} onDelete={handleDelete} />
      </main>
    </div>
  );
}
