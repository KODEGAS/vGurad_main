import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Cloud, AlertTriangle, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherAlert {
  _id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const alertTypes = [
  { value: 'weather', label: 'Weather Warning' },
  { value: 'disease', label: 'Disease Alert' },
  { value: 'pest', label: 'Pest Warning' },
  { value: 'general', label: 'General Advisory' },
];

const severityLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

export const WeatherAlertManager = () => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    alert_type: '',
    severity: 'medium',
    location: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/weather-alerts');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch weather alerts');
      }

      setAlerts(result.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load weather alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async () => {
    try {
      if (!newAlert.title || !newAlert.description || !newAlert.alert_type) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const alertData = {
        title: newAlert.title,
        description: newAlert.description,
        alert_type: newAlert.alert_type,
        severity: newAlert.severity,
        location: newAlert.location || undefined,
        start_date: newAlert.start_date || new Date().toISOString(),
        end_date: newAlert.end_date || undefined,
      };

      const response = await fetch('http://localhost:5001/api/weather-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create weather alert');
      }

      setAlerts([result.data, ...alerts]);
      setNewAlert({
        title: '',
        description: '',
        alert_type: '',
        severity: 'medium',
        location: '',
        start_date: '',
        end_date: '',
      });
      setShowAddForm(false);

      toast({
        title: "Success",
        description: "Weather alert created successfully",
      });
    } catch (error) {
      console.error('Error adding alert:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create weather alert",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (alertId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5001/api/weather-alerts/${alertId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update alert status');
      }

      setAlerts(alerts.map(alert =>
        alert._id === alertId
          ? { ...alert, is_active: !currentStatus }
          : alert
      ));

      toast({
        title: "Success",
        description: `Alert ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating alert status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update alert status",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/weather-alerts/${alertId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete alert');
      }

      setAlerts(alerts.filter(alert => alert._id !== alertId));
      toast({
        title: "Success",
        description: "Alert deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete alert",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    return severityLevels.find(level => level.value === severity)?.color || 'bg-gray-100 text-gray-800';
  };

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
        <h2 className="text-2xl font-bold">Weather Alert Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Weather Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  placeholder="Enter alert title"
                />
              </div>
              <div>
                <Label htmlFor="alert-type">Alert Type *</Label>
                <Select
                  value={newAlert.alert_type}
                  onValueChange={(value) => setNewAlert({ ...newAlert, alert_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={newAlert.severity}
                  onValueChange={(value) => setNewAlert({ ...newAlert, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newAlert.location}
                  onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                  placeholder="Enter location (optional)"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={newAlert.start_date}
                  onChange={(e) => setNewAlert({ ...newAlert, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={newAlert.end_date}
                  onChange={(e) => setNewAlert({ ...newAlert, end_date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                placeholder="Enter alert description"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addAlert}>Create Alert</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline">
                      {alertTypes.find(t => t.value === alert.alert_type)?.label}
                    </Badge>
                    {alert.location && (
                      <Badge variant="secondary">{alert.location}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <p><strong>Start:</strong> {new Date(alert.start_date).toLocaleString()}</p>
                    {alert.end_date && (
                      <p><strong>End:</strong> {new Date(alert.end_date).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.is_active}
                    onCheckedChange={() => toggleAlert(alert._id, alert.is_active)}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAlert(alert._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No weather alerts found. Create your first alert to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};