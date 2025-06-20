import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompanyDetailHeaderProps {
  companyName: string
  onBack: () => void
}

export function CompanyDetailHeader({ companyName, onBack }: CompanyDetailHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          企業一覧に戻る
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">{companyName}</h2>
      </div>
    </header>
  )
}
