import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ESEntry } from "@/lib/supabase";

interface ESItemProps {
  es: ESEntry;
  onViewDetail: (esId: string) => void;
  onDelete: (esId: string) => void;
}

export function ESItem({ es, onViewDetail, onDelete }: ESItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{es.title}</CardTitle>
            <CardDescription>
              {new Date(es.created_at).toLocaleDateString("ja-JP")}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail(es.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              詳細表示
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(es.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{es.content}</p>
        {es.summary && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              <strong>要約:</strong> {es.summary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
