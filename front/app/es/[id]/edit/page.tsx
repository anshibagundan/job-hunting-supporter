"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchES, updateES } from "@/components/es/api";
import { ESForm } from "@/components/es/es-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { ESEntry } from "@/lib/supabase";

export default function ESEditPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [entry, setEntry] = useState<ESEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  // ESエントリをIDで取得
  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const esEntry = await fetchES(id);
        setEntry(esEntry);
      } catch (error) {
        console.error("Failed to fetch ES entry:", error);
        setError("ESエントリの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadEntry();
  }, [id]);

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // エントリーが見つからない場合は一覧に戻る
  useEffect(() => {
    if (!isLoading && !entry && !error) {
      router.push("/es");
    }
  }, [entry, isLoading, error, router]);

  const handleBack = useCallback(() => {
    router.push(`/es/${id}`);
  }, [router, id]);

  const handleSubmit = useCallback(
    async (updatedEntry: ESEntry) => {
      try {
        await updateES(id, updatedEntry);
        router.push(`/es/${id}`);
      } catch (error) {
        console.error("Failed to update ES entry:", error);
        setError("ESエントリの更新に失敗しました");
      }
    },
    [id, router]
  );

  const handleCancel = useCallback(() => {
    router.push(`/es/${id}`);
  }, [router, id]);

  // ローディング中の表示
  if (authLoading || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // ユーザーが認証されていない場合
  if (!user) {
    return null;
  }

  // エントリーが見つからない場合
  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">エントリーが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            詳細に戻る
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            ES編集 - {entry?.company.name}
          </h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESForm entry={entry} onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}
