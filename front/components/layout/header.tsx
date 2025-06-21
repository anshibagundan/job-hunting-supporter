"use client"

import { useAuth } from "@/hooks/useAuth"
import { useAuth as useFirebaseAuth } from "@/contexts/auth-context"
import { SignInButton } from "./header/signin-button"
import { UserIcon } from "./header/user-icon"
import { HamburgerMenu } from "./hamburger-menu"
import { Logo } from "@/components/common/logo"
import Link from "next/link"

export function Header() {
  const { signInWithGoogle } = useFirebaseAuth()
  const { user, userProfile, isLoading } = useAuth()

  return (
    <header className="border-b px-8 py-3 bg-white shadow-sm">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/home" className="hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-6">
          {!isLoading && !user && (
            <SignInButton onSignIn={signInWithGoogle} />
          )}
          {!isLoading && user && (
            <>
              <UserIcon user={user} userProfile={userProfile} />
              <HamburgerMenu />
            </>
          )}
        </div>
      </div>
    </header>
  )
}