import { ArrowRight, Building2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyResponse } from "./api";

interface CompanyCardProps {
  company: CompanyResponse;
  onClick: (companyId: number) => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
      onClick={() => onClick(company.id)}
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
                className="h-full object-cover"
              />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <CardDescription className="text-sm">
            {/* 文字数制限 */}
            {company.description
              ? company.description.length > 100
                ? `${company.description.slice(0, 100)}...`
                : company.description
              : "企業の詳細情報はありません。"}
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
  );
}
