import apiClient from "@/lib/api-client";
import type { InterviewLog } from "@/lib/supabase";

// Helper function to convert backend interview to frontend format
export const convertInterviewToFrontend = (
  backendInterview: any
): InterviewLog => {
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
  };
};

// Individual interview fetch
export const fetchInterview = async (id: string) => {
  const response = await apiClient.get(`/interviews/${id}`);
  return convertInterviewToFrontend(response.data);
};

// All interviews fetch
export const fetchAllInterviews = async () => {
  const response = await apiClient.get("/interviews");
  return response.data?.map(convertInterviewToFrontend);
};

// Interviews by user ID
export const fetchInterviewsByUserID = async (userID: string) => {
  const response = await apiClient.get(`/interviews/user/${userID}`);
  return response.data?.map(convertInterviewToFrontend);
};

// Interviews by company ID
export const fetchInterviewsByCompanyID = async (companyID: string) => {
  try {
    const response = await apiClient.get(`/interviews/company/${companyID}`);
    return response.data?.map(convertInterviewToFrontend) || [];
  } catch (error) {
    console.error("Failed to fetch interviews by company ID:", error);
    return [];
  }
};

export const createInterview = async (data: InterviewLog) => {
  console.log("Creating interview with data:", data);

  // 音声ファイルがある場合はFormDataを使用
  if (data.audioFile) {
    console.log("Using FormData for audio file upload");
    const formData = new FormData();

    // フォームデータに面接情報を追加
    formData.append("user_id", Number.parseInt(data.userId || "1").toString());
    formData.append(
      "company_id",
      Number.parseInt(data.company?.id || "1").toString()
    );
    formData.append(
      "job_event_id",
      Number.parseInt(data.jobEventId || "1").toString()
    );
    formData.append(
      "interview_at",
      data.interviewAt
        ? new Date(data.interviewAt).toISOString()
        : new Date().toISOString()
    );
    formData.append("stage", data.stage || "");
    formData.append("text_note", data.textNote || "");
    formData.append("location", data.location || "");
    formData.append("meeting_url", data.meetingUrl || "");

    // 音声ファイルを追加
    formData.append("audio_file", data.audioFile);

    console.log("Sending FormData to /interviews/with-audio");
    // multipart/form-dataとして送信（CreateInterviewWithAudioエンドポイントを使用）
    const response = await apiClient.post("/interviews/with-audio", formData);
    return convertInterviewToFrontend(response.data);
  }
  console.log("Using JSON for regular interview creation");
  // 音声ファイルがない場合は通常のJSON送信
  const backendData = {
    user_id: data.userId ? Number.parseInt(data.userId) : 1, // 固定値（JWTミドルウェアで上書きされる）
    company_id: Number.parseInt(data.company?.id || "1"),
    job_event_id: 1, // 固定値（デフォルトのjob_event）
    interview_at: data.interviewAt
      ? new Date(data.interviewAt).toISOString()
      : new Date().toISOString(),
    stage: data.stage || "",
    transcript: data.transcript || "",
    audio_summary: data.audioSummary || "",
    text_note: data.textNote || "",
    location: data.location || "",
    meeting_url: data.meetingUrl || "",
    audio_file: "",
  };

  console.log(
    "Sending JSON to /interviews:",
    JSON.stringify(backendData, null, 2)
  );

  try {
    const response = await apiClient.post("/interviews", backendData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Interview creation successful:", response.data);
    return convertInterviewToFrontend(response.data);
  } catch (error) {
    console.error("Interview creation failed:", error);
    throw error;
  }
};

export const updateInterview = async (id: string, data: InterviewLog) => {
  if (data.audioFile) {
    console.log("Updating interview with audio file using FormData");
    const formData = new FormData();

    // フォームデータに面接情報を追加
    formData.append("user_id", Number.parseInt(data.userId || "1").toString());
    formData.append(
      "company_id",
      Number.parseInt(data.company?.id || "1").toString()
    );
    formData.append(
      "job_event_id",
      Number.parseInt(data.jobEventId || "1").toString()
    );
    formData.append(
      "interview_at",
      data.interviewAt
        ? new Date(data.interviewAt).toISOString()
        : new Date().toISOString()
    );
    formData.append("stage", data.stage || "");
    formData.append("text_note", data.textNote || "");
    formData.append("location", data.location || "");
    formData.append("meeting_url", data.meetingUrl || "");

    // 音声ファイルを追加
    formData.append("audio_file", data.audioFile);

    console.log("Sending FormData to /interviews/with-audio");
    const response = await apiClient.put(
      `/interviews/with-audio/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return convertInterviewToFrontend(response.data);
  }
  console.log("Updating interview without audio file using JSON");
  // 音声ファイルがない場合は通常のJSON送信
  const backendData = {
    user_id: data.userId ? Number.parseInt(data.userId) : 1, // 固定値（JWTミドルウェアで上書きされる）
    company_id: Number.parseInt(data.company?.id || "1"),
    job_event_id: Number.parseInt(data.jobEventId || "1"),
    interview_at: data.interviewAt
      ? new Date(data.interviewAt).toISOString()
      : new Date().toISOString(),
    stage: data.stage || "",
    transcript: data.transcript || "",
    audio_summary: data.audioSummary || "",
    text_note: data.textNote || "",
    location: data.location || "",
    meeting_url: data.meetingUrl || "",
  };

  console.log(
    "Sending JSON to /interviews:",
    JSON.stringify(backendData, null, 2)
  );

  const response = await apiClient.put(`/interviews/${id}`, backendData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return convertInterviewToFrontend(response.data);
};

export const deleteInterview = async (id: string) => {
  const response = await apiClient.delete(`/interviews/${id}`);
  return response.data;
};

export const saveInterview = async (data: InterviewLog) => {
  if (data.id) {
    return updateInterview(data.id, data);
  }
  return createInterview(data);
};

export const removeInterview = async (id: string) => {
  return deleteInterview(id);
};

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
    transcript: string;
    summary: string;
    questions: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await apiClient.post<{
        transcript: string;
        summary: string;
        questions: string[];
      }>("/interviews/process-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error processing audio:", error);
      throw error;
    }
  },
};
