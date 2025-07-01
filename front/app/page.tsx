"use client";

import { Calendar, FileText, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/common/logo";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [loading, user, router]);

  return (
    <div>
      {!loading && !user && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <Logo size="xl" showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              就活ダッシュボード
            </h1>
            <p className="text-gray-600 mb-8">
              ES管理・面接予定・振り返りを一元管理して、効率的な就職活動をサポートします。
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <FileText className="h-5 w-5" />
                <span>ES進捗管理</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Calendar className="h-5 w-5" />
                <span>面接スケジュール</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <Mic className="h-5 w-5" />
                <span>面接振り返り</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              始めるには上部のサインインボタンをクリックしてください
            </p>
          </div>
        </div>
      )}
      {!loading && user && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">ホームページに移動中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
