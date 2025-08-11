import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Camera, Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollAnimatedSection } from './ScrollAnimatedSection';
import { useToast } from '@/hooks/use-toast';

interface TreatmentEvent {
  id: string;
  treatment_name: string;
  schedule_date: string;
  dosage: string;
  status: 'pending' | 'completed' | 'missed';
  notes?: string;
  photo_url?: string;
}

export const TreatmentCalendar = () => {
  const [treatments, setTreatments] = useState<TreatmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/treatments');
      if (!response.ok) throw new Error('Failed to fetch treatments');
      const data = await response.json();
      setTreatments((data || []) as TreatmentEvent[]);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      toast({
        title: "Error",
        description: "Failed to load treatment calendar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (treatmentId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/treatments/${treatmentId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update treatment');
      setTreatments(prev => 
        prev.map(t => t.id === treatmentId ? { ...t, status: 'completed' } : t)
      );
      toast({
        title: "Success",
        description: "Treatment marked as completed",
      });
    } catch (error) {
      console.error('Error updating treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'missed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'missed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4">
      <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold text-primary mb-2">Treatment Calendar</h1>
            <p className="text-muted-foreground">Track your crop treatment schedule</p>
          </div>

          <div className="grid gap-4 md:gap-6">
            {treatments.map((treatment, index) => (
              <ScrollAnimatedSection 
                key={treatment.id} 
                animationType="fade-up"
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(treatment.status)}`} />
                        <div>
                          <CardTitle className="text-lg">{treatment.treatment_name}</CardTitle>
                          <CardDescription>
                            {new Date(treatment.schedule_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getStatusIcon(treatment.status)}
                        {treatment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm text-muted-foreground">Dosage:</span>
                        <p className="text-sm">{treatment.dosage}</p>
                      </div>
                      
                      {treatment.notes && (
                        <div>
                          <span className="font-medium text-sm text-muted-foreground">Notes:</span>
                          <p className="text-sm">{treatment.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        {treatment.status === 'pending' && (
                          <Button 
                            onClick={() => markAsCompleted(treatment.id)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Add Photo
                        </Button>
                        
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimatedSection>
            ))}
            
            {treatments.length === 0 && (
              <ScrollAnimatedSection animationType="fade-up">{/* ... keep existing code */}
                <Card className="text-center p-8">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No treatments scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    Treatments will appear here when you detect crop diseases
                  </p>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() =>
                      toast({
                        title: 'Pro Feature',
                        description: 'Adding treatments is available for Pro users only.',
                        variant: 'default',
                      })
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Add Treatment
                  </Button>
                </Card>
              </ScrollAnimatedSection>
            )}
          </div>
        </div>
      </ScrollAnimatedSection>
    </div>
  );
};