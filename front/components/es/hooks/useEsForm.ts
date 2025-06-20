import { useState, useMemo, useCallback, useEffect } from "react"
import { storage, type ESEntry, type Company } from "@/lib/supabase"

export function useESForm(entry?: ESEntry | null, preSelectedCompanyId?: string | null) {
  // useMemoで初期データを計算
  const initialData = useMemo((): ESEntry => ({
    id: entry?.id || "",
    company: entry?.company || {} as Company,
    title: entry?.title || "",
    content: entry?.content || "",
    summary: entry?.summary || "",
    advice: entry?.advice || "",
    created_at: entry?.created_at || "",
  }), [entry])

  const [formData, setFormData] = useState<ESEntry>(initialData)

  // 事前選択された企業IDがある場合、該当する企業を設定
  useEffect(() => {
    if (preSelectedCompanyId && !entry) {
      const loadCompanyData = async () => {
        try {
          const companies = await storage.getCompanies()
          const preSelectedCompany = companies.find(company => company.id === preSelectedCompanyId)
          if (preSelectedCompany) {
            setFormData(prev => ({ ...prev, company: preSelectedCompany }))
          }
        } catch (error) {
          console.error('Failed to load companies:', error)
        }
      }
      loadCompanyData()
    }
  }, [preSelectedCompanyId, entry])

  // entryが変更された場合にフォームデータを更新
  useMemo(() => {
    setFormData(initialData)
  }, [initialData])

  const updateField = useCallback((field: keyof ESEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateCompany = useCallback((company: Company) => {
    setFormData(prev => ({ ...prev, company }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      id: "",
      company: {} as Company,
      title: "",
      content: "",
      summary: "",
      advice: "",
      created_at: "",
    })
  }, [])

  const isFormValid = useCallback(() => {
    return formData.company?.id &&
           formData.title.trim() !== "" &&
           formData.content.trim() !== ""
  }, [formData])

  return {
    formData,
    setFormData,
    updateField,
    updateCompany,
    resetForm,
    isFormValid,
  }
}
