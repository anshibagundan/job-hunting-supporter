import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Header } from "@/components/layout/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "就活ダッシュボード",
  description: "ES管理・面接予定・振り返りを一元管理",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Header />
            <SignedOut>
              {children}
            </SignedOut>
            <SignedIn>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </SignedIn>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
