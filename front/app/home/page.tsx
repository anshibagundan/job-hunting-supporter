"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  FileText,
  Calendar,
  Mic,
  User,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useAuth";
import { fetchAllCompanies } from "@/components/company/api";
import { fetchESByUserID } from "@/components/es/api";
import { fetchJobEventsByUserID, type JobEventResponse } from "@/components/job-events/api";
import { storage } from "@/lib/supabase";

interface DashboardStats {
  companiesCount: number;
  esCount: number;
  upcomingInterviews: number;
  thisWeekDeadlines: JobEventResponse[];
  interviewLogsCount: number;
}

export default function HomePage() {
  const router = useRouter();
  const { user, userProfile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">ログインが必要です</div>
        </div>
      </div>
    );
  }

  const navigationCards = [
    {
      title: "企業管理",
      description: "企業情報を管理し、各企業のES・面接・予定を確認",
      icon: Building2,
      path: "/company",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      title: "ES管理",
      description: "エントリーシートの作成・編集・添削",
      icon: FileText,
      path: "/es",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600"
    },
    {
      title: "カレンダー",
      description: "面接やES締切などのスケジュール管理",
      icon: Calendar,
      path: "/calendar",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      title: "面接ログ",
      description: "面接の記録と振り返り・音声要約機能",
      icon: Mic,
      path: "/interview",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      title: "プロフィール",
      description: "ユーザー情報と基本ESの管理",
      icon: User,
      path: "/profile",
      color: "bg-gray-50 hover:bg-gray-100 border-gray-200",
      iconColor: "text-gray-600"
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          就活ダッシュボード
        </h1>
        <p className="text-gray-600">
          おかえりなさい、{userProfile.name}さん！今日も就活頑張りましょう。
        </p>
      </div>
      {/* ナビゲーションカード */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">メニュー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <Card
              key={card.path}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg group ${card.color}`}
              onClick={() => handleNavigate(card.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-gray-800 transition-colors">
                        {card.title}
                      </CardTitle>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>


          </div>
  );
}
