import React, { useState, Suspense } from 'react';
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
import { useTranslation } from '@/contexts/TranslationContext';

type Page = 'home' | 'scanner' | 'database' | 'tips' | 'help' | 'chat';

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
      return <SectionLoadingSpinner text={t('loadingPage')} />;
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
      default:
        return (
          <div className="space-y-6 md:space-y-12 page-transition">
            {/* Hero Section - Enhanced */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up hover-glow h-72 md:h-96 lg:h-[32rem]">
              {/* 3D Background */}
              <Suspense fallback={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-crop-primary/80 to-success/70 flex items-center justify-center">
                  <LoadingDots color="primary" />
                </div>
              }>
                <Hero3D />
              </Suspense>

              {/* Background Image with Enhanced Overlay */}
              <img
                src={heroImage}
                alt="Healthy crops in agricultural field"
                className="w-full h-full object-cover opacity-50"
              />

              {/* Content Overlay - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-crop-primary/75 to-success/65 flex items-center z-10">
                <div className="container mx-auto px-4 md:px-8 text-white">
                  <div className="max-w-4xl">
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6 animate-slide-in-left leading-tight">
                      {t('heroTitle')}
                    </h1>
                    <p className="text-base md:text-lg lg:text-2xl mb-6 md:mb-8 text-white/95 max-w-3xl animate-slide-in-right leading-relaxed">
                      {t('heroDescription')}
                    </p>

                    {/* Enhanced Feature Badges */}
                    <div className="flex flex-wrap gap-2 md:gap-4 animate-fade-in">
                      <Badge className="bg-white/25 text-white border-white/40 text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 animate-stagger-1 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                        <Camera className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {t('aiDetection')}
                      </Badge>
                      <Badge className="bg-white/25 text-white border-white/40 text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 animate-stagger-2 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                        <Shield className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {t('expertAdvice')}
                      </Badge>
                      <Badge className="bg-white/25 text-white border-white/40 text-xs md:text-sm px-3 md:px-4 py-2 md:py-2 animate-stagger-3 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                        <Leaf className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        {t('organicSolutions')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Stats with Better Mobile Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <Card className="bg-gradient-to-br from-success/15 to-success/5 border-success/30 hover-lift animate-stagger-1 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-3 md:p-6 text-center">
                  <div className="text-xl md:text-3xl lg:text-4xl font-bold text-success mb-1 md:mb-2 animate-float">50+</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-tight">{t('diseasesDetected')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-crop-primary/15 to-crop-primary/5 border-crop-primary/30 hover-lift animate-stagger-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-3 md:p-6 text-center">
                  <div className="text-xl md:text-3xl lg:text-4xl font-bold text-crop-primary mb-1 md:mb-2 animate-float" style={{ animationDelay: '0.5s' }}>1000+</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-tight">{t('farmersHelped')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-warning/15 to-warning/5 border-warning/30 hover-lift animate-stagger-3 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-3 md:p-6 text-center">
                  <div className="text-xl md:text-3xl lg:text-4xl font-bold text-warning-foreground mb-1 md:mb-2 animate-float" style={{ animationDelay: '1s' }}>24/7</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-tight">{t('expertSupport')}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30 hover-lift animate-stagger-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardContent className="p-3 md:p-6 text-center">
                  <div className="text-xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2 animate-float" style={{ animationDelay: '1.5s' }}>95%</div>
                  <div className="text-xs md:text-sm text-muted-foreground leading-tight">{t('accuracyRate')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Main Actions with Better Spacing */}
            <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
              <QuickActionCard
                title={t('scanCrop')}
                description={t('scanDescription')}
                icon={Camera}
                onClick={() => handlePageChange('scanner')}
                variant="scan"
                className="border-success/30 bg-gradient-to-br from-success/10 to-success/5 hover-lift animate-slide-in-left shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              />

              <QuickActionCard
                title={t('diseaseDatabase')}
                description={t('databaseDescription')}
                icon={BookOpen}
                onClick={() => handlePageChange('database')}
                variant="farmer"
                className="border-crop-primary/30 bg-gradient-to-br from-crop-primary/10 to-crop-primary/5 hover-lift shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              />
            </div>

            {/* Enhanced Secondary Actions */}
            <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
              <QuickActionCard
                title={t('farmerTips')}
                description={t('tipsDescription')}
                icon={Lightbulb}
                onClick={() => handlePageChange('tips')}
                variant="crop"
                className="border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5 hover-lift animate-slide-in-left shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              />

              <QuickActionCard
                title={t('expertHelp')}
                description={t('helpDescription')}
                icon={Phone}
                onClick={() => handlePageChange('help')}
                variant="default"
                className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover-lift shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              />
            </div>

            {/* Enhanced Today's Weather & Alerts */}
            <ScrollAnimatedSection animationType="fade-up" delay={800}>
              <Card className="bg-gradient-to-br from-crop-secondary/80 via-accent/60 to-success/20 hover-glow shadow-xl border-0 overflow-hidden">
                <CardContent className="p-4 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-lg md:text-2xl font-bold text-foreground animate-slide-in-left mb-2 md:mb-0">{t('todayConditions')}</h3>
                    <Badge className="bg-success/25 text-success border-success/40 animate-pulse-glow backdrop-blur-sm text-sm md:text-base px-3 md:px-4 py-1 md:py-2 self-start md:self-center">
                      {t('optimal')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-center">
                    <div className="flex flex-col items-center animate-stagger-1 hover-scale p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                      <Sun className="h-6 w-6 md:h-10 md:w-10 text-warning mb-2 md:mb-3 animate-float" />
                      <div className="text-lg md:text-2xl font-bold">28°C</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{t('temperature')}</div>
                    </div>
                    <div className="flex flex-col items-center animate-stagger-2 hover-scale p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                      <Cloud className="h-6 w-6 md:h-10 md:w-10 text-primary mb-2 md:mb-3 animate-float" style={{ animationDelay: '0.5s' }} />
                      <div className="text-lg md:text-2xl font-bold">65%</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{t('humidity')}</div>
                    </div>
                    <div className="flex flex-col items-center animate-stagger-3 hover-scale p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                      <TrendingUp className="h-6 w-6 md:h-10 md:w-10 text-success mb-2 md:mb-3 animate-float" style={{ animationDelay: '1s' }} />
                      <div className="text-lg md:text-2xl font-bold">{t('good')}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{t('growth')}</div>
                    </div>
                    <div className="flex flex-col items-center animate-stagger-4 hover-scale p-3 md:p-4 rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                      <Shield className="h-6 w-6 md:h-10 md:w-10 text-crop-primary mb-2 md:mb-3 animate-float" style={{ animationDelay: '1.5s' }} />
                      <div className="text-lg md:text-2xl font-bold">{t('low')}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{t('diseaseRisk')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>

            {/* New Enhanced Call-to-Action Section */}
            <ScrollAnimatedSection animationType="fade-up" delay={1000}>
              <Card className="bg-gradient-to-r from-primary via-crop-primary to-success text-white border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-6 md:p-12 text-center">
                  <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 animate-slide-in-up">
                    {t('readyToProtect')}
                  </h3>
                  <p className="text-sm md:text-lg mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                    {t('joinThousands')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <button
                      onClick={() => handlePageChange('scanner')}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105 text-sm md:text-base w-full sm:w-auto"
                    >
                      <Camera className="h-4 w-4 md:h-5 md:w-5 mr-2 inline" />
                      {t('startScanning')}
                    </button>
                    <button
                      onClick={() => handlePageChange('help')}
                      className="bg-white text-primary hover:bg-white/90 px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm md:text-base w-full sm:w-auto"
                    >
                      <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 inline" />
                      {t('getExpertHelp')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-8">
        {renderCurrentPage()}
      </main>

      {currentPage === 'home' && <ChatBot onStartChat={(question) => {
        setChatQuestion(question);
        handlePageChange('chat');
      }} />}

      {/* Footer - Only show on home page */}
      {currentPage === 'home' && (
        <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-8 overflow-hidden">
          {/* Modern background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-crop-primary/10 to-success/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>

          <div className="relative container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Left side - Brand */}
              <div className="flex items-center space-x-3 animate-fade-in-up">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">vG</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/90">vGuard</div>
                  <div className="text-xs text-white/60">Agricultural Solutions</div>
                </div>
              </div>

              {/* Center - Copyright */}
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-sm text-white/70">
                  © 2025 All rights reserved
                </div>
              </div>

              {/* Right side - Team credit */}
              <div className="flex items-center space-x-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <span className="text-sm text-white/70">Built by</span>
                <a
                  href="https://github.com/KODEGAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">K</span>
                  </div>
                  <span className="font-semibold text-white group-hover:text-white/90 transition-colors duration-300">
                    KODEGAS
                  </span>
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom divider line */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="hidden md:flex items-center justify-center space-x-6 text-xs text-white/50">
                <span>Modern Agricultural Technology</span>
                <span>•</span>
                <span>AI-Powered Crop Protection</span>
                <span>•</span>
                <span>Expert Agricultural Guidance</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
