import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Globe, Users, Star } from "lucide-react";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TourCarousel from "@/components/TourCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useJourneys } from "@/hooks/useSupabaseQuery";
import { useTranslation } from "@/hooks/useTranslation";

const journeysBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Sacred Journeys" }
]);

export default function Journeys() {
  const { t } = useTranslation();
  const { data: journeys, isLoading, error } = useJourneys();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">{t("pages.journeys.loading")}</h1>
              <p className="text-xl text-gray-600">{t("pages.journeys.loadingSubtitle")}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">{t("pages.journeys.error")}</h1>
              <p className="text-xl text-gray-600">{t("pages.journeys.errorSubtitle")}</p>
              <Button className="mt-6 brand-primary hover:brand-bright text-white hover:text-black">
                {t("pages.journeys.tryAgain")}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!journeys || journeys.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">{t("pages.journeys.title")}</h1>
              <p className="text-xl text-gray-600">{t("pages.journeys.empty")}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Seo 
        title="Sacred Journeys - Spiritual Retreats & Meditation Tours"
        description="Explore transformative spiritual journeys to sacred destinations. Join meditation retreats, pilgrimage tours, and immersive experiences designed for inner peace and self-discovery."
      />
      <SchemaOrg schema={journeysBreadcrumb} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6">{t("pages.journeys.heroTitle")}</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t("pages.journeys.heroSubtitle")}
          </p>
          <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
            {t("pages.journeys.exploreButton")}
          </Button>
        </div>
      </section>

      {/* Journey Cards Carousel */}
      <TourCarousel />

      {/* Why Do You Need One Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">{t("pages.journeys.whyNeedTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("pages.journeys.whyNeedSubtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t("pages.journeys.innerTransformationTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.journeys.innerTransformationDesc")}
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t("pages.journeys.culturalImmersionTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.journeys.culturalImmersionDesc")}
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t("pages.journeys.soulCommunityTitle")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t("pages.journeys.soulCommunityDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Are We Different - Pricing First */}
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t("pages.journeys.pricingFirstTitle")}</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">{t("pages.journeys.pricingFirstSubtitle")}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t("pages.journeys.pricingFirstDesc")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.pricingItem1")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.pricingItem2")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.pricingItem3")}</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Transparent pricing" 
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How Are We Different - Tech First */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <h2 className="text-4xl font-bold mb-6">{t("pages.journeys.techFirstTitle")}</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">{t("pages.journeys.techFirstSubtitle")}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t("pages.journeys.techFirstDesc")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.techItem1")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.techItem2")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.techItem3")}</span>
                </li>
              </ul>
            </div>
            <div className="lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Technology integration" 
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How Are We Different - Partnership First */}
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t("pages.journeys.partnershipFirstTitle")}</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">{t("pages.journeys.partnershipFirstSubtitle")}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {t("pages.journeys.partnershipFirstDesc")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.partnershipItem1")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.partnershipItem2")}</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>{t("pages.journeys.partnershipItem3")}</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1544931503-6e6466908cec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Community partnerships" 
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      <Footer />
    </div>
  );
}
