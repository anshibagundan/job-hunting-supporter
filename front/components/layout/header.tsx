"use client"

import { useAuth } from "@/contexts/auth-context"
import { SignInButton } from "./header/signin-button"
import { UserIcon } from "./header/user-icon"
import { Logo } from "@/components/common/logo"
import Link from "next/link"

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  return (
    <header className="border-b px-4 py-3 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/home" className="hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-4">
          {!loading && !user && (
            <SignInButton onSignIn={signInWithGoogle} />
          )}
          {!loading && user && (
            <UserIcon user={user} onSignOut={signOut} />
          )}
        </div>
      </div>
    </header>
  )
}