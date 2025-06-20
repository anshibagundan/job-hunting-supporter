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
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {company.image ? (
              <img
                src={company.image}
                alt={`${company.name}のロゴ`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{company.name}</CardTitle>
            <Badge variant="secondary" className="mb-3">
              {company.industry}
            </Badge>
            <CardDescription className="text-base">
              {company.description || "企業の詳細情報はありません。"}
            </CardDescription>
            {company.website && (
              <div className="flex items-center gap-2 mt-3 text-blue-600">
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
        </div>
      </CardHeader>
    </Card>
  )
}
