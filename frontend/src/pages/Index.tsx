import React, { useState, Suspense } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Header } from '@/components/Header';
import { QuickActionCard } from '@/components/QuickActionCard';
import { CropScanner } from '@/components/CropScanner';
import { DiseaseDatabase } from '@/components/DiseaseDatabase';
import { FarmerTips } from '@/components/FarmerTips';
import { ExpertHelp } from '@/components/ExpertHelp';
import { ChatScreen } from '@/components/ChatScreen';
import { Hero3D } from '@/components/Hero3D';
import { SectionLoadingSpinner } from '@/components/LoadingSpinner';
import { LoadingDots } from '@/components/LoadingDots';
import { TreatmentCalendar } from '@/components/TreatmentCalendar';
import { Marketplace } from '@/components/Marketplace';
import { ProfilePage } from '@/components/ProfilePage';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Footer } from '@/components/Footer';
import { ScrollAnimatedSection } from '@/components/ScrollAnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  BookOpen,
  Lightbulb,
  Phone,
  Leaf,
  Shield,
  TrendingUp,
  Sun,
  Cloud
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { ChatBot } from '@/components/ChatBot';
import WeatherCard from '@/components/WeatherCard';
import { Separator } from '@radix-ui/react-select';

type Page = 'home' | 'scanner' | 'database' | 'tips' | 'help' | 'chat' | 'calendar' | 'marketplace' | 'profile';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [chatQuestion, setChatQuestion] = useState<string>('');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { t } = useTranslation();

  const handlePageChange = (page: Page) => {
    setIsPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsPageLoading(false);
    }, 500);
  };

  const renderCurrentPage = () => {
    if (isPageLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'scanner':
        return (
          <Suspense fallback={<SectionLoadingSpinner text={t('loadingScanner')} />}>
            <CropScanner onBack={() => handlePageChange('home')} />
          </Suspense>
        );
      case 'database':
        return (
          <Suspense fallback={<SectionLoadingSpinner text={t('loadingDatabase')} />}>
            <DiseaseDatabase onBack={() => handlePageChange('home')} />
          </Suspense>
        );
      case 'tips':
        return (
          <Suspense fallback={<SectionLoadingSpinner text={t('loadingTips')} />}>
            <FarmerTips onBack={() => handlePageChange('home')} />
          </Suspense>
        );
      case 'help':
        return (
          <Suspense fallback={<SectionLoadingSpinner text={t('loadingExpertHelp')} />}>
            <ExpertHelp onBack={() => handlePageChange('home')} onNavigateToChat={(question) => {
              setChatQuestion(question);
              handlePageChange('chat');
            }} />
          </Suspense>
        );
      case 'chat':
        return (
          <Suspense fallback={<SectionLoadingSpinner text={t('loadingChat')} />}>
            <ChatScreen onBack={() => handlePageChange('help')} question={chatQuestion} />
          </Suspense>
        );
      case 'calendar':
        return (
          <Suspense fallback={<SectionLoadingSpinner text="Loading treatment calendar..." />}>
            <TreatmentCalendar />
          </Suspense>
        );
      case 'marketplace':
        return (
          <Suspense fallback={<SectionLoadingSpinner text="Loading marketplace..." />}>
            <Marketplace />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<SectionLoadingSpinner text="Loading profile..." />}>
            <ProfilePage />
          </Suspense>
        );
      default:
        return (
          <div className="space-y-8 page-transition">
            {/* Hero Section */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-card animate-fade-in-up hover-glow h-56 sm:h-64 md:h-80">
              {/* 3D Background */}
              <Suspense fallback={
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-crop-primary/80 flex items-center justify-center">
                  <LoadingDots color="primary" />
                </div>
              }>
                <Hero3D />
              </Suspense>

              {/* Background Image with Overlay */}
              <img
                src={heroImage}
                alt="Healthy crops in agricultural field"
                className="w-full h-full object-cover opacity-60"
                draggable="false"
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-crop-primary/80 flex items-center z-10">
                <div className="w-full px-3 sm:px-6 text-white flex flex-col justify-center">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 animate-slide-in-left leading-tight">
                    {t('heroTitle')}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-6 text-white/90 max-w-full sm:max-w-2xl animate-slide-in-right">
                    {t('heroDescription')}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 animate-fade-in">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 animate-stagger-1">
                      <Camera className="h-4 w-4 mr-1 sm:mr-2" />
                      {t('aiDetection')}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 animate-stagger-2">
                      <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                      {t('expertAdvice')}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 animate-stagger-3">
                      <Leaf className="h-4 w-4 mr-1 sm:mr-2" />
                      {t('organicSolutions')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover-lift animate-stagger-1">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success mb-1 animate-float">10+</div>
                  <div className="text-xs text-muted-foreground">{t('diseasesDetected')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-crop-primary/10 to-crop-primary/5 border-crop-primary/20 hover-lift animate-stagger-2">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-crop-primary mb-1 animate-float" style={{ animationDelay: '0.5s' }}>150+</div>
                  <div className="text-xs text-muted-foreground">{t('farmersHelped')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover-lift animate-stagger-3">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning-foreground mb-1 animate-float" style={{ animationDelay: '1s' }}>24/7</div>
                  <div className="text-xs text-muted-foreground">{t('expertSupport')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover-lift animate-stagger-4">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1 animate-float" style={{ animationDelay: '1.5s' }}>90%*</div>
                  <div className="text-xs text-muted-foreground">{t('accuracyRate')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <QuickActionCard
                title={t('scanCrop')}
                description={t('scanDescription')}
                icon={Camera}
                onClick={() => handlePageChange('scanner')}
                variant="scan"
                className="border-success/20 bg-gradient-to-br from-success/5 to-transparent hover-lift animate-slide-in-left"
              />

              <QuickActionCard
                title={t('diseaseDatabase')}
                description={t('databaseDescription')}
                icon={BookOpen}
                onClick={() => handlePageChange('database')}
                variant="farmer"
                className="border-crop-primary/20 bg-gradient-to-br from-crop-primary/5 to-transparent hover-lift"
              />
            </div>

            {/* Secondary Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <QuickActionCard
                title={t('farmerTips')}
                description={t('tipsDescription')}
                icon={Lightbulb}
                onClick={() => handlePageChange('tips')}
                variant="crop"
                className="border-warning/20 bg-gradient-to-br from-warning/5 to-transparent hover-lift animate-slide-in-left"
              />

              <QuickActionCard
                title={t('expertHelp')}
                description={t('helpDescription')}
                icon={Phone}
                onClick={() => handlePageChange('help')}
                variant="default"
                className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover-lift"
              />
            </div>

            {/* Today's Weather & Alerts */}
            <ScrollAnimatedSection animationType="fade-up" delay={800}>
              <WeatherCard />
            </ScrollAnimatedSection>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>


      {currentPage === 'home' && (
        <>
          <div className="container mx-auto px-4 pb-8">
            <ChatBot onStartChat={(question) => {
              setChatQuestion(question);
              handlePageChange('chat');
            }} />
          </div>
          <Separator className="my-8 bg-white/20" />
        </>
      )}

      <BottomNavigation
        activeTab={currentPage === 'home' ? 'home' : currentPage === 'scanner' ? 'scan' : currentPage === 'calendar' ? 'calendar' : currentPage === 'marketplace' ? 'marketplace' : 'profile'}
        onTabChange={(tab) => {
          if (tab === 'home') handlePageChange('home');
          else if (tab === 'scan') handlePageChange('scanner');
          else if (tab === 'calendar') handlePageChange('calendar');
          else if (tab === 'marketplace') handlePageChange('marketplace');
          else if (tab === 'profile') handlePageChange('profile');
        }}
      />
    </div>
  );
};

export default Index;
