import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declare global variables provided by the runtime environment
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

// Firebase imports
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { ProductManager } from '@/components/admin/ProductManager';
import { WeatherAlertManager } from '@/components/admin/WeatherAlertManager';

// Define the data types for better type safety
interface Disease {
  id: string;
  name: string;
  description: string;
  treatment: string;
  severity: 'Low' | 'Medium' | 'High';
}

interface NewDisease {
  name: string;
  description: string;
  treatment: string;
  severity: 'Low' | 'Medium' | 'High';
}

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface NewTip {
  title: string;
  content: string;
  category: string;
}

interface Expert {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  availability: string;
}

interface NewExpert {
  name: string;
  specialization: string;
  contact: string;
  availability: string;
}

const Admin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [newDisease, setNewDisease] = useState<NewDisease>({ name: '', description: '', treatment: '', severity: 'Low' });
  const [newTip, setNewTip] = useState<NewTip>({ title: '', content: '', category: '' });
  const [newExpert, setNewExpert] = useState<NewExpert>({ name: '', specialization: '', contact: '', availability: '' });

  const [editingDiseaseId, setEditingDiseaseId] = useState<string | null>(null);
  const [editingTipId, setEditingTipId] = useState<string | null>(null);
  const [editingExpertId, setEditingExpertId] = useState<string | null>(null);
  const [editedDisease, setEditedDisease] = useState<Disease | null>(null);
  const [editedTip, setEditedTip] = useState<Tip | null>(null);
  const [editedExpert, setEditedExpert] = useState<Expert | null>(null);
  
  // Firebase configuration and initialization
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const setupAuthAndFirestore = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
            setIsLoading(false);
          } else {
            console.error("User not authenticated.");
            setIsLoading(false);
          }
        });

        return () => unsubscribeAuth();
      } catch (error) {
        console.error("Error during authentication:", error);
        setIsLoading(false);
      }
    };
    setupAuthAndFirestore();
  }, [auth, initialAuthToken]);
  
  useEffect(() => {
    if (!userId) return;

    const diseasesCollection = collection(db, `artifacts/${appId}/public/data/diseases`);
    const tipsCollection = collection(db, `artifacts/${appId}/public/data/tips`);
    const expertsCollection = collection(db, `artifacts/${appId}/public/data/experts`);

    const unsubscribeDiseases = onSnapshot(diseasesCollection, (snapshot) => {
      const diseasesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Disease[];
      setDiseases(diseasesData);
    }, (error) => {
      console.error("Error fetching diseases:", error);
      toast({ title: "Error fetching diseases", variant: "destructive" });
    });

    const unsubscribeTips = onSnapshot(tipsCollection, (snapshot) => {
      const tipsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tip[];
      setTips(tipsData);
    }, (error) => {
      console.error("Error fetching tips:", error);
      toast({ title: "Error fetching tips", variant: "destructive" });
    });

    const unsubscribeExperts = onSnapshot(expertsCollection, (snapshot) => {
      const expertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expert[];
      setExperts(expertsData);
    }, (error) => {
      console.error("Error fetching experts:", error);
      toast({ title: "Error fetching experts", variant: "destructive" });
    });

    return () => {
      unsubscribeDiseases();
      unsubscribeTips();
      unsubscribeExperts();
    };
  }, [db, appId, userId]);


  const addDisease = async () => {
    if (!newDisease.name || !newDisease.description) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/diseases`), newDisease);
      setNewDisease({ name: '', description: '', treatment: '', severity: 'Low' });
      toast({ title: "Disease added successfully" });
    } catch (error) {
      console.error("Error adding disease: ", error);
      toast({ title: "Error adding disease", description: "Please try again.", variant: "destructive" });
    }
  };

  const deleteDisease = async (id: string) => {
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/diseases`, id));
      toast({ title: "Disease deleted successfully" });
    } catch (error) {
      console.error("Error deleting disease: ", error);
      toast({ title: "Error deleting disease", description: "Please try again.", variant: "destructive" });
    }
  };

  const startEditDisease = (disease: Disease) => {
    setEditingDiseaseId(disease.id);
    setEditedDisease(disease);
  };
  
  const updateDisease = async () => {
    if (!editedDisease || !editedDisease.name || !editedDisease.description) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
  await updateDoc(doc(db, `artifacts/${appId}/public/data/diseases`, editedDisease.id), { ...editedDisease });
      setEditingDiseaseId(null);
      setEditedDisease(null);
      toast({ title: "Disease updated successfully" });
    } catch (error) {
      console.error("Error updating disease: ", error);
      toast({ title: "Error updating disease", description: "Please try again.", variant: "destructive" });
    }
  };

  const addTip = async () => {
    if (!newTip.title || !newTip.content) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/tips`), newTip);
      setNewTip({ title: '', content: '', category: '' });
      toast({ title: "Tip added successfully" });
    } catch (error) {
      console.error("Error adding tip: ", error);
      toast({ title: "Error adding tip", description: "Please try again.", variant: "destructive" });
    }
  };

  const deleteTip = async (id: string) => {
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/tips`, id));
      toast({ title: "Tip deleted successfully" });
    } catch (error) {
      console.error("Error deleting tip: ", error);
      toast({ title: "Error deleting tip", description: "Please try again.", variant: "destructive" });
    }
  };

  const startEditTip = (tip: Tip) => {
    setEditingTipId(tip.id);
    setEditedTip(tip);
  };

  const updateTip = async () => {
    if (!editedTip || !editedTip.title || !editedTip.content) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
  await updateDoc(doc(db, `artifacts/${appId}/public/data/tips`, editedTip.id), { ...editedTip });
      setEditingTipId(null);
      setEditedTip(null);
      toast({ title: "Tip updated successfully" });
    } catch (error) {
      console.error("Error updating tip: ", error);
      toast({ title: "Error updating tip", description: "Please try again.", variant: "destructive" });
    }
  };

  const addExpert = async () => {
    if (!newExpert.name || !newExpert.specialization) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
      await addDoc(collection(db, `artifacts/${appId}/public/data/experts`), newExpert);
      setNewExpert({ name: '', specialization: '', contact: '', availability: '' });
      toast({ title: "Expert added successfully" });
    } catch (error) {
      console.error("Error adding expert: ", error);
      toast({ title: "Error adding expert", description: "Please try again.", variant: "destructive" });
    }
  };

  const deleteExpert = async (id: string) => {
    try {
      await deleteDoc(doc(db, `artifacts/${appId}/public/data/experts`, id));
      toast({ title: "Expert deleted successfully" });
    } catch (error) {
      console.error("Error deleting expert: ", error);
      toast({ title: "Error deleting expert", description: "Please try again.", variant: "destructive" });
    }
  };

  const startEditExpert = (expert: Expert) => {
    setEditingExpertId(expert.id);
    setEditedExpert(expert);
  };
  
  const updateExpert = async () => {
    if (!editedExpert || !editedExpert.name || !editedExpert.specialization) {
      toast({ title: "Please fill out all required fields", variant: "destructive" });
      return;
    }
    try {
  await updateDoc(doc(db, `artifacts/${appId}/public/data/experts`, editedExpert.id), { ...editedExpert });
      setEditingExpertId(null);
      setEditedExpert(null);
      toast({ title: "Expert updated successfully" });
    } catch (error) {
      console.error("Error updating expert: ", error);
      toast({ title: "Error updating expert", description: "Please try again.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('adminDashboard')}</h1>
          <p className="text-muted-foreground">{t('manageContent')}</p>
          <div className="mt-4 p-3 bg-secondary text-secondary-foreground rounded-md">
            <span className="font-semibold">{t('currentUserId')}:</span> {userId}
          </div>
        </div>

        <Tabs defaultValue="diseases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="diseases">{t('diseaseDatabaseTab')}</TabsTrigger>
            <TabsTrigger value="tips">{t('farmerTipsTab')}</TabsTrigger>
            <TabsTrigger value="experts">{t('expertHelpTab')}</TabsTrigger>
            <TabsTrigger value="users">{t('userManagementTab')}</TabsTrigger>
            <TabsTrigger value="products">{t('productManagementTab')}</TabsTrigger>
            <TabsTrigger value="alerts">{t('weatherAlertsTab')}</TabsTrigger>
          </TabsList>

          {/* Disease Database Tab */}
          <TabsContent value="diseases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('addNewDisease')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disease-name">{t('diseaseName')}</Label>
                    <Input
                      id="disease-name"
                      value={newDisease.name}
                      onChange={(e) => setNewDisease({...newDisease, name: e.target.value})}
                      placeholder={t('enterDiseaseName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="disease-severity">{t('severity')}</Label>
                    <select
                      id="disease-severity"
                      value={newDisease.severity}
                      onChange={(e) => setNewDisease({...newDisease, severity: e.target.value as 'Low' | 'Medium' | 'High'})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Low">{t('severityLow')}</option>
                      <option value="Medium">{t('severityMedium')}</option>
                      <option value="High">{t('severityHigh')}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="disease-description">{t('descriptionLabel')}</Label>
                  <Textarea
                    id="disease-description"
                    value={newDisease.description}
                    onChange={(e) => setNewDisease({...newDisease, description: e.target.value})}
                    placeholder={t('enterDescription')}
                  />
                </div>
                <div>
                  <Label htmlFor="disease-treatment">{t('treatmentLabel')}</Label>
                  <Textarea
                    id="disease-treatment"
                    value={newDisease.treatment}
                    onChange={(e) => setNewDisease({...newDisease, treatment: e.target.value})}
                    placeholder={t('enterTreatment')}
                  />
                </div>
                <Button onClick={addDisease} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addDiseaseButton')}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {diseases.map((disease) => (
                <Card key={disease.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {editingDiseaseId === disease.id ? (
                          <Input 
                            value={editedDisease?.name || ''}
                            onChange={(e) => setEditedDisease({...editedDisease!, name: e.target.value})}
                            className="text-lg font-semibold"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold">{disease.name}</h3>
                        )}
                        <Badge variant={disease.severity === 'High' ? 'destructive' : disease.severity === 'Medium' ? 'default' : 'secondary'}>
                          <span>
                            {editingDiseaseId === disease.id ? (
                              <select
                                value={editedDisease?.severity}
                                onChange={(e) => setEditedDisease({...editedDisease!, severity: e.target.value as 'Low' | 'Medium' | 'High'})}
                                className="bg-transparent text-sm border-none focus:outline-none"
                              >
                                <option value="Low">{t('severityLow')}</option>
                                <option value="Medium">{t('severityMedium')}</option>
                                <option value="High">{t('severityHigh')}</option>
                              </select>
                            ) : (
                              disease.severity
                            )}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {editingDiseaseId === disease.id ? (
                          <Button variant="outline" size="sm" onClick={updateDisease}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => startEditDisease(disease)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => deleteDisease(disease.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingDiseaseId === disease.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editedDisease?.description || ''}
                          onChange={(e) => setEditedDisease({...editedDisease!, description: e.target.value})}
                          className="text-sm text-muted-foreground"
                        />
                        <Textarea
                          value={editedDisease?.treatment || ''}
                          onChange={(e) => setEditedDisease({...editedDisease!, treatment: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground mb-2">{disease.description}</p>
                        <p className="text-sm"><strong>{t('treatment')}:</strong> {disease.treatment}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Farmer Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('addNewTip')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tip-title">{t('titleLabel')}</Label>
                    <Input
                      id="tip-title"
                      value={newTip.title}
                      onChange={(e) => setNewTip({...newTip, title: e.target.value})}
                      placeholder={t('enterTitle')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tip-category">{t('categoryLabel')}</Label>
                    <Input
                      id="tip-category"
                      value={newTip.category}
                      onChange={(e) => setNewTip({...newTip, category: e.target.value})}
                      placeholder={t('enterCategory')}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tip-content">{t('contentLabel')}</Label>
                  <Textarea
                    id="tip-content"
                    value={newTip.content}
                    onChange={(e) => setNewTip({...newTip, content: e.target.value})}
                    placeholder={t('enterContent')}
                    rows={4}
                  />
                </div>
                <Button onClick={addTip} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addTipButton')}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {tips.map((tip) => (
                <Card key={tip.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {editingTipId === tip.id ? (
                          <Input 
                            value={editedTip?.title || ''}
                            onChange={(e) => setEditedTip({...editedTip!, title: e.target.value})}
                            className="text-lg font-semibold"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold">{tip.title}</h3>
                        )}
                        <Badge variant="outline">
                          <span>
                            {editingTipId === tip.id ? (
                              <Input
                                value={editedTip?.category || ''}
                                onChange={(e) => setEditedTip({...editedTip!, category: e.target.value})}
                                className="bg-transparent text-sm border-none focus:outline-none"
                              />
                            ) : (
                              tip.category
                            )}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {editingTipId === tip.id ? (
                          <Button variant="outline" size="sm" onClick={updateTip}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => startEditTip(tip)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => deleteTip(tip.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingTipId === tip.id ? (
                      <Textarea 
                        value={editedTip?.content || ''}
                        onChange={(e) => setEditedTip({...editedTip!, content: e.target.value})}
                        className="text-sm text-muted-foreground"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{tip.content}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expert Help Tab */}
          <TabsContent value="experts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {t('addNewExpert')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expert-name">{t('nameLabel')}</Label>
                    <Input
                      id="expert-name"
                      value={newExpert.name}
                      onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
                      placeholder={t('enterName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expert-specialization">{t('specializationLabel')}</Label>
                    <Input
                      id="expert-specialization"
                      value={newExpert.specialization}
                      onChange={(e) => setNewExpert({...newExpert, specialization: e.target.value})}
                      placeholder={t('enterSpecialization')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expert-contact">{t('contactLabel')}</Label>
                    <Input
                      id="expert-contact"
                      value={newExpert.contact}
                      onChange={(e) => setNewExpert({...newExpert, contact: e.target.value})}
                      placeholder={t('enterContact')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expert-availability">{t('availabilityLabel')}</Label>
                    <Input
                      id="expert-availability"
                      value={newExpert.availability}
                      onChange={(e) => setNewExpert({...newExpert, availability: e.target.value})}
                      placeholder={t('enterAvailability')}
                    />
                  </div>
                </div>
                <Button onClick={addExpert} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addExpertButton')}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {experts.map((expert) => (
                <Card key={expert.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {editingExpertId === expert.id ? (
                          <Input 
                            value={editedExpert?.name || ''}
                            onChange={(e) => setEditedExpert({...editedExpert!, name: e.target.value})}
                            className="text-lg font-semibold"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold">{expert.name}</h3>
                        )}
                        <Badge variant="secondary">
                          <span>
                            {editingExpertId === expert.id ? (
                              <Input
                                value={editedExpert?.specialization || ''}
                                onChange={(e) => setEditedExpert({...editedExpert!, specialization: e.target.value})}
                                className="bg-transparent text-sm border-none focus:outline-none"
                              />
                            ) : (
                              expert.specialization
                            )}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {editingExpertId === expert.id ? (
                          <Button variant="outline" size="sm" onClick={updateExpert}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => startEditExpert(expert)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => deleteExpert(expert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingExpertId === expert.id ? (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <Input 
                          value={editedExpert?.contact || ''}
                          onChange={(e) => setEditedExpert({...editedExpert!, contact: e.target.value})}
                          placeholder={t('contactLabel')}
                        />
                        <Input
                          value={editedExpert?.availability || ''}
                          onChange={(e) => setEditedExpert({...editedExpert!, availability: e.target.value})}
                          placeholder={t('availabilityLabel')}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>{t('contactLabel')}:</strong> {expert.contact}</p>
                        <p><strong>{t('availabilityLabel')}:</strong> {expert.availability}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

          </TabsContent>
          <TabsContent value="users" className="space-y-6">
            <UserRoleManager />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManager />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <WeatherAlertManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
