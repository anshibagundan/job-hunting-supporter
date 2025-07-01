import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ESEntry } from "@/lib/supabase";

interface ESItemProps {
  entry: ESEntry;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ESItem({
  entry,
  isSelected = false,
  onSelect,
  onDelete,
}: ESItemProps) {
  const handleSelect = useCallback(() => {
    onSelect(entry.id);
  }, [onSelect, entry.id]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(entry.id);
    },
    [onDelete, entry.id]
  );

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
      }`}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{entry.company.name}</Badge>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <h4 className="font-medium text-sm mb-1">{entry.title}</h4>
        <p className="text-xs text-gray-600 line-clamp-2">
          {entry.content.slice(0, 100)}...
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(entry.created_at).toLocaleDateString("ja-JP")}
        </p>
      </CardContent>
    </Card>
  );
}
