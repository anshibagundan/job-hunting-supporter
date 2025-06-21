"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building2 } from "lucide-react"
import { fetchCompanyById, updateCompany, type CompanyResponse } from "@/components/company/api"
import { useToast } from "@/hooks/useToast"
import { LoadingSpinner } from "@/components/common/loading-states"

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const companyId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [company, setCompany] = useState<CompanyResponse | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    image: "",
    industry: "",
    scrape_target_url: "",
  })

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const companyData = await fetchCompanyById(companyId)
        setCompany(companyData)
        setFormData({
          name: companyData.name || "",
          website: companyData.website || "",
          description: companyData.description || "",
          image: companyData.image || "",
          industry: companyData.industry || "",
          scrape_target_url: companyData.scrape_target_url || "",
        })
      } catch (error) {
        console.error("Failed to load company:", error)
        toast({
          title: "エラー",
          description: "企業情報の読み込みに失敗しました",
          variant: "destructive",
        })
        router.push("/company")
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      loadCompany()
    }
  }, [companyId, router, toast])

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

    if (!company) return

    setIsSubmitting(true)
    
    try {
      const updatedCompany: CompanyResponse = {
        ...company,
        ...formData,
      }
      
      await updateCompany(updatedCompany)
      toast({
        title: "成功",
        description: "企業情報が正常に更新されました",
      })
      router.push(`/company/${companyId}`)
    } catch (error) {
      console.error("Failed to update company:", error)
      toast({
        title: "エラー",
        description: "企業情報の更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="企業情報を読み込み中..." />
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p>企業が見つかりません</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/company/${companyId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">企業情報を編集</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
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
                onClick={() => router.push(`/company/${companyId}`)}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "更新中..." : "変更を保存"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
