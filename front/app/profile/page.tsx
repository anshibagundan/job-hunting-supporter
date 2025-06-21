"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">ユーザー情報が見つかりません</div>
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
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">プロフィール設定</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={user.photoURL || "/placeholder-user.jpg"}
                  alt={user.displayName || "User"}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {user.displayName || "Unknown User"}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    表示名
                  </label>
                  <p className="text-gray-900">
                    {user.displayName || "Unknown User"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  メールアドレスはGoogleアカウントから取得されています。
                  変更するにはGoogleアカウントの設定を更新してください。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
