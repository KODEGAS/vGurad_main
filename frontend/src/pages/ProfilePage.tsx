import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Header } from '@/components/Header';
import { SavedNotes } from '@/components/profile/SavedNotes';
import { SavedResults } from '@/components/profile/SavedResults';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    Award,
    Activity,
    BookOpen,
    FileText,
    ArrowLeft
} from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/firebase';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    farmSize: string;
    cropTypes: string[];
    joinDate: string;
}

const ProfilePage = () => {
    const { user, userProfile, isLoading } = useAuthContext();
    const { t } = useTranslation();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const [userData, setUserData] = useState<UserData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        farmSize: '',
        cropTypes: [],
        joinDate: ''
    });

    const [editData, setEditData] = useState<UserData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        farmSize: '',
        cropTypes: [],
        joinDate: ''
    });

    useEffect(() => {
        if (user && userProfile) {
            const data: UserData = {
                firstName: userProfile.firstName || user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: userProfile.phone || '',
                bio: '',
                location: userProfile.location || '',
                farmSize: '',
                cropTypes: [],
                joinDate: user.metadata.creationTime || ''
            };
            setUserData(data);
            setEditData(data);
        }
    }, [user, userProfile]);

    const getDisplayName = () => {
        if (userData.firstName && userData.lastName) {
            return `${userData.firstName} ${userData.lastName}`;
        }
        if (user?.displayName) return user.displayName;
        if (userData.firstName) return userData.firstName;
        return user?.email?.split('@')[0] || 'User';
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const handleInputChange = (field: keyof UserData, value: string | string[]) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update Firebase Auth display name if changed
            if (auth.currentUser && editData.firstName !== userData.firstName) {
                await updateProfile(auth.currentUser, {
                    displayName: `${editData.firstName} ${editData.lastName}`.trim()
                });
            }

            // Here you would typically update the user profile in your database
            // For now, we'll just update local state
            setUserData(editData);
            setIsEditing(false);

            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Update Failed",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(userData);
        setIsEditing(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-100"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Profile Header */}
                <Card className="mb-8 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500"></div>
                    <CardContent className="relative pt-0 pb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
                            <div className="relative">
                                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                                    <AvatarImage src={user?.photoURL || undefined} alt={getDisplayName()} />
                                    <AvatarFallback className="text-2xl md:text-3xl bg-gradient-to-br from-green-400 to-blue-400 text-white">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {getDisplayName()}
                                </h1>
                                <p className="text-gray-600 mb-4">{userData.email}</p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Verified Farmer
                                    </Badge>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        <Award className="w-3 h-3 mr-1" />
                                        Premium Member
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 mb-8">
                    {[
                        { id: 'profile', label: 'Profile Info', icon: User },
                        { id: 'activity', label: 'Activity', icon: Activity },
                        { id: 'notes', label: 'Saved Notes', icon: BookOpen },
                        { id: 'results', label: 'Detection Results', icon: FileText },
                    ].map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "default" : "ghost"}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Personal Information */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="firstName"
                                                    value={editData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{userData.firstName || 'Not provided'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="lastName"
                                                    value={editData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{userData.lastName || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-900">{userData.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        {isEditing ? (
                                            <Input
                                                id="phone"
                                                value={editData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-900">{userData.phone || 'Not provided'}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        {isEditing ? (
                                            <Input
                                                id="location"
                                                value={editData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                placeholder="City, State, Country"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-900">{userData.location || 'Not provided'}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="bio"
                                                value={editData.bio}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                                placeholder="Tell us about yourself and your farming experience..."
                                                rows={4}
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">
                                                {userData.bio || 'No bio provided'}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Farm Information & Stats */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Farm Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="farmSize">Farm Size</Label>
                                        {isEditing ? (
                                            <Input
                                                id="farmSize"
                                                value={editData.farmSize}
                                                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                                placeholder="e.g., 50 acres"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{userData.farmSize || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Crop Types</Label>
                                        {isEditing ? (
                                            <Input
                                                value={editData.cropTypes.join(', ')}
                                                onChange={(e) => handleInputChange('cropTypes', e.target.value.split(',').map(s => s.trim()))}
                                                placeholder="e.g., Tomatoes, Potatoes, Corn"
                                            />
                                        ) : (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {userData.cropTypes.length > 0 ? (
                                                    userData.cropTypes.map((crop, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {crop}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No crops specified</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Member since</span>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {formatDate(userData.joinDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Account Status</span>
                                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Disease detection scan completed</p>
                                        <p className="text-sm text-gray-600">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Saved farming tip</p>
                                        <p className="text-sm text-gray-600">1 day ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Profile updated</p>
                                        <p className="text-sm text-gray-600">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'notes' && <SavedNotes />}
                {activeTab === 'results' && <SavedResults />}
            </div>
        </div>
    );
};

export default ProfilePage;
