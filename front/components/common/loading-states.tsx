import { Building2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "読み込み中..." }: LoadingSpinnerProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}

interface NotFoundMessageProps {
  message: string
  icon?: React.ReactNode
}

export function NotFoundMessage({ message, icon }: NotFoundMessageProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        {icon || <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
