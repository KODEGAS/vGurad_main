import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  ArrowLeft,
  Wheat
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RicePrice {
  id: string;
  variety: string;
  price: number;
  previousPrice: number;
  location: string;
  quality: string;
  unit: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const MarketPrices: React.FC = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<RicePrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<RicePrice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');

  // Mock data for rice prices
  useEffect(() => {
    const mockPrices: RicePrice[] = [
      {
        id: '1',
        variety: 'Basmati',
        price: 280,
        previousPrice: 275,
        location: 'Colombo',
        quality: 'Premium',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'up'
      },
      {
        id: '2',
        variety: 'Samba',
        price: 180,
        previousPrice: 185,
        location: 'Kandy',
        quality: 'Grade A',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'down'
      },
      {
        id: '3',
        variety: 'Nadu',
        price: 150,
        previousPrice: 150,
        location: 'Galle',
        quality: 'Grade B',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'stable'
      },
      {
        id: '4',
        variety: 'Red Rice',
        price: 320,
        previousPrice: 310,
        location: 'Anuradhapura',
        quality: 'Organic',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'up'
      },
      {
        id: '5',
        variety: 'Kiriyal',
        price: 200,
        previousPrice: 205,
        location: 'Ratnapura',
        quality: 'Grade A',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'down'
      },
      {
        id: '6',
        variety: 'Devadagiri',
        price: 240,
        previousPrice: 240,
        location: 'Kurunegala',
        quality: 'Premium',
        unit: 'kg',
        lastUpdated: '2024-01-15',
        trend: 'stable'
      }
    ];
    setPrices(mockPrices);
    setFilteredPrices(mockPrices);
  }, []);

  // Filter prices based on search and filters
  useEffect(() => {
    let filtered = prices.filter(price => {
      const matchesSearch = price.variety.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || price.location === selectedLocation;
      const matchesQuality = selectedQuality === 'all' || price.quality === selectedQuality;
      
      return matchesSearch && matchesLocation && matchesQuality;
    });
    
    setFilteredPrices(filtered);
  }, [prices, searchTerm, selectedLocation, selectedQuality]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 bg-muted-foreground rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(1);
    return {
      amount: Math.abs(change),
      percentage: Math.abs(parseFloat(percentage)),
      isPositive: change > 0
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-crop-primary text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToHome')}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Wheat className="h-8 w-8" />
            <h1 className="text-3xl font-bold">{t('riceMarketPrices')}</h1>
          </div>
          <p className="text-white/80">{t('realTimePrices')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchRiceVariety')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allLocations')}</SelectItem>
                  <SelectItem value="Colombo">Colombo</SelectItem>
                  <SelectItem value="Kandy">Kandy</SelectItem>
                  <SelectItem value="Galle">Galle</SelectItem>
                  <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                  <SelectItem value="Ratnapura">Ratnapura</SelectItem>
                  <SelectItem value="Kurunegala">Kurunegala</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('selectQuality')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allQualities')}</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Grade A">Grade A</SelectItem>
                  <SelectItem value="Grade B">Grade B</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Market Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">6</div>
              <div className="text-sm text-muted-foreground">{t('riceVarieties')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">LKR 228</div>
              <div className="text-sm text-muted-foreground">{t('averagePrice')}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning-foreground mb-1">6</div>
              <div className="text-sm text-muted-foreground">{t('markets')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((rice) => {
            const priceChange = getPriceChange(rice.price, rice.previousPrice);
            
            return (
              <Card key={rice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{rice.variety}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{rice.location}</span>
                      </div>
                    </div>
                    <Badge variant={rice.quality === 'Premium' || rice.quality === 'Organic' ? 'default' : 'secondary'}>
                      {rice.quality}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">
                          LKR {rice.price}
                          <span className="text-sm font-normal text-muted-foreground">/{rice.unit}</span>
                        </div>
                        {priceChange.amount > 0 && (
                          <div className={`text-sm flex items-center gap-1 ${getTrendColor(rice.trend)}`}>
                            {getTrendIcon(rice.trend)}
                            <span>
                              {rice.trend === 'up' ? '+' : rice.trend === 'down' ? '-' : ''}
                              LKR {priceChange.amount} ({priceChange.percentage}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{t('updated')}: {rice.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPrices.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('noPricesFound')}</h3>
              <p className="text-muted-foreground">{t('adjustFilters')}</p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>{t('disclaimer').split(':')[0]}:</strong> {t('disclaimer').split(':')[1]}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;