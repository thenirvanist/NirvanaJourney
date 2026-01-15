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
          <h1 className="text-6xl font-bold mb-6">Sacred Journeys</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Embark on transformative spiritual adventures that connect you with ancient wisdom, 
            sacred places, and your inner truth. Each journey is carefully curated to provide 
            authentic experiences that foster deep personal growth.
          </p>
          <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
            Explore All Journeys
          </Button>
        </div>
      </section>

      {/* Journey Cards Carousel */}
      <TourCarousel />

      {/* Why Do You Need One Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Do You Need One?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In our fast-paced world, sacred journeys offer profound opportunities for spiritual growth, 
              inner healing, and connection with ancient wisdom traditions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Inner Transformation</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience profound shifts in consciousness through sacred practices, meditation, 
                and connection with spiritual teachers and fellow seekers.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Cultural Immersion</h3>
              <p className="text-gray-600 leading-relaxed">
                Dive deep into authentic spiritual traditions, visiting sacred sites and learning 
                from indigenous wisdom keepers in their natural environments.
              </p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-20 h-20 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Soul Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with like-minded spiritual seekers, forming lasting bonds and creating 
                a supportive community for your ongoing spiritual journey.
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
              <h2 className="text-4xl font-bold mb-6">Pricing First</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">Transparent & Accessible</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We believe spiritual growth shouldn't be limited by financial barriers. Our pricing is 
                transparent from the start - no hidden fees, no surprise costs. We offer flexible 
                payment plans and early-bird discounts to make these transformative experiences 
                accessible to sincere seekers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>All-inclusive pricing with no hidden costs</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Flexible payment plans available</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Scholarship opportunities for dedicated practitioners</span>
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
              <h2 className="text-4xl font-bold mb-6">Tech First</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">Modern Tools for Ancient Wisdom</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We seamlessly blend traditional spiritual practices with modern technology. From AI-powered 
                journey matching to virtual preparation sessions, our tech-first approach ensures you're 
                fully prepared and connected throughout your sacred journey.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>AI-powered journey recommendations</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Virtual pre-journey preparation sessions</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Real-time journey updates and support</span>
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
              <h2 className="text-4xl font-bold mb-6">Partnership First</h2>
              <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">Authentic Local Connections</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We partner directly with authentic spiritual teachers, local communities, and sacred sites. 
                This ensures your journey benefits the local community while providing you with genuine, 
                unfiltered spiritual experiences that commercial tours simply cannot offer.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Direct partnerships with spiritual teachers</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Community-based tourism supporting locals</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  <span>Exclusive access to sacred sites and ceremonies</span>
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
