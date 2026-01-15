import { useState, useEffect, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";

// Lazy load the video component to reduce initial bundle size
const LazyVideoBackground = lazy(() => import('@/components/VideoBackground'));

interface HeroSectionProps {
  priority?: boolean;
}

export default function OptimizedHeroSection({ priority = true }: HeroSectionProps) {
  const { t } = useTranslation();
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    // Don't load video if reduced motion is preferred
    if (mediaQuery.matches) {
      setShouldLoadVideo(false);
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden hero-optimized">
      {/* Optimized Background */}
      {shouldLoadVideo && !isReducedMotion ? (
        <LazyVideoBackground />
      ) : (
        <StaticBackground />
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-reveal">
          {t("hero.title")}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 text-reveal max-w-3xl mx-auto" style={{animationDelay: "0.3s"}}>
          {t("hero.subtitle")}
        </p>
        <Link href="/journeys">
          <Button 
            className="brand-primary hover:brand-bright text-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-reveal"
            style={{animationDelay: "0.6s"}}
          >
            {t("hero.cta")}
          </Button>
        </Link>
      </div>
      
      {/* Optimized Partner Strip */}
      <PartnerStrip />
    </section>
  );
}

// Static fallback background for faster initial load
function StaticBackground() {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(55, 65, 81, 0.8) 100%),
          url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPgo=')
        `,
        backgroundSize: 'cover, 20px 20px',
        backgroundPosition: 'center, 0 0'
      }}
    />
  );
}

// Optimized partner strip with reduced layout shift
function PartnerStrip() {
  const { t } = useTranslation();
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center space-x-4 sm:space-x-12 text-white text-xs sm:text-sm opacity-90">
          <span className="hidden sm:inline">{t("hero.trustedPartners")}:</span>
          <div className="flex items-center space-x-3 sm:space-x-8 text-xs sm:text-sm">
            <span>Sacred Earth</span>
            <span className="hidden sm:inline">Mindful Travel Co</span>
            <span>Wellness Retreats</span>
            <span className="hidden md:inline">Himalayan Spirituality</span>
          </div>
        </div>
      </div>
    </div>
  );
}