import { api } from '@/lib/api-client';

export interface JobEventResponse {
  id: number;
  user_id: number;
  company_id: number;
  job_title: string;
  job_type: string;
  job_description: string;
  start_date: string;
  deadline: string;
  event_url: string;
  created_at: string;
  updated_at: string;
}

export interface JobEventRequest {
  user_id: number;
  company_id: number;
  job_title: string;
  job_type: string;
  job_description: string;
  start_date: string;
  deadline: string;
  event_url: string;
}

export const fetchJobEventsByCompanyID = async (companyID: string): Promise<JobEventResponse[]> => {
  return api.get(`/job-events/company/${companyID}`);
};

export const fetchJobEventsByUserID = async (userID: string): Promise<JobEventResponse[]> => {
  return api.get(`/job-events/user/${userID}`);
};

export const fetchAllJobEvents = async (): Promise<JobEventResponse[]> => {
  return api.get('/job-events');
};

export const createJobEvent = async (jobEvent: JobEventRequest): Promise<JobEventResponse> => {
  return api.post('/job-events', jobEvent);
};

export const updateJobEvent = async (id: string, jobEvent: JobEventRequest): Promise<JobEventResponse> => {
  return api.put(`/job-events/${id}`, jobEvent);
};

export const deleteJobEvent = async (id: string): Promise<void> => {
  return api.delete(`/job-events/${id}`);
};
