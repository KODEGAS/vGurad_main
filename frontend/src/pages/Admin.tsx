import React, { useState } from 'react';
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

const Admin = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { toast } = useToast();

  // Disease Database State
  const [diseases, setDiseases] = useState([
    { id: 1, name: 'Tomato Blight', description: 'A fungal disease affecting tomato plants', treatment: 'Apply copper fungicide', severity: 'High' },
    { id: 2, name: 'Wheat Rust', description: 'A rust disease affecting wheat crops', treatment: 'Use resistant varieties', severity: 'Medium' },
  ]);

  // Farmer Tips State
  const [tips, setTips] = useState([
    { id: 1, title: 'Seasonal Planting Guide', content: 'Best practices for seasonal crop rotation', category: 'Planting' },
    { id: 2, title: 'Water Management', content: 'Efficient irrigation techniques', category: 'Irrigation' },
  ]);

  // Expert Help State
  const [experts, setExperts] = useState([
    { id: 1, name: 'Dr. John Smith', specialization: 'Plant Pathology', contact: 'john@example.com', availability: 'Mon-Fri 9AM-5PM' },
    { id: 2, name: 'Dr. Sarah Wilson', specialization: 'Crop Management', contact: 'sarah@example.com', availability: '24/7' },
  ]);

  const [newDisease, setNewDisease] = useState({ name: '', description: '', treatment: '', severity: 'Low' });
  const [newTip, setNewTip] = useState({ title: '', content: '', category: '' });
  const [newExpert, setNewExpert] = useState({ name: '', specialization: '', contact: '', availability: '' });

  const addDisease = () => {
    if (newDisease.name && newDisease.description) {
      setDiseases([...diseases, { ...newDisease, id: Date.now() }]);
      setNewDisease({ name: '', description: '', treatment: '', severity: 'Low' });
      toast({ title: "Disease added successfully" });
    }
  };

  const addTip = () => {
    if (newTip.title && newTip.content) {
      setTips([...tips, { ...newTip, id: Date.now() }]);
      setNewTip({ title: '', content: '', category: '' });
      toast({ title: "Tip added successfully" });
    }
  };

  const addExpert = () => {
    if (newExpert.name && newExpert.specialization) {
      setExperts([...experts, { ...newExpert, id: Date.now() }]);
      setNewExpert({ name: '', specialization: '', contact: '', availability: '' });
      toast({ title: "Expert added successfully" });
    }
  };

  const deleteDisease = (id: number) => {
    setDiseases(diseases.filter(d => d.id !== id));
    toast({ title: "Disease deleted successfully" });
  };

  const deleteTip = (id: number) => {
    setTips(tips.filter(t => t.id !== id));
    toast({ title: "Tip deleted successfully" });
  };

  const deleteExpert = (id: number) => {
    setExperts(experts.filter(e => e.id !== id));
    toast({ title: "Expert deleted successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
  <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage disease database, farmer tips, and expert help content</p>
        </div>

        <Tabs defaultValue="diseases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseases">Disease Database</TabsTrigger>
            <TabsTrigger value="tips">Farmer Tips</TabsTrigger>
            <TabsTrigger value="experts">Expert Help</TabsTrigger>
          </TabsList>

          {/* Disease Database Tab */}
          <TabsContent value="diseases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Disease
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disease-name">Disease Name</Label>
                    <Input
                      id="disease-name"
                      value={newDisease.name}
                      onChange={(e) => setNewDisease({...newDisease, name: e.target.value})}
                      placeholder="Enter disease name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="disease-severity">Severity</Label>
                    <select
                      id="disease-severity"
                      value={newDisease.severity}
                      onChange={(e) => setNewDisease({...newDisease, severity: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="disease-description">Description</Label>
                  <Textarea
                    id="disease-description"
                    value={newDisease.description}
                    onChange={(e) => setNewDisease({...newDisease, description: e.target.value})}
                    placeholder="Enter disease description"
                  />
                </div>
                <div>
                  <Label htmlFor="disease-treatment">Treatment</Label>
                  <Textarea
                    id="disease-treatment"
                    value={newDisease.treatment}
                    onChange={(e) => setNewDisease({...newDisease, treatment: e.target.value})}
                    placeholder="Enter treatment recommendations"
                  />
                </div>
                <Button onClick={addDisease} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Disease
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {diseases.map((disease) => (
                <Card key={disease.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{disease.name}</h3>
                        <Badge variant={disease.severity === 'High' ? 'destructive' : disease.severity === 'Medium' ? 'default' : 'secondary'}>
                          {disease.severity}
                        </Badge>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteDisease(disease.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{disease.description}</p>
                    <p className="text-sm"><strong>Treatment:</strong> {disease.treatment}</p>
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
                  Add New Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tip-title">Title</Label>
                    <Input
                      id="tip-title"
                      value={newTip.title}
                      onChange={(e) => setNewTip({...newTip, title: e.target.value})}
                      placeholder="Enter tip title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tip-category">Category</Label>
                    <Input
                      id="tip-category"
                      value={newTip.category}
                      onChange={(e) => setNewTip({...newTip, category: e.target.value})}
                      placeholder="Enter category"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tip-content">Content</Label>
                  <Textarea
                    id="tip-content"
                    value={newTip.content}
                    onChange={(e) => setNewTip({...newTip, content: e.target.value})}
                    placeholder="Enter tip content"
                    rows={4}
                  />
                </div>
                <Button onClick={addTip} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tip
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {tips.map((tip) => (
                <Card key={tip.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <Badge variant="outline">{tip.category}</Badge>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteTip(tip.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
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
                  Add New Expert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expert-name">Name</Label>
                    <Input
                      id="expert-name"
                      value={newExpert.name}
                      onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
                      placeholder="Enter expert name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expert-specialization">Specialization</Label>
                    <Input
                      id="expert-specialization"
                      value={newExpert.specialization}
                      onChange={(e) => setNewExpert({...newExpert, specialization: e.target.value})}
                      placeholder="Enter specialization"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expert-contact">Contact</Label>
                    <Input
                      id="expert-contact"
                      value={newExpert.contact}
                      onChange={(e) => setNewExpert({...newExpert, contact: e.target.value})}
                      placeholder="Enter contact information"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expert-availability">Availability</Label>
                    <Input
                      id="expert-availability"
                      value={newExpert.availability}
                      onChange={(e) => setNewExpert({...newExpert, availability: e.target.value})}
                      placeholder="Enter availability hours"
                    />
                  </div>
                </div>
                <Button onClick={addExpert} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expert
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {experts.map((expert) => (
                <Card key={expert.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{expert.name}</h3>
                        <Badge variant="secondary">{expert.specialization}</Badge>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteExpert(expert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Contact:</strong> {expert.contact}</p>
                      <p><strong>Availability:</strong> {expert.availability}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;