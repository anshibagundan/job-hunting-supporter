import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { SemiCircleProgress } from "@/components/ui/semi-circle-progress";
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
            <MarkdownRenderer content={entry.summary} />
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

      {/* 項目別達成度評価セクション */}
      {entry.adviceItems && entry.adviceItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">項目別達成度評価</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {entry.adviceItems.map((item, index) => (
              <AdviceItemCard key={index} item={item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface AdviceItemCardProps {
  item: {
    category: string;
    achievement: number;
    reason: string;
    suggestion: string;
  };
}

function AdviceItemCard({ item }: AdviceItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 達成度表示部分 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-base mb-2">{item.category}</h4>
        </div>
        <div className="flex items-center gap-4">
          <SemiCircleProgress
            value={item.achievement}
            size={100}
            strokeWidth={6}
          />
        </div>
      </div>

      {/* 詳細情報（クリックで表示/非表示） */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild={true}>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50"
          >
            <span className="text-sm text-gray-600">
              {isOpen ? "詳細を閉じる" : "詳細を表示"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-1">
                評価理由
              </h5>
              <p className="text-sm text-gray-600">{item.reason}</p>
            </div>
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-1">
                改善提案
              </h5>
              <p className="text-sm text-gray-600">{item.suggestion}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
