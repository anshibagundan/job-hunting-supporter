"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building2 } from "lucide-react"
import { createCompany, type CreateCompanyRequest } from "@/components/company/api"
import { useToast } from "@/hooks/useToast"

export default function NewCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    image: "",
    industry: "",
    scrape_target_url: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "エラー",
        description: "企業名は必須です",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      await createCompany(formData)
      toast({
        title: "成功",
        description: "企業が正常に作成されました",
      })
      router.push("/company")
    } catch (error) {
      console.error("Failed to create company:", error)
      toast({
        title: "エラー",
        description: "企業の作成に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/company")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">新しい企業を追加</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>企業情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="required">
                  企業名 *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="例：株式会社○○"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">業界</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="例：IT・ソフトウェア"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">ウェブサイト</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="例：https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">企業ロゴURL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="例：https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">企業概要</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="企業の概要や特徴を記入してください..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scrape_target_url">スクレイピング対象URL</Label>
              <Input
                id="scrape_target_url"
                name="scrape_target_url"
                type="url"
                value={formData.scrape_target_url}
                onChange={handleInputChange}
                placeholder="例：https://example.com/careers"
              />
              <p className="text-sm text-gray-500">
                求人情報の自動取得に使用するURLです（オプション）
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/company")}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "作成中..." : "企業を作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
