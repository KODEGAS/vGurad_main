import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase'; 
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UserProfile {
  email: string;
  role: 'admin' | 'proUser' | 'user';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'proUser' | 'user')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('http://localhost:5001/api/user-profile', {
            headers: { 'Authorization': `Bearer ${idToken}` },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user profile.');
          }
          const profile = await response.json();
          setUserProfile(profile);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Redirect to home or login page on error
          navigate('/');
        }
      } else {
        // No user is signed in, redirect to the main page
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  // Check if the user's role is in the list of allowed roles
  const hasPermission = userProfile && allowedRoles.includes(userProfile.role);

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="p-8 text-center shadow-lg">
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600">You do not have permission to view this page.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
