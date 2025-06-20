import type React from "react";
import { Trash2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ESEntry } from "@/lib/supabase";

interface ESDetailProps {
  entry: ESEntry;
  onDelete: (id: string) => void;
  onAnalyze?: () => void; // 分析ボタンのコールバック（オプション）
}

export function ESDetail({ entry, onDelete }: ESDetailProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{entry.title}</CardTitle>
              <Badge variant="outline" className="mt-2">
                {entry.company.name}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm">{entry.content}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI要約</CardTitle>
        </CardHeader>
        {entry.summary ? (
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{entry.summary}</div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 text-sm mb-2">
                まだAI要約が生成されていません
              </p>
              <p className="text-gray-400 text-xs">
                編集画面で「分析」ボタンを押すと、AIによる要約を生成できます
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">改善アドバイス</CardTitle>
        </CardHeader>
        {entry.advice ? (
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{entry.advice}</div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 text-sm mb-2">
                まだ改善アドバイスが生成されていません
              </p>
              <p className="text-gray-400 text-xs">
                編集画面で「分析」ボタンを押すと、AIによる改善アドバイスを生成できます
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
