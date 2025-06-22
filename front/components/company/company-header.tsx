import { Building2, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Company } from "@/lib/supabase"

interface CompanyHeaderProps {
  company: Company
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{company.name}</CardTitle>
              <Badge variant="secondary" className="mb-3">
                {company.industry}
              </Badge>
            </div>
          </div>

          {/* 写真を上部に配置 */}
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {company.image ? (
              <img
                src={company.image}
                alt={`${company.name}のロゴ`}
                className="h-full object-cover"
              />
            ) : (
              <Building2 className="h-16 w-16 text-gray-400" />
            )}
          </div>

          {/* 説明文 */}
          <CardDescription className="text-base">
            {company.description || "企業の詳細情報はありません。"}
          </CardDescription>

          {/* ウェブサイト */}
          {company.website && (
            <div className="flex items-center gap-2 text-blue-600">
              <Globe className="h-4 w-4" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}
