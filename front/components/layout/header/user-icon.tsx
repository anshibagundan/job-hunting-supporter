"use client"

import { User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserIconProps {
  user: User
  onSignOut: () => void
}

export function UserIcon({ user, onSignOut }: UserIconProps) {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push("/profile")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <img
                  src={user.photoURL || '/placeholder-user.jpg'}
                  alt={user.displayName || 'User'}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.displayName || 'Unknown User'}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <Settings className="mr-2 h-4 w-4" />
              プロフィール設定
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              サインアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>{user.displayName || 'Unknown User'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
