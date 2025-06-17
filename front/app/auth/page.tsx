"use client"

import type React from "react"
import { SignIn, SignUp } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">就活ダッシュボード</CardTitle>
          <CardDescription>ES管理・面接予定・振り返りを一元管理</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">ログイン</TabsTrigger>
              <TabsTrigger value="signup">新規登録</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <div className="flex justify-center">
                <SignIn
                  routing="hash"
                  signUpUrl="#signup"
                />
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="flex justify-center">
                <SignUp
                  routing="hash"
                  signInUrl="#signin"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
