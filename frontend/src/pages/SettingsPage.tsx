import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Header } from '@/components/Header';
import {
    ArrowLeft,
    Settings,
    User,
    Bell,
    Shield,
    Globe,
    Palette,
    Smartphone,
    Mail,
    Key,
    Database,
    Download,
    Trash2,
    HelpCircle,
    ExternalLink
} from 'lucide-react';

const SettingsPage = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('general');
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            sms: true,
            updates: true,
            marketing: false
        },
        privacy: {
            profileVisible: true,
            shareData: false,
            analytics: true
        },
        preferences: {
            language: 'en',
            timezone: 'UTC',
            currency: 'USD',
            autoSave: true
        }
    });

    const updateSetting = (section: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const settingSections = [
        {
            id: 'general',
            title: 'General',
            icon: Settings,
            description: 'Basic application settings'
        },
        {
            id: 'account',
            title: 'Account',
            icon: User,
            description: 'Account and profile settings'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: Bell,
            description: 'Manage notification preferences'
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            icon: Shield,
            description: 'Privacy and security options'
        },
        {
            id: 'appearance',
            title: 'Appearance',
            icon: Palette,
            description: 'Theme and display settings'
        },
        {
            id: 'data',
            title: 'Data & Storage',
            icon: Database,
            description: 'Manage your data and storage'
        }
    ];

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <nav className="space-y-1">
                                    {settingSections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent rounded-none first:rounded-t-lg last:rounded-b-lg transition-colors ${activeSection === section.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-foreground'
                                                }`}
                                        >
                                            <section.icon className="w-4 h-4" />
                                            <div>
                                                <div className="font-medium text-sm">{section.title}</div>
                                                <div className="text-xs opacity-70">{section.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-3">
                        {/* General Settings */}
                        {activeSection === 'general' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        General Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="language">Language</Label>
                                            <Select value={settings.preferences.language} onValueChange={(value) => updateSetting('preferences', 'language', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="si">සිංහල (Sinhala)</SelectItem>
                                                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Select value={settings.preferences.timezone} onValueChange={(value) => updateSetting('preferences', 'timezone', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                    <SelectItem value="Asia/Colombo">Asia/Colombo</SelectItem>
                                                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Auto-save changes</Label>
                                            <p className="text-sm text-muted-foreground">Automatically save your work</p>
                                        </div>
                                        <Switch
                                            checked={settings.preferences.autoSave}
                                            onCheckedChange={(checked) => updateSetting('preferences', 'autoSave', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Account Settings */}
                        {activeSection === 'account' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Account Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label>Email Address</Label>
                                        <Input value={user?.email || ''} disabled className="mt-2" />
                                        <p className="text-sm text-muted-foreground mt-1">Your email address cannot be changed</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Account Actions</h4>
                                        <div className="space-y-3">
                                            <Button variant="outline" className="w-full justify-start">
                                                <Key className="w-4 h-4 mr-2" />
                                                Change Password
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start">
                                                <Download className="w-4 h-4 mr-2" />
                                                Export Account Data
                                            </Button>
                                            <Button variant="destructive" className="w-full justify-start">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notifications */}
                        {activeSection === 'notifications' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notification Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4" />
                                                <div>
                                                    <Label>Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.email}
                                                onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="w-4 h-4" />
                                                <div>
                                                    <Label>Push Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.push}
                                                onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Product Updates</Label>
                                                <p className="text-sm text-muted-foreground">Get notified about new features</p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.updates}
                                                onCheckedChange={(checked) => updateSetting('notifications', 'updates', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Marketing Communications</Label>
                                                <p className="text-sm text-muted-foreground">Receive promotional content</p>
                                            </div>
                                            <Switch
                                                checked={settings.notifications.marketing}
                                                onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Privacy & Security */}
                        {activeSection === 'privacy' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Privacy & Security
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Profile Visibility</Label>
                                                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.profileVisible}
                                                onCheckedChange={(checked) => updateSetting('privacy', 'profileVisible', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Data Sharing</Label>
                                                <p className="text-sm text-muted-foreground">Allow sharing anonymized data for research</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.shareData}
                                                onCheckedChange={(checked) => updateSetting('privacy', 'shareData', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Analytics</Label>
                                                <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.analytics}
                                                onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-medium mb-3">Security Status</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Two-Factor Authentication</span>
                                                <Badge variant="destructive">Disabled</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Account Verification</span>
                                                <Badge variant="default">Verified</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Appearance */}
                        {activeSection === 'appearance' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="w-5 h-5" />
                                        Appearance Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Theme</Label>
                                                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm capitalize">{theme} Mode</span>
                                                <ThemeToggle />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <Label>Font Size</Label>
                                            <Select defaultValue="medium">
                                                <SelectTrigger className="w-full mt-2">
                                                    <SelectValue placeholder="Select font size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="small">Small</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="large">Large</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Color Scheme</Label>
                                            <div className="grid grid-cols-3 gap-3 mt-2">
                                                <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                                                    <div className="w-full h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded mb-2"></div>
                                                    <span className="text-xs">Default</span>
                                                </div>
                                                <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent opacity-50">
                                                    <div className="w-full h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded mb-2"></div>
                                                    <span className="text-xs">Purple</span>
                                                </div>
                                                <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent opacity-50">
                                                    <div className="w-full h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded mb-2"></div>
                                                    <span className="text-xs">Orange</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Data & Storage */}
                        {activeSection === 'data' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="w-5 h-5" />
                                        Data & Storage
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="text-2xl font-bold text-primary">24</div>
                                            <div className="text-sm text-muted-foreground">Detection Results</div>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="text-2xl font-bold text-primary">12</div>
                                            <div className="text-sm text-muted-foreground">Saved Notes</div>
                                        </div>
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="text-2xl font-bold text-primary">2.4 MB</div>
                                            <div className="text-sm text-muted-foreground">Storage Used</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Data Management</h4>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export All Data
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start">
                                            <Database className="w-4 h-4 mr-2" />
                                            Clear Cache
                                        </Button>
                                        <Button variant="destructive" className="w-full justify-start">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete All Data
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Help Section */}
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <h4 className="font-medium">Need Help?</h4>
                                    <p className="text-sm text-muted-foreground">Check our documentation or contact support</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Get Help
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
