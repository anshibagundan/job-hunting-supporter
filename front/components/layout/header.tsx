"use client"

import { useAuth } from "@/contexts/auth-context"
import { SignInButton } from "./header/signin-button"
import { UserIcon } from "./header/user-icon"

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  return (
    <header className="border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">就活サポーター</h1>
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