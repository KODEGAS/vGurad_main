import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Scan, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollAnimatedSection } from '../ScrollAnimatedSection';
import { getCurrentUserId } from '@/lib/getCurrentUserId';

interface DetectionResult {
  id: string;
  disease_name?: string;
  crop_type?: string;
  confidence?: number;
  symptoms?: string[];
  treatment_suggestions?: string[];
  image_url?: string;
  detected_at: string;
}

interface TreatmentSchedule {
  id: string;
  treatment_name: string;
  schedule_date: string;
  status: string;
  dosage?: string;
  notes?: string;
  photo_url?: string;
  created_at: string;
}

export const SavedResults = () => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [schedules, setSchedules] = useState<TreatmentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'detections' | 'schedules'>('detections');
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);
  
 const userId = getCurrentUserId();

  const fetchResults = async () => {
    try {
      if (!userId) throw new Error('User not logged in');

      // Fetch disease detections from backend
      const detectionsRes = await fetch(`http://localhost:5001/api/detection-results?user_id=${userId}`);
      if (!detectionsRes.ok) throw new Error('Failed to fetch detection results');
      const detectionsData = await detectionsRes.json();

      setDetections(detectionsData || []);
      setSchedules([]); 
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: "Error",
        description: "Failed to load your saved results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 text-gray-800';
    if (confidence >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredDetections = detections.filter(detection =>
    detection.disease_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detection.crop_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchedules = schedules.filter(schedule =>
    schedule.treatment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Saved Results</h3>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'detections' ? 'default' : 'outline'}
            onClick={() => setActiveTab('detections')}
            size="sm"
          >
            <Scan className="w-4 h-4 mr-2" />
            Disease Scans
          </Button>
          <Button
            variant={activeTab === 'schedules' ? 'default' : 'outline'}
            onClick={() => setActiveTab('schedules')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Treatments
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={`Search ${activeTab === 'detections' ? 'disease detections' : 'treatment schedules'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {activeTab === 'detections' && (
        <div className="grid gap-4">
          {filteredDetections.map((detection, index) => (
            <ScrollAnimatedSection 
              key={detection.id} 
              animationType="fade-up" 
              delay={index * 100}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {detection.image_url && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={detection.image_url} 
                          alt="Detection result"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">
                          {detection.disease_name || 'Unknown Disease'}
                        </h4>
                        {detection.confidence && (
                          <Badge className={getConfidenceColor(detection.confidence)}>
                            {detection.confidence.toFixed(1)}% confidence
                          </Badge>
                        )}
                      </div>
                      
                      {detection.crop_type && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Crop:</strong> {detection.crop_type}
                        </p>
                      )}
                      
                      {detection.symptoms && detection.symptoms.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Symptoms:</p>
                          <div className="flex flex-wrap gap-1">
                            {detection.symptoms.slice(0, 3).map((symptom, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                            {detection.symptoms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{detection.symptoms.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {detection.treatment_suggestions && detection.treatment_suggestions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Treatment Suggestions:</p>
                          <ul className="text-sm text-muted-foreground">
                            {detection.treatment_suggestions.slice(0, 2).map((treatment, idx) => (
                              <li key={idx} className="list-disc list-inside">
                                {treatment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Detected: {new Date(detection.detected_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          ))}
          
          {filteredDetections.length === 0 && (
            <ScrollAnimatedSection animationType="fade-up">
              <Card>
                <CardContent className="p-8 text-center">
                  <Scan className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No detection results found matching your search.' : 'No disease detection results yet. Start scanning your crops to see results here!'}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          )}
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="grid gap-4">
          {filteredSchedules.map((schedule, index) => (
            <ScrollAnimatedSection 
              key={schedule.id} 
              animationType="fade-up" 
              delay={index * 100}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {schedule.photo_url && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={schedule.photo_url} 
                          alt="Treatment photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{schedule.treatment_name}</h4>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <p><strong>Scheduled Date:</strong> {new Date(schedule.schedule_date).toLocaleDateString()}</p>
                        {schedule.dosage && (
                          <p><strong>Dosage:</strong> {schedule.dosage}</p>
                        )}
                      </div>
                      
                      {schedule.notes && (
                        <p className="text-sm text-muted-foreground mb-3">
                          <strong>Notes:</strong> {schedule.notes}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(schedule.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          ))}
          
          {filteredSchedules.length === 0 && (
            <ScrollAnimatedSection animationType="fade-up">
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No treatment schedules found matching your search.' : 'No treatment schedules yet. Create your first treatment plan to see it here!'}
                  </p>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          )}
        </div>
      )}
    </div>
  );
};