import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { fetchMongoUserProfile } from '@/lib/fetchMongoUserProfile';

interface UserProfile {
  displayName?: string;
  firstName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  language_preference?: string;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoadingProfile: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    isLoading: true,
    isLoadingProfile: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthState(prev => ({
        ...prev,
        user: firebaseUser,
        isLoading: false,
      }));

      if (firebaseUser) {
        // User is logged in, fetch their profile from MongoDB
        setAuthState(prev => ({ ...prev, isLoadingProfile: true }));
        try {
          const profile = await fetchMongoUserProfile();
          setAuthState(prev => ({
            ...prev,
            userProfile: profile,
            isLoadingProfile: false,
          }));
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setAuthState(prev => ({
            ...prev,
            userProfile: null,
            isLoadingProfile: false,
          }));
        }
      } else {
        // User is logged out
        setAuthState(prev => ({
          ...prev,
          userProfile: null,
          isLoadingProfile: false,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
};
