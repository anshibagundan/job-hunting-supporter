import type React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ESEntry } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";

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
      {/* 達成度表示セクション */}
      {entry.adviceItems && entry.adviceItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">項目別達成度評価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {entry.adviceItems.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{item.category}</h4>
                  <span className="text-lg font-bold text-primary">
                    {item.achievement}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Progress value={item.achievement} className="h-3" />
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all"
                      style={{
                        width: `${item.achievement}%`,
                        backgroundColor:
                          item.achievement >= 80
                            ? "#22c55e"
                            : item.achievement >= 60
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="mb-1">
                      <span className="font-medium">評価理由:</span>{" "}
                      {item.reason}
                    </div>
                    <div>
                      <span className="font-medium">改善提案:</span>{" "}
                      {item.suggestion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
