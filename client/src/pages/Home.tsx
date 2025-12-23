import { lazy, Suspense } from "react";
import Seo from "@/components/Seo";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import InteractiveAbout from "@/components/InteractiveAbout";
import usePreviewMode from "@/hooks/usePreviewMode";
// Import critical sections directly to ensure immediate data loading
import SimpleTourCarousel from "@/components/SimpleTourCarousel";
import QuotesCarousel from "@/components/QuotesCarousel";
import MeetupsSection from "@/components/MeetupsSection";
import InnerNutritionSection from "@/components/InnerNutritionSection";
import SimpleSagesSection from "@/components/SimpleSagesSection";
import SimpleAshramsSection from "@/components/SimpleAshramsSection";
import TestimonialSection from "@/components/TestimonialSection";

// Only lazy load non-critical sections for better performance
const SpiritualCollage = lazy(() => import("@/components/SpiritualCollage"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading component for lazy-loaded sections
function SectionSkeleton() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="loading-skeleton h-8 w-64 mx-auto mb-8 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const isPreviewMode = usePreviewMode();
  
  return (
    <div className="min-h-screen">
      <Seo 
        title="Journey to Inner Peace - Spiritual Retreats & Sacred Journeys"
        description="Discover transformative spiritual journeys, sage wisdom, ashram retreats, and global meetups with The Nirvanist. Find your path to inner peace and self-discovery."
        ogType="website"
      />
      {/* Critical above-the-fold content */}
      <Navigation />
      <HeroSection />
      
      {/* About Us - Hidden when not in preview mode */}
      {isPreviewMode && <InteractiveAbout />}
      
      {/* Sacred Experiences (Collage) - Hidden when not in preview mode */}
      {isPreviewMode && (
        <Suspense fallback={<SectionSkeleton />}>
          <SpiritualCollage />
        </Suspense>
      )}
      
      {/* Sacred Journeys - Hidden when not in preview mode */}
      {isPreviewMode && <SimpleTourCarousel />}
      
      {/* Always visible sections */}
      <QuotesCarousel />
      <MeetupsSection />
      <InnerNutritionSection />
      <SimpleSagesSection />
      <SimpleAshramsSection />
      
      {/* Testimonials - Hidden when not in preview mode */}
      {isPreviewMode && <TestimonialSection />}
      
      {/* Non-critical sections with lazy loading */}
      <Suspense fallback={<SectionSkeleton />}>
        <Newsletter />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
