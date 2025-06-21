import type { InterviewLog } from "@/lib/supabase"
import apiClient from "@/lib/api-client"

// Helper function to convert backend interview to frontend format
export const convertInterviewToFrontend = (backendInterview: any): InterviewLog => {
  return {
    id: backendInterview.id?.toString() || "",
    company: {
      id: backendInterview.company?.id?.toString() || "",
      name: backendInterview.company?.name || "",
      industry: backendInterview.company?.industry || "",
      image: backendInterview.company?.image,
      description: backendInterview.company?.description,
      website: backendInterview.company?.website,
      events: [], // Events will be populated separately if needed
    },
    jobEventId: backendInterview.job_event_id?.toString() || "",
    userId: backendInterview.user_id?.toString() || "",
    interviewAt: backendInterview.interview_at || new Date().toISOString(),
    stage: backendInterview.stage || "一次面接",
    location: backendInterview.location || "",
    meetingUrl: backendInterview.meeting_url || "",
    audioFile: undefined,
    transcript: backendInterview.transcript || "",
    audioSummary: backendInterview.audio_summary || "",
    textNote: backendInterview.text_note || "",
    createdAt: backendInterview.created_at || new Date().toISOString(),
    updatedAt: backendInterview.updated_at || new Date().toISOString(),
  }
}

// Individual interview fetch
export const fetchInterview = async (id: string) => {
  const response = await apiClient.get(`/interviews/${id}`)
  return convertInterviewToFrontend(response.data)
}

// All interviews fetch
export const fetchAllInterviews = async () => {
  const response = await apiClient.get('/interviews')
  return response.data.map(convertInterviewToFrontend)
}

// Interviews by user ID
export const fetchInterviewsByUserID = async (userID: string) => {
  const response = await apiClient.get(`/interviews/user/${userID}`)
  return response.data.map(convertInterviewToFrontend)
}

// Interviews by company ID
export const fetchInterviewsByCompanyID = async (companyID: string) => {
  const response = await apiClient.get(`/interviews/company/${companyID}`)
  return response.data.map(convertInterviewToFrontend)
}

export const createInterview = async (data: any) => {
  // 音声ファイルがある場合はFormDataを使用
  if (data.audioFile) {
    const formData = new FormData()
    
    // フォームデータに面接情報を追加
    formData.append('user_id', (parseInt(data.userId || data.user_id || "1")).toString())
    formData.append('company_id', (parseInt(data.company?.id || data.company_id || "1")).toString())
    formData.append('job_event_id', (parseInt(data.jobEventId || data.job_event_id || "1")).toString())
    formData.append('interview_at', data.interviewAt ? new Date(data.interviewAt).toISOString() : new Date().toISOString())
    formData.append('stage', data.stage || "")
    formData.append('text_note', data.textNote || data.notes || "")
    formData.append('location', data.location || "")
    formData.append('meeting_url', data.meetingUrl || data.meeting_url || "")
    
    // 音声ファイルを追加
    formData.append('audio_file', data.audioFile)
    
    // multipart/form-dataとして送信（CreateInterviewWithAudioエンドポイントを使用）
    const response = await apiClient.post('/interviews', formData)
    return convertInterviewToFrontend(response.data)
  } else {
    // 音声ファイルがない場合は通常のJSON送信
    const backendData = {
      user_id: parseInt(data.userId || data.user_id || "1"),
      company_id: parseInt(data.company?.id || data.company_id || "1"),
      job_event_id: parseInt(data.jobEventId || data.job_event_id || "1"),
      interview_at: data.interviewAt ? new Date(data.interviewAt).toISOString() : new Date().toISOString(),
      stage: data.stage || "",
      transcript: data.transcript || "",
      audio_summary: data.audioSummary || data.summary || "",
      text_note: data.textNote || data.notes || "",
      location: data.location || "",
      meeting_url: data.meetingUrl || data.meeting_url || "",
      audio_file: ""
    }

    console.log('Sending interview data:', JSON.stringify(backendData, null, 2))
    
    const response = await apiClient.post('/interviews', backendData)
    return convertInterviewToFrontend(response.data)
  }
}

export const updateInterview = async (id: string, data: any) => {
  // JSONデータとして更新
  const backendData = {
    company_id: parseInt(data.company_id || data.company?.id || "1"),
    job_event_id: parseInt(data.job_event_id || data.jobEventId || "1"),
    interview_at: data.interview_at || data.interviewAt ? new Date(data.interview_at || data.interviewAt).toISOString() : new Date().toISOString(),
    stage: data.stage || "一次面接", 
    location: data.location || "",
    meeting_url: data.meeting_url || data.meetingUrl || "",
    text_note: data.text_note || data.textNote || "",
    audio_summary: data.audio_summary || data.audioSummary || "", // AI要約の更新対応
  }

  console.log('Updating interview:', JSON.stringify(backendData, null, 2))

  const response = await apiClient.put(`/interviews/${id}`, backendData)
  return convertInterviewToFrontend(response.data)
}

export const deleteInterview = async (id: string) => {
  const response = await apiClient.delete(`/interviews/${id}`)
  return response.data
}

export const saveInterview = async (data: any) => {
  if (data.id) {
    return updateInterview(data.id, data)
  } else {
    return createInterview(data)
  }
}

export const removeInterview = async (id: string) => {
  return deleteInterview(id)
}

export const interviewApi = {
  getAll: fetchAllInterviews,
  getById: fetchInterview,
  getByUserId: fetchInterviewsByUserID,
  getByCompanyId: fetchInterviewsByCompanyID,
  create: createInterview,
  update: updateInterview,
  delete: deleteInterview,
  save: saveInterview,
  remove: removeInterview,

  async processAudio(audioFile: File): Promise<{
    transcript: string
    summary: string
    questions: string[]
  }> {
    try {
      const formData = new FormData()
      formData.append("audio", audioFile)

      const response = await apiClient.post<{
        transcript: string
        summary: string
        questions: string[]
      }>("/interviews/process-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error processing audio:", error)
      throw error
    }
  },
}