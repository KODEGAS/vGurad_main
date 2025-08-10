// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { AuthDialog } from './AuthDialog';
import { LogOut } from 'lucide-react';

const App = () => {
  return (
    <div className="container mx-auto p-4 font-sans">
      <Dashboard />
    </div>
  );
};

interface UserProfile {
  email: string;
  role: 'admin' | 'proUser' | 'user';
}


const Dashboard = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch('http://localhost:5001/api/user-profile', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.log('User profile not found in backend. Signup in progress...');
              setUserProfile(null);
            }
            throw new Error('Failed to fetch user profile.');
          }

          const profile = await response.json();
          setUserProfile(profile);
        } catch (error: any) {
          console.error('Error fetching user profile:', error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.role === 'admin') {
      navigate('/admin');
    }
  }, [userProfile, navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Conditionally render the AuthDialog or the dashboard content */}
      {!firebaseUser ? (
        <>
          <Button onClick={() => setShowAuthDialog(true)}>Sign In</Button>
          <AuthDialog 
            open={showAuthDialog} 
            onOpenChange={setShowAuthDialog} 
          />
        </>
      ) : (
        <>
          {userProfile ? (
            <Card className="w-full max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Welcome, {userProfile.email}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-lg">Your role: <span className="font-bold text-green-600">{userProfile.role}</span></p>

                {userProfile.role === 'proUser' && (
                  <div className="border p-4 rounded-lg bg-emerald-50 border-emerald-300">
                    <h4 className="font-semibold text-lg text-emerald-700">Pro Features Unlocked!</h4>
                    <p className="text-sm text-emerald-600">Access our exclusive expert support and advanced tools.</p>
                  </div>
                )}

                {userProfile.role === 'admin' && (
                  <div className="border p-4 rounded-lg bg-red-50 border-red-300">
                    <h4 className="font-semibold text-lg text-red-700">Admin Panel Access</h4>
                    <p className="text-sm text-red-600">You have full administrative control over the application.</p>
                  </div>
                )}
                
                <Button onClick={handleSignOut} variant="destructive" className="mt-4">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p>Completing your registration. Please wait...</p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
