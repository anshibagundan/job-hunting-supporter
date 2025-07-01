"use client";

import { Search } from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { InterviewLog } from "@/lib/supabase";
import { InterviewItem } from "./interview-item";

interface InterviewListProps {
  logs: InterviewLog[];
  selectedLog: InterviewLog | null;
  onSelectLog: (log: InterviewLog) => void;
  onDeleteLog: (id: string) => Promise<void>;
  onNewLog: () => void;
}

export function InterviewList({
  logs,
  selectedLog,
  onSelectLog,
  onDeleteLog,
  onNewLog,
}: InterviewListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;

    return logs.filter(
      (log) =>
        log.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.textNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.audioSummary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.transcript?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleDeleteLog = useCallback(
    async (id: string) => {
      try {
        await onDeleteLog(id);
      } catch (error) {
        console.error("Failed to delete log:", error);
      }
    },
    [onDeleteLog]
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="企業名、要約、内容で検索..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredLogs.map((log) => (
          <InterviewItem
            key={log.id}
            log={log}
            isSelected={selectedLog?.id === log.id}
            onSelect={() => onSelectLog(log)}
            onDelete={() => handleDeleteLog(log.id)}
          />
        ))}

        {filteredLogs.length === 0 && searchTerm && (
          <p className="text-gray-500 text-center py-8">
            「{searchTerm}」に一致する面接ログが見つかりません
          </p>
        )}

        {logs.length === 0 && (
          <p className="text-gray-500 text-center py-8">面接ログがありません</p>
        )}
      </div>

      {searchTerm && (
        <div className="mt-2 text-xs text-gray-500">
          {filteredLogs.length}件中 {logs.length}件を表示
        </div>
      )}
    </div>
  );
}
