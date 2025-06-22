"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllCompanies, type CompanyResponse } from "@/components/company/api";
import { CompanyCard } from "@/components/company/company-card";

export default function CompanyPage() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const backendCompanies: CompanyResponse[] = await fetchAllCompanies();
        setCompanies(backendCompanies);
      } catch (error) {
        console.error("Failed to load companies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleCompanyClick = (companyId: number) => {
    router.push(`/company/${companyId.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">企業一覧</h1>
        <Button
          onClick={() => router.push("/company/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          新しい企業を追加
        </Button>
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
                <CompanyCard
                  key={company.id}
                  company={company}
                  onClick={handleCompanyClick}
                />
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
