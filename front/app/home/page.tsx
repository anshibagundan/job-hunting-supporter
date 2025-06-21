"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storage, type Company } from "@/lib/supabase";

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesData = await storage.getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Failed to load companies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleCompanyClick = (companyId: string) => {
    router.push(`/company/${companyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">企業一覧</h1>
      </div>

      <main className="overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">企業データを読み込み中...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                  onClick={() => handleCompanyClick(company.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {company.name}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {company.industry}
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {company.image ? (
                          <img
                            src={company.image}
                            alt={`${company.name}のロゴ`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-12 w-12 text-gray-400" />
                        )}
                      </div>

                      <CardDescription className="text-sm">
                        {company.description || "企業の詳細情報はありません。"}
                      </CardDescription>

                      {company.website && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Globe className="h-3 w-3" />
                          <span className="truncate">{company.website}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {companies.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Building2 className="h-12 w-12 mb-4" />
                <p>登録されている企業がありません</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
