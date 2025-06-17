"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Calendar, FileText, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <nav className="mt-6">
        <Link href="/calendar">
          <Button
            variant={isActive("/calendar") ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
          >
            <Calendar className="mr-3 h-4 w-4" />
            カレンダー
          </Button>
        </Link>
        <Link href="/es">
          <Button
            variant={isActive("/es") ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
          >
            <FileText className="mr-3 h-4 w-4" />
            ES管理
          </Button>
        </Link>
        <Link href="/interview">
          <Button
            variant={isActive("/interview") ? "secondary" : "ghost"}
            className="w-full justify-start px-6 py-3"
          >
            <Mic className="mr-3 h-4 w-4" />
            面接ログ
          </Button>
        </Link>
      </nav>
    </div>
  )
}
