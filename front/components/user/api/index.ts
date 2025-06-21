import  apiClient  from '@/lib/api-client';

export interface UserProfile {
  id: number;
  name: string;
  firebase_uid: string;
  email: string;
  icon: string;
  basic_es: string;
  created_at: string;
  updated_at: string;
}

export const fetchUserByFirebaseUID = async (firebaseUID: string): Promise<UserProfile> => {
  const response = await apiClient.get(`/users/firebase/${firebaseUID}`);
  return response.data;
};

export const updateUserProfile = async (userProfile: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await apiClient.put('/users', userProfile);
  return response.data;
};

export const syncFirebaseUser = async (userData: {
  firebase_uid: string;
  email: string;
  name: string;
  photo_url?: string;
}): Promise<UserProfile> => {
  const response = await apiClient.post('/users/sync', userData);
  return response.data;
};
