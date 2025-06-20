import { useState, useMemo, useCallback } from "react"
import type { ESEntry } from "@/lib/supabase"

export function useESForm(entry?: ESEntry | null) {
  // useMemoで初期データを計算
  const initialData = useMemo(() => ({
    id: entry?.id || "",
    company_name: entry?.company_name || "",
    title: entry?.title || "",
    content: entry?.content || "",
    summary: entry?.summary || "",
    advice: entry?.advice || "",
    created_at: entry?.created_at || "",
  }), [entry])

  const [formData, setFormData] = useState<ESEntry>(initialData)

  // entryが変更された場合にフォームデータを更新
  useMemo(() => {
    setFormData(initialData)
  }, [initialData])

  const updateField = useCallback((field: keyof ESEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      id: "",
      company_name: "",
      title: "",
      content: "",
      summary: "",
      advice: "",
      created_at: "",
    })
  }, [])

  const isFormValid = useCallback(() => {
    return formData.company_name.trim() !== "" &&
           formData.title.trim() !== "" &&
           formData.content.trim() !== ""
  }, [formData])

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    isFormValid,
  }
}
