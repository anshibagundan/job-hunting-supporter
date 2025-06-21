import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Header } from "@/components/layout/header"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "就活サポーター",
  description: "ES管理・面接予定・振り返りを一元管理",
  generator: 'v0.dev',
  icons: {
    icon: '/job-hunting-logo-circle.png',
    apple: '/job-hunting-logo-circle.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Header />
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
