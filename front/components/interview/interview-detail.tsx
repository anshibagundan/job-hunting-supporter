"use client";

import {
  Brain,
  Building,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Trash2,
  Video,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InterviewLog } from "@/lib/supabase";

interface InterviewDetailProps {
  log: InterviewLog;
  onDelete: (id: string) => void;
}

export function InterviewDetail({ log, onDelete }: InterviewDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card - Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Building className="h-5 w-5" />
                  {log.company?.name || "未設定"}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {log.company?.industry || "業界未設定"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(log.interviewAt)}
                </Badge>
                {log.stage && <Badge variant="outline">{log.stage}</Badge>}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(log.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Info */}
            {(log.location || log.meetingUrl) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  {log.meetingUrl ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  面接場所
                </h4>
                {log.location && (
                  <p className="text-sm text-gray-600">{log.location}</p>
                )}
                {log.meetingUrl && (
                  <a
                    href={log.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    オンライン面接URL
                  </a>
                )}
              </div>
            )}

            {/* Timestamps */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                記録日時
              </h4>
              <p className="text-sm text-gray-600">
                作成: {formatDate(log.createdAt)}
              </p>
              {log.updatedAt !== log.createdAt && (
                <p className="text-sm text-gray-600">
                  更新: {formatDate(log.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Summary */}
      {log.audioSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              面接要約（AI生成・編集可能）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {log.audioSummary}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Notes */}
      {log.textNote && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              テキストメモ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed bg-yellow-50 p-4 rounded-lg">
              {log.textNote}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Transcript - 非表示（AI認識結果の信頼性を考慮） */}

      {/* Company Details */}
      {log.company && (log.company.description || log.company.website) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              企業情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {log.company.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  企業概要
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {log.company.description}
                </p>
              </div>
            )}

            {log.company.website && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  ウェブサイト
                </h4>
                <a
                  href={log.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {log.company.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 space-y-1">
              <p>ID: {log.id}</p>
              <p>User ID: {log.userId}</p>
              <p>Job Event ID: {log.jobEventId}</p>
              <p>Company ID: {log.company?.id}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
