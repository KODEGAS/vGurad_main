import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Search, Filter, MapPin, Calendar, ArrowLeft, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

interface RicePrice {
  _id: string;
  Name: string;
  Price: number;
  Location: string;
}

interface RicePriceDisplay extends RicePrice {
  previousPrice: number;
  quality: string;
  unit: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const MarketPrices: React.FC = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<RicePriceDisplay[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<RicePriceDisplay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchPaddyPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://vgurad-backend.onrender.com/api/paddy-prices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch paddy prices');
        }
        
        const data: RicePrice[] = await response.json();
        
        // Transform API data to display format
        const transformedData: RicePriceDisplay[] = data.map((item, index) => ({
          ...item,
          previousPrice: item.Price - Math.floor(Math.random() * 10) + 5, // Mock previous price
          quality: ['Premium', 'Grade A', 'Grade B', 'Organic'][index % 4],
          unit: 'kg',
          lastUpdated: new Date().toISOString().split('T')[0],
          trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable' as 'up' | 'down' | 'stable'
        }));
        
        setPrices(transformedData);
        setFilteredPrices(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching paddy prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaddyPrices();
  }, []);

  // Filter prices based on search and filters
  useEffect(() => {
    let filtered = prices.filter(price => {
      const matchesSearch = price.Name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || price.Location === selectedLocation;
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
            <h1 className="text-3xl font-bold">{t('riceMarketPrices') || 'Rice Market Prices'}</h1>
          </div>
          <p className="text-white/80">{t('marketPricesDescription') || 'Real-time market prices for various rice varieties across Sri Lanka'}</p>
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
                    placeholder={t('searchRiceVariety') || 'Search rice variety...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('selectLocation') || 'Select location'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allLocations') || 'All Locations'}</SelectItem>
                  <SelectItem value="Colombo">{t('colombo') || 'Colombo'}</SelectItem>
                  <SelectItem value="Kandy">{t('kandy') || 'Kandy'}</SelectItem>
                  <SelectItem value="Galle">{t('galle') || 'Galle'}</SelectItem>
                  <SelectItem value="Anuradhapura">{t('anuradhapura') || 'Anuradhapura'}</SelectItem>
                  <SelectItem value="Ratnapura">{t('ratnapura') || 'Ratnapura'}</SelectItem>
                  <SelectItem value="Kurunegala">{t('kurunegala') || 'Kurunegala'}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('selectQuality') || 'Select quality'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allQualities') || 'All Qualities'}</SelectItem>
                  <SelectItem value="Premium">{t('premium') || 'Premium'}</SelectItem>
                  <SelectItem value="Grade A">{t('gradeA') || 'Grade A'}</SelectItem>
                  <SelectItem value="Grade B">{t('gradeB') || 'Grade B'}</SelectItem>
                  <SelectItem value="Organic">{t('organic') || 'Organic'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Market Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">{prices.length}</div>
              <div className="text-sm text-muted-foreground">{t('riceVarieties') || 'Rice Varieties'}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                LKR {prices.length > 0 ? Math.round(prices.reduce((sum, p) => sum + p.Price, 0) / prices.length) : 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('averagePricePerKg') || 'Average Price/kg'}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning-foreground mb-1">
                {new Set(prices.map(p => p.Location)).size}
              </div>
              <div className="text-sm text-muted-foreground">{t('markets') || 'Markets'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading paddy prices...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="text-center py-12 border-destructive/50 bg-destructive/10">
            <CardContent>
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        )}

        {/* Price Cards */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrices.map((rice) => {
              const priceChange = getPriceChange(rice.Price, rice.previousPrice);

              return (
                <Card key={rice._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rice.Name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{rice.Location}</span>
                        </div>
                      </div>
                      <Badge variant={rice.quality === 'Premium' || rice.quality === 'Organic' ? 'default' : 'secondary'}>
                        {t(rice.quality.toLowerCase().replace(' ', '') as any) || rice.quality}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">
                            LKR {rice.Price}
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
                        <span>{t('updated') || 'Updated'}: {rice.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredPrices.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('noPricesFound') || 'No prices found'}</h3>
              <p className="text-muted-foreground">{t('tryAdjustingSearch') || 'Try adjusting your search or filter criteria.'}</p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>{t('disclaimer') || 'Disclaimer'}:</strong> {t('pricesDisclaimer') || 'Prices are indicative and may vary based on quality, quantity, and market conditions. Please verify current rates with local traders before making transactions.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;