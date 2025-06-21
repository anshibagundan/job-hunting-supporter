"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { X, Menu, Calendar, FileText, Mic, Building2, Settings, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export function HamburgerMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const menuItems = [
    { href: "/home", label: "ホーム", icon: Home },
    { href: "/company", label: "企業一覧", icon: Building2 },
    { href: "/calendar", label: "カレンダー", icon: Calendar },
    { href: "/es", label: "ES管理", icon: FileText },
    { href: "/interview", label: "面接ログ", icon: Mic },
  ]

  const isActive = (path: string) => pathname === path

  const [isOpen, setIsOpen] = React.useState(false)

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={`flex items-center w-full px-2 py-2 ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <Settings className="mr-2 h-4 w-4" />
          プロフィール設定
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          サインアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
