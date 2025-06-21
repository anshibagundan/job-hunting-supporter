"use client";

import { useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ESForm } from "@/components/es/es-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ESEntry } from "@/lib/supabase";
import { useUserProfile } from "@/hooks/useAuth";
import { saveES } from "@/components/es/api";

function ESNewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useUserProfile();

  const companyId = searchParams.get("companyId");

  const handleBack = useCallback(() => {
    router.push("/es");
  }, [router]);

  const handleSubmit = useCallback(
    async (entry: ESEntry) => {
      if (!userProfile) return;

      try {
        const esData = {
          ...entry,
          user_id: userProfile.id,
        };
        await saveES(esData);
        router.push("/es");
      } catch (error) {
        console.error("Failed to save ES:", error);
      }
    },
    [userProfile, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/es");
  }, [router]);

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
            一覧に戻る
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">新規ES作成</h2>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <ESForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          preSelectedCompanyId={companyId}
        />
      </main>
    </div>
  );
}

export default function ESNewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ESNewPageContent />
    </Suspense>
  );
}
