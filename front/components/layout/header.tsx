"use client"

import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  return (
    <header className="border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">就活サポーター</h1>
        <div className="flex items-center gap-4">
          {!loading && !user && (
            <>
              <button 
                onClick={signInWithGoogle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Googleでサインイン
              </button>
            </>
          )}
          {!loading && user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{user.displayName}</span>
              </div>
              <button 
                onClick={signOut}
                className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors"
              >
                サインアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}