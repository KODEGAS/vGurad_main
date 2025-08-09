import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Cloud, Thermometer, Droplets, Sun, Moon } from 'lucide-react';
import { ScrollAnimatedSection } from '@/components/ScrollAnimatedSection';
import { LucideIcon } from 'lucide-react';

interface FarmerTipsProps {
  onBack: () => void;
}

interface Tip {
  _id: string;
  title: string;
  category: string;
  season: string;
  icon: string; 
  content: string[];
  timing: string;
}

const weatherAlerts = [
  {
    type: 'warning',
    title: 'Heavy Rain Expected',
    message: 'Prepare drainage and avoid fertilizer application for next 3 days',
    icon: Cloud
  },
  {
    type: 'info',
    title: 'Optimal Planting Weather',
    message: 'Current conditions are ideal for planting rice and vegetables',
    icon: Sun
  }
];

const iconMap: { [key: string]: LucideIcon } = {
  Cloud,
  Sun,
  Droplets,
  Moon,
  Thermometer,
  Calendar
};

export const FarmerTips: React.FC<FarmerTipsProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get<Tip[]>('http://localhost:5000/api/tips');
        setTips(response.data);
      } catch (err) {
        setError('Failed to fetch tips. Please check the backend server.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  const categories = ['all', 'Seasonal', 'Weather', 'Pest Management', 'Harvest', 'Soil Care'];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center text-gray-500">Loading farmer tips...</div>;
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
          <h2 className="text-2xl font-bold text-foreground">Farmer Tips & Advice</h2>
        </div>

      {/* Weather Alerts (remains static) */}
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning-foreground">
              <Cloud className="h-5 w-5" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <alert.icon className="h-5 w-5 mt-1 text-warning" />
                <div>
                  <h4 className="font-medium text-foreground">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      {/* Category Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "farmer" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Tips' : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Tips Grid */}
      <ScrollAnimatedSection animationType="fade-up" delay={600}>
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTips.map((tip, index) => {
            const IconComponent = iconMap[tip.icon] || Calendar; 
            return (
              <ScrollAnimatedSection 
                key={tip._id}
                animationType="scale-in" 
                delay={800 + (index * 150)}
              >
                <Card className="hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-crop-secondary to-accent p-2 rounded-lg">
                          <IconComponent className="h-6 w-6 text-crop-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {tip.timing}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-crop-primary border-crop-primary">
                        {tip.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gradient-earth p-3 rounded-lg">
                        <h4 className="font-medium mb-2 text-foreground">Season: {tip.season}</h4>
                      </div>
                      
                      <ul className="space-y-2">
                        {tip.content.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-2 h-2 bg-crop-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Save to My Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimatedSection>
            );
          })}
        </div>
      </ScrollAnimatedSection>

      {filteredTips.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No tips found for the selected category.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
};
