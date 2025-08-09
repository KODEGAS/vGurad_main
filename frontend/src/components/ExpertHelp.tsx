import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Phone, MessageCircle, Camera, Send, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollAnimatedSection } from '@/components/ScrollAnimatedSection';

interface ExpertHelpProps {
  onBack: () => void;
  onNavigateToChat?: (question: string) => void;
}

interface Expert {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  languages: string[];
  rating: number;
  phone: string;
  available: boolean;
}

interface Question {
  _id: string;
  question: string;
  expert: string;
  status: 'pending' | 'answered';
  date: string;
}

export const ExpertHelp: React.FC<ExpertHelpProps> = ({ onBack, onNavigateToChat }) => {
  const [selectedTab, setSelectedTab] = useState<'experts' | 'ask' | 'history'>('experts');
  const [question, setQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [experts, setExperts] = useState<Expert[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertsRes, questionsRes] = await Promise.all([
          axios.get<Expert[]>('http://localhost:5000/api/experts'),
          axios.get<Question[]>('http://localhost:5000/api/questions'),
        ]);
        setExperts(expertsRes.data);
        setRecentQuestions(questionsRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please check the backend server.');
        console.error('Error fetching expert help data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/questions', {
        question,
        expert: 'Not yet assigned', 
      });
      toast.success('Question submitted successfully! You will receive a response within 24 hours.');
      setQuestion('');
      setSelectedImage(null);

      const questionsRes = await axios.get<Question[]>('http://localhost:5000/api/questions');
      setRecentQuestions(questionsRes.data);
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question. Please try again.');
    }
  };

  const handleCallExpert = (phone: string) => {
    toast.success(`Calling ${phone}...`);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">Loading expert data...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Expert Help</h2>
        </div>

      {/* Tab Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={selectedTab === 'experts' ? 'farmer' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('experts')}
              >
                <User className="h-4 w-4 mr-2" />
                Experts
              </Button>
              <Button
                variant={selectedTab === 'ask' ? 'farmer' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('ask')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
              <Button
                variant={selectedTab === 'history' ? 'farmer' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('history')}
              >
                <Clock className="h-4 w-4 mr-2" />
                My Questions
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Experts Tab */}
      {selectedTab === 'experts' && (
        <ScrollAnimatedSection animationType="fade-up" delay={400}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Agricultural Experts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {experts.map((expert, index) => (
                <ScrollAnimatedSection 
                  key={expert._id} 
                  animationType="scale-in" 
                  delay={600 + (index * 150)}
                >
                  <Card className="hover:shadow-card transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{expert.name}</h4>
                          <p className="text-sm text-crop-primary">{expert.specialty}</p>
                          <p className="text-xs text-muted-foreground">{expert.experience} experience</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{expert.rating}</span>
                          <span className="text-warning">★</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Languages:</p>
                        <div className="flex flex-wrap gap-1">
                          {expert.languages.map((lang, index) => (
                            <span key={index} className="text-xs bg-crop-secondary text-crop-primary px-2 py-1 rounded">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={expert.available ? 'scan' : 'outline'}
                          size="sm"
                          disabled={!expert.available}
                          onClick={() => handleCallExpert(expert.phone)}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {expert.available ? 'Call Now' : 'Unavailable'}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>
              ))}
            </div>
          </div>
        </ScrollAnimatedSection>
      )}

      {/* Ask Question Tab */}
      {selectedTab === 'ask' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Question</label>
                  <Textarea
                    placeholder="Describe your crop problem in detail..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Attach Photo (Optional)</label>
                  {selectedImage ? (
                    <div className="space-y-2">
                      <img
                        src={selectedImage}
                        alt="Selected crop issue"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button onClick={() => setSelectedImage(null)} variant="outline" size="sm">
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent">
                        <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload photo</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <Button onClick={handleSubmitQuestion} variant="farmer" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Question
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <ScrollAnimatedSection animationType="fade-up" delay={400}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Previous Questions</h3>
            <div className="space-y-4">
              {recentQuestions.map((item, index) => (
                <ScrollAnimatedSection 
                  key={item._id} 
                  animationType="slide-left" 
                  delay={600 + (index * 200)}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">{item.question}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Expert: {item.expert}</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'answered' 
                              ? 'bg-success/20 text-success' 
                              : 'bg-warning/20 text-warning-foreground'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimatedSection>
              ))}
            </div>
          </div>
        </ScrollAnimatedSection>
      )}
    </div>
  );
};
