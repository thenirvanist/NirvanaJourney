import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { useJourneys } from "@/hooks/useSupabaseQuery";
import { BookmarkButton } from "@/components/BookmarkButton";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Sacred Journeys", url: "https://www.thenirvanist.com/sacred-journeys" },
]);

export default function SacredJourneys() {
  const { data: journeys, isLoading } = useJourneys();
  const [location] = useLocation();

  useEffect(() => {
    if (location.includes("#journeys-grid")) {
      const el = document.getElementById("journeys-grid");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Sacred Journeys — Spiritual Travel with The Nirvanist"
        description="Embark on transformative pilgrimages across India's most sacred landscapes. Himalayan temples, Varanasi's Ganga Aarti, ancient ashrams, and monastery retreats — curated for genuine seekers."
        ogType="website"
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-28 pb-20 bg-[#F7F2E8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-[hsl(75,64%,39%)] font-semibold mb-4">
            The Nirvanist
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Sacred Journeys
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Philosophy is not just to be read, but to be lived. Step into the landscapes that have shaped seekers for millennia.
          </p>
          <a href="#journeys-grid">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300">
              View All Journeys
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* What makes our journeys different */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                icon: "🌿",
                title: "Curated for Depth",
                desc: "Every itinerary is designed not for tourists but for seekers — with time built in for silence, reflection, and genuine encounter.",
              },
              {
                icon: "🧘",
                title: "Guided by Tradition",
                desc: "Our journeys are accompanied by teachers, scholars, and local wisdom-keepers who hold the living memory of these places.",
              },
              {
                icon: "🤝",
                title: "Small, Intentional Groups",
                desc: "Intimate cohorts of like-minded travelers so the journey itself becomes a community, not just a tour.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey cards grid */}
      <section id="journeys-grid" className="py-20 bg-[#F7F2E8] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journeys
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Three transformative pilgrimages, each opening a different door into the sacred.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(journeys || []).slice(0, 6).map((journey) => (
                <Link key={journey.id} href={`/journeys/${journey.id}`} onClick={() => window.scrollTo(0, 0)}>
                  <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={journey.image}
                        alt={journey.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <BookmarkButton contentType="journey" contentId={journey.id} size="sm" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                        {journey.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-5">
                        {journey.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[hsl(75,64%,49%)]" />
                          {journey.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[hsl(75,64%,49%)]" />
                          {journey.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[hsl(75,64%,39%)]">{journey.price}</span>
                        <span className="text-xs text-[hsl(75,64%,49%)] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Not sure which journey is right for you?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Write to us — we'll help you find the path that speaks to where you are right now.
          </p>
          <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-full font-semibold transition-all duration-300">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
