import { useState, useEffect } from 'react';
import { useAuth as useFirebaseAuth } from '@/contexts/auth-context';
import { fetchUserByFirebaseUID, type UserProfile } from '@/components/user/api';

export function useUserProfile() {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (firebaseUser) {
        try {
          const profile = await fetchUserByFirebaseUID(firebaseUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    };

    if (!firebaseLoading) {
      loadUserProfile();
    }
  }, [firebaseUser, firebaseLoading]);

  return {
    user: firebaseUser,
    userProfile,
    isLoading: firebaseLoading || isLoading
  };
}
