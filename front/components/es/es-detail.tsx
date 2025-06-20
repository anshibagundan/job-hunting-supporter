import type React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ESEntry } from "@/lib/supabase";

interface ESDetailProps {
  entry: ESEntry;
  onDelete: (id: string) => void;
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
                {entry.company_name}
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
        {entry.summary && (
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{entry.summary}</div>
          </CardContent>
        )}
      </Card>

      {entry.advice && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">改善アドバイス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{entry.advice}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
