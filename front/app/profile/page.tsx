"use client";

import {
  ArrowLeft,
  BarChart3,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { SemiCircleProgress } from "@/components/ui/semi-circle-progress";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/components/user/api";
import { useUserProfile } from "@/hooks/useAuth";

interface AdviceItem {
  category: string;
  achievement: number;
  reason: string;
  suggestion: string;
}

interface AdviceItemCardProps {
  item: AdviceItem;
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

export default function ProfilePage() {
  const { user, userProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleAnalyze = async () => {
    if (!editData.basic_es.trim()) return;

    setIsAnalyzing(true);
    try {
      // 分析付きで保存を実行
      await updateUserProfile(userProfile.id, {
        name: editData.name,
        basic_es: editData.basic_es,
        analyze_base_es: true, // 分析フラグを追加
      });
      setIsEditing(false);
      // プロフィールを再読み込み
      window.location.reload();
    } catch (error) {
      console.error("Failed to analyze and update profile:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(userProfile.id, {
        name: editData.name,
        basic_es: editData.basic_es,
        analyze_base_es: false, // 分析なしで保存
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
              <div className="space-y-6">
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

                {/* 編集画面での分析結果表示 */}
                {userProfile.summary && userProfile.advice_items && (
                  <div className="space-y-6 mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      <h4 className="font-medium text-lg">現在の分析結果</h4>
                    </div>

                    {/* 分析要約 */}
                    <div>
                      <h5 className="font-medium text-base mb-3">分析要約</h5>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <MarkdownRenderer content={userProfile.summary} />
                      </div>
                    </div>

                    {/* 項目別達成度評価 */}
                    {userProfile.advice_items &&
                      userProfile.advice_items.length > 0 && (
                        <div>
                          <h5 className="font-medium text-base mb-4 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            項目別達成度評価
                          </h5>
                          <div className="space-y-8">
                            {userProfile.advice_items.map((item, index) => (
                              <AdviceItemCard key={index} item={item} />
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      <p>
                        💡
                        「分析して保存」ボタンを押すと、最新の基本ES内容で分析結果が更新されます。
                      </p>
                    </div>
                  </div>
                )}
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

        {/* 基本ES分析セクション */}
        {!isEditing &&
          userProfile.basic_es &&
          userProfile.summary &&
          userProfile.advice_items && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  基本ES分析結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 分析要約 */}
                <div>
                  <h4 className="font-medium text-lg mb-3">分析要約</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <MarkdownRenderer content={userProfile.summary} />
                  </div>
                </div>

                {/* 項目別達成度評価 */}
                {userProfile.advice_items &&
                  userProfile.advice_items.length > 0 && (
                    <div>
                      <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        項目別達成度評価
                      </h4>
                      <div className="space-y-8">
                        {userProfile.advice_items.map((item, index) => (
                          <AdviceItemCard key={index} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

        {isEditing && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleSave}>保存</Button>
              <Button
                onClick={handleAnalyze}
                disabled={!editData.basic_es.trim() || isAnalyzing}
                variant="outline"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    分析して保存
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
