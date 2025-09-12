import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { User, Settings, Crown, Calendar, BarChart3, MessageCircle, TrendingUp, Lock, FileText, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollAnimatedSection } from './ScrollAnimatedSection';
import { useToast } from '@/hooks/use-toast';
import { AuthDialog } from './AuthDialog';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  location: string;
  subscription_tier: 'free' | 'pro';
  subscription_expires_at?: string;
  language_preference: 'en' | 'si' | 'ta';
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'si', label: 'සිංහල (Sinhala)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
];

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSavedNotes, setShowSavedNotes] = useState(false);
  const [showSavedResults, setShowSavedResults] = useState(false);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [savedResults, setSavedResults] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setShowAuthDialog(true);
        setLoading(false);
      } else {
        setShowAuthDialog(false);
        fetchProfile();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      console.log('Fetching profile for user:', user.uid);

      const response = await fetch('https://vgurad-backend.onrender.com/api/user-profile', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      console.log('Profile fetch response status:', response.status);

      if (response.status === 404) {
        // User profile doesn't exist, create one
        console.log('Profile not found, creating new profile...');
        await createUserProfile();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile fetch error:', errorText);
        throw new Error(`Failed to fetch profile: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);

      setProfile({
        id: data._id,
        full_name: data.displayName || '',
        phone: data.phone || '',
        location: data.location || '',
        subscription_tier: data.subscription_tier || 'free',
        subscription_expires_at: data.subscription_expires_at,
        language_preference: data.language_preference || 'en',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: `Failed to load profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      console.log('Creating profile for user:', user.uid, user.email);

      const response = await fetch('https://vgurad-backend.onrender.com/api/auth/create-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile creation error:', errorText);

        if (response.status === 409) {
          // Profile already exists, try fetching again
          await fetchProfile();
          return;
        }

        throw new Error(`Failed to create profile: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile created:', data);

      // After creating, fetch the profile
      await fetchProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: `Failed to create profile: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    if (!profile) return;
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const response = await fetch('https://vgurad-backend.onrender.com/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          language_preference: profile.language_preference,
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const upgradeToP0ro = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Payment integration coming soon!",
    });
  };

  const fetchSavedNotes = () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const savedNotesKey = `savedNotes_${user.uid}`;
      const storedNotes = localStorage.getItem(savedNotesKey);

      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        setSavedNotes(notes);
      } else {
        setSavedNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes from local storage:', error);
      setSavedNotes([]);
    }
  };

  const fetchSavedResults = () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const savedResultsKey = `savedResults_${user.uid}`;
      const storedResults = localStorage.getItem(savedResultsKey);

      if (storedResults) {
        const results = JSON.parse(storedResults);
        setSavedResults(results);
      } else {
        setSavedResults([]);
      }
    } catch (error) {
      console.error('Error fetching results from local storage:', error);
      setSavedResults([]);
    }
  };

  const deleteNote = (noteId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const savedNotesKey = `savedNotes_${user.uid}`;
      const storedNotes = localStorage.getItem(savedNotesKey);

      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        const updatedNotes = notes.filter((note: any) => note._id !== noteId);
        localStorage.setItem(savedNotesKey, JSON.stringify(updatedNotes));
        setSavedNotes(updatedNotes);

        toast({
          title: "Success",
          description: "Note deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const deleteResult = (resultId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const savedResultsKey = `savedResults_${user.uid}`;
      const storedResults = localStorage.getItem(savedResultsKey);

      if (storedResults) {
        const results = JSON.parse(storedResults);
        const updatedResults = results.filter((result: any) => result._id !== resultId);
        localStorage.setItem(savedResultsKey, JSON.stringify(updatedResults));
        setSavedResults(updatedResults);

        toast({
          title: "Success",
          description: "Detection result deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      toast({
        title: "Error",
        description: "Failed to delete detection result",
        variant: "destructive",
      });
    }
  };

  // Fetch saved notes when showSavedNotes becomes true
  useEffect(() => {
    if (showSavedNotes) {
      fetchSavedNotes();
    }
  }, [showSavedNotes]);

  // Fetch saved results when showSavedResults becomes true
  useEffect(() => {
    if (showSavedResults) {
      fetchSavedResults();
    }
  }, [showSavedResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        {showAuthDialog && (
          <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
        )}
      </div>
    );
  }

  if (showAuthDialog) {
    return <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />;
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p>You are not logged in!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4">
      <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <User className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and subscription</p>
          </div>

          {/* Profile Information */}
          <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Badge
                    variant={profile.subscription_tier === 'pro' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {profile.subscription_tier === 'pro' ? (
                      <Crown className="w-4 h-4" />
                    ) : null}
                    {profile.subscription_tier === 'pro' ? 'Pro User' : 'Free User'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profile.language_preference}
                      onValueChange={(value: 'en' | 'si' | 'ta') =>
                        setProfile({ ...profile, language_preference: value })
                      }
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  {editing ? (
                    <>
                      <Button onClick={updateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                  )}
                </div>

                {/* Save Notes and Save Results buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSavedNotes(!showSavedNotes)}
                    className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="truncate">
                      {showSavedNotes ? 'Hide' : 'Show'} Saved Notes
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSavedResults(!showSavedResults)}
                    className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <Search className="w-4 h-4" />
                    <span className="truncate">
                      {showSavedResults ? 'Hide' : 'Show'} Saved Results
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimatedSection>

          {/* Saved Notes Display */}
          {showSavedNotes && (
            <ScrollAnimatedSection animationType="fade-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Saved Notes
                  </CardTitle>
                  <CardDescription>
                    Your saved disease information and notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedNotes.length === 0 ? (
                    <p className="text-muted-foreground">No saved notes yet. Save disease information from the Disease Database to see them here.</p>
                  ) : (
                    <div className="space-y-4">
                      {savedNotes.map((note, index) => (
                        <div key={note._id || index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{note.title}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteNote(note._id)}
                              className="text-red-600 hover:text-red-700"
                              aria-label="Delete saved note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{note.content}</p>
                          <div className="text-xs text-muted-foreground">
                            Saved on: {new Date(note.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          )}

          {/* Saved Detection Results Display */}
          {showSavedResults && (
            <ScrollAnimatedSection animationType="fade-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Saved Detection Results
                  </CardTitle>
                  <CardDescription>
                    Your saved crop disease detection results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedResults.length === 0 ? (
                    <p className="text-muted-foreground">No saved detection results yet. Use the Crop Scanner to analyze diseases and save results.</p>
                  ) : (
                    <div className="space-y-4">
                      {savedResults.map((result, index) => (
                        <div key={result._id || index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{result.disease_name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{result.confidence}% confidence</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteResult(result._id)}
                                className="text-red-600 hover:text-red-700"
                                aria-label="Delete saved detection result"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                          {result.image_url && (
                            <img
                              src={result.image_url}
                              alt="Detection result"
                              className="w-20 h-20 object-cover rounded-md mb-2"
                            />
                          )}
                          <div className="text-xs text-muted-foreground">
                            Detected on: {new Date(result.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          )}

          {/* Subscription Status */}
          <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Subscription Status
                </CardTitle>
                <CardDescription>
                  {profile.subscription_tier === 'pro'
                    ? 'You have access to all premium features'
                    : 'Upgrade to unlock advanced farming features'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.subscription_tier === 'free' ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                      <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get access to treatment calendar, expert consultations, and advanced analytics
                      </p>
                      <Button onClick={upgradeToP0ro} className="flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 w-full sm:w-auto">
                        <TrendingUp className="w-4 h-4" />
                        <span className="truncate">Upgrade Now - LKR 1,500/month</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Pro Subscription Active
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.subscription_expires_at
                        ? `Expires on ${new Date(profile.subscription_expires_at).toLocaleDateString()}`
                        : 'Active subscription'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollAnimatedSection>

          {/* Feature Access */}
          <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Access</CardTitle>
                <CardDescription>Available features based on your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>Treatment Calendar</span>
                    </div>
                    {profile.subscription_tier === 'pro' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <span>Advanced Analytics</span>
                    </div>
                    {profile.subscription_tier === 'pro' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <span>Expert Consultation</span>
                    </div>
                    {profile.subscription_tier === 'pro' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-orange-500" />
                      <span>Community Forum</span>
                    </div>
                    {profile.subscription_tier === 'pro' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimatedSection>

          <Separator className="my-8 bg-white/20" />
        </div>
      </ScrollAnimatedSection>
    </div>
  );
};