"use client";

import { useUserProfile } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Mail, Calendar, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateUserProfile } from "@/components/user/api";

export default function ProfilePage() {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    basic_es: "",
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">ユーザー情報が見つかりません</div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({
      name: userProfile.name,
      basic_es: userProfile.basic_es || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(userProfile.id, {
        name: editData.name,
        basic_es: editData.basic_es,
      });
      setIsEditing(false);
      // プロフィールを再読み込み
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: "", basic_es: "" });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
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
          <h1 className="text-3xl font-semibold text-gray-900">プロフィール</h1>
        </div>
        {!isEditing && <Button onClick={handleEdit}>編集</Button>}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ユーザー情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {userProfile.icon ? (
                  <img
                    src={userProfile.icon}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        表示名
                      </label>
                      <Input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="表示名を入力"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {userProfile.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Mail className="h-4 w-4" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        登録日:{" "}
                        {new Date(userProfile.created_at).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        最終更新日時:{" "}
                        {new Date(userProfile.updated_at).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              基本ES
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  基本ES（自己PR・志望動機など）
                </label>
                <Textarea
                  value={editData.basic_es}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      basic_es: e.target.value,
                    }))
                  }
                  placeholder="基本ESの内容を入力してください"
                  rows={8}
                  className="w-full"
                />
              </div>
            ) : (
              <div>
                {userProfile.basic_es ? (
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {userProfile.basic_es}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    基本ESが設定されていません
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave}>保存</Button>
            <Button variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
