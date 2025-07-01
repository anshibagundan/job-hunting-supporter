"use client";

import { Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InterviewLog } from "@/lib/supabase";

interface InterviewItemProps {
  log: InterviewLog;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => Promise<void>;
}

export function InterviewItem({
  log,
  isSelected,
  onSelect,
  onDelete,
}: InterviewItemProps) {
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
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{log.company?.name || "未設定"}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await onDelete();
              } catch (error) {
                console.error("Failed to delete:", error);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(log.interviewAt)}
          </Badge>
          {log.stage && <Badge variant="outline">{log.stage}</Badge>}
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">
          {log.audioSummary?.slice(0, 100) || "要約がありません"}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(log.createdAt).toLocaleDateString("ja-JP")}
        </p>
      </CardContent>
    </Card>
  );
}
