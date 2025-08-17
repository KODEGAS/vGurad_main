import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Leaf, Bug, Shield, ChevronDown } from 'lucide-react';
import { ScrollAnimatedSection } from '@/components/ScrollAnimatedSection';
import { useTranslation } from '@/contexts/TranslationContext';
import { LoadingDots } from './LoadingDots';
import { LoadingSpinner } from './LoadingSpinner';
import { auth } from '../firebase';
import { useToast } from '@/hooks/use-toast';

interface Disease {
  _id: string;
  name: string;
  crop: string;
  symptoms: string[];
  cause: string;
  treatment: string;
  prevention: string;
  severity: 'High' | 'Medium' | 'Low';
  image_url?: string;
}

interface DiseaseDatabaseProps {
  onBack: () => void;
}

export const DiseaseDatabase: React.FC<DiseaseDatabaseProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(true);

  // Hide scroll indicator when user starts scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get<Disease[]>('https://vgurad-backend.onrender.com/api/diseases');
        setDiseases(response.data);
      } catch (err) {
        setError('Failed to fetch disease data. Please check the backend server.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const saveToNotes = async (disease: Disease) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save notes",
          variant: "destructive",
        });
        return;
      }

      setSavingNote(true);

      // Create note content
      const noteContent = `Disease: ${disease.name}
Crop: ${disease.crop}
Severity: ${disease.severity}
Cause: ${disease.cause}

Symptoms:
${disease.symptoms.map(symptom => `• ${symptom}`).join('\n')}

Treatment:
${disease.treatment}

Prevention:
${disease.prevention}`;

      // Create note object
      const noteToSave = {
        _id: Date.now().toString(), // Simple ID generation
        user_id: user.uid,
        title: `Disease Info: ${disease.name}`,
        content: noteContent,
        created_at: new Date().toISOString(),
      };

      // Get existing notes from local storage
      const savedNotesKey = `savedNotes_${user.uid}`;
      const existingNotes = localStorage.getItem(savedNotesKey);
      let notes = existingNotes ? JSON.parse(existingNotes) : [];

      // Add new note
      notes.push(noteToSave);

      // Save back to local storage
      localStorage.setItem(savedNotesKey, JSON.stringify(notes));

      toast({
        title: "Success",
        description: "Disease information saved to your notes",
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center flex flex-col items-center justify-center gap-2">
      </div>
    );
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-red-500">{error}</div>;
  }

  if (selectedDisease) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setSelectedDisease(null)} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToList')}
          </Button>
          <h2 className="text-2xl font-bold text-foreground">{selectedDisease.name}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                {t('diseaseInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Disease Image */}
              {selectedDisease.image_url && (
                <div className="mb-4">
                  <img 
                    src={selectedDisease.image_url} 
                    alt={selectedDisease.name}
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">{t('affectedCrop')}:</h4>
                <p className="text-crop-primary font-medium">{selectedDisease.crop}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('severity')}:</h4>
                <span className={`font-medium ${getSeverityColor(selectedDisease.severity)}`}>
                  {selectedDisease.severity}
                </span>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('cause')}:</h4>
                <p className="text-muted-foreground">{selectedDisease.cause}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t('symptoms')}:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDisease.symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="text-muted-foreground">{symptom}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('treatmentPrevention')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold mb-2 text-success">{t('treatment')}:</h4>
                <p className="text-muted-foreground">{selectedDisease.treatment}</p>
              </div>

              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                <h4 className="font-semibold mb-2 text-warning-foreground">{t('prevention')}:</h4>
                <p className="text-muted-foreground">{selectedDisease.prevention}</p>
              </div>

              <Button 
                variant="farmer" 
                className="w-full"
                onClick={() => saveToNotes(selectedDisease)}
                disabled={savingNote}
              >
                {savingNote ? 'Saving...' : t('saveToNotes')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <h2 className="text-2xl font-bold text-foreground">{t('diseaseDatabase')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('searchDiseases')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={t('searchByCrop')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </CardContent>
      </Card>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-1/4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 animate-bounce">
            <ChevronDown className="h-6 w-6 text-gray-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              Scroll to see diseases
            </span>
          </div>
        </div>
      )}

      <ScrollAnimatedSection animationType="fade-up" delay={400}>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDiseases.map((disease, index) => (
            <ScrollAnimatedSection
              key={disease._id}
              animationType="scale-in"
              delay={600 + index * 100}
            >
              <Card className="hover:shadow-card transition-all duration-300 cursor-pointer" onClick={() => setSelectedDisease(disease)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-foreground">{disease.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(disease.severity)} bg-opacity-10`}>
                      {disease.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-4 w-4 text-crop-primary" />
                    <span className="text-sm text-crop-primary font-medium">{disease.crop}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {disease.symptoms.slice(0, 2).join(', ')}
                    {disease.symptoms.length > 2 && '...'}
                  </p>

                  <Button variant="outline" size="sm" className="w-full">
                    {t('viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          ))}
        </div>
      </ScrollAnimatedSection>

      {filteredDiseases.length === 0 && (
        <ScrollAnimatedSection animationType="fade-up" delay={400}>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{t('noDiseasesFound')}</p>
            </CardContent>
          </Card>
        </ScrollAnimatedSection>
      )}
    </div>
  );
};
