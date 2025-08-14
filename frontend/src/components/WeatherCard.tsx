import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, TrendingUp, Shield, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const App = () => {
  return (
    <div className="container mx-auto p-4 font-sans">
      <WeatherCard />
    </div>
  );
};

export const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = '97f8981d34014c2f2fb3662f82222576';
  const units = 'metric'; 

  useEffect(() => {
    // Check if the API key is set
    if (!apiKey) {
      setLoading(false);
      return;
    }

    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const fetchWeatherByLocation = async (latitude: number, longitude: number) => {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Could not fetch weather data.');
        }
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching weather data:', err);
        setError(err.message);
        toast.error('Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch weather for Colombo if user denies location
    const fetchColomboWeather = async () => {
      // Colombo coordinates: 6.9271° N, 79.8612° E
      await fetchWeatherByLocation(6.9271, 79.8612);
    };

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      (geoError) => {
        console.error('Geolocation Error:', geoError);
        toast.error('Location access denied. Showing weather for Colombo.');
        fetchColomboWeather();
      }
    );
  }, [apiKey, units]);

  // To determine farming conditions based on weather
  const getFarmingConditions = (data: any) => {
    if (!data) return { status: 'Unknown', color: 'gray' };
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    
    if (temp > 25 && temp < 35 && humidity > 40 && humidity < 70) {
      return { status: 'Optimal', color: 'bg-success/20 text-success border-success/30' };
    } else if (temp < 15 || temp > 40) {
      return { status: 'Warning', color: 'bg-warning/20 text-warning-foreground border-warning/30' };
    } else {
      return { status: 'Moderate', color: 'bg-primary/20 text-primary border-primary/30' };
    }
  };

  const conditions = getFarmingConditions(weatherData);

  // Display a loading state while fetching the data
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-48">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="ml-4">Getting your location and weather data...</p>
      </div>
    );
  }

  // Display an error state if fetching failed
  if (error) {
    return (
      <Card className="bg-red-50 dark:bg-red-950 border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Display the weather data
  return (
    <Card className="bg-gradient-to-r from-crop-secondary to-accent/50 hover-glow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground animate-slide-in-left">
            <MapPin className="inline-block h-5 w-5 mr-2 text-primary" />
            Today's Farming Conditions ({weatherData?.name})
          </h3>
          <Badge className={`animate-pulse-glow ${conditions.color}`}>
            {conditions.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Temperature */}
          <div className="flex flex-col items-center animate-stagger-1 hover-scale">
            <Sun className="h-8 w-8 text-warning mb-2 animate-float" />
            <div className="text-sm font-medium">{weatherData?.main.temp.toFixed(0)}°C</div>
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>
          
          {/* Humidity */}
          <div className="flex flex-col items-center animate-stagger-2 hover-scale">
            <Cloud className="h-8 w-8 text-primary mb-2 animate-float" style={{animationDelay: '0.5s'}} />
            <div className="text-sm font-medium">{weatherData?.main.humidity}%</div>
            <div className="text-xs text-muted-foreground">Humidity</div>
          </div>
          
          {/* Wind Speed */}
          <div className="flex flex-col items-center animate-stagger-3 hover-scale">
            <TrendingUp className="h-8 w-8 text-success mb-2 animate-float" style={{animationDelay: '1s'}} />
            <div className="text-sm font-medium">{weatherData?.wind.speed.toFixed(1)} m/s</div>
            <div className="text-xs text-muted-foreground">Wind Speed</div>
          </div>
          
          {/* General Condition */}
          <div className="flex flex-col items-center animate-stagger-4 hover-scale">
            <Shield className="h-8 w-8 text-crop-primary mb-2 animate-float" style={{animationDelay: '1.5s'}} />
            <div className="text-sm font-medium">{weatherData?.weather[0].main}</div>
            <div className="text-xs text-muted-foreground">Condition</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default App;
