import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, ChevronLeft, ChevronRight, Star, Quote, Check, X, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { useJourneys } from "@/hooks/useSupabaseQuery";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Sacred Journeys", url: "https://www.thenirvanist.com/sacred-journeys" },
]);

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1600&q=80";

const WHY_CARDS = [
  {
    icon: "🌿",
    title: "Experience Deep Transformation",
    desc: "Every itinerary is designed for seekers — with time built in for silence, reflection, and genuine encounter. We facilitate inner growth through a blend of sacred locations and curated content. Your evolution begins before you depart and continues long after you return, ensuring the insights you gain stay with you for life.",
  },
  {
    icon: "🧭",
    title: "Independent Travel, Expert Support",
    desc: "Navigate your path with total autonomy. Our user friendly app provides all the knowledge you need in your pocket, allowing you to explore at your own pace. You have the freedom to travel solo or with a guide, supported by high-quality assistance whenever you need it.",
  },
  {
    icon: "🏛️",
    title: "Ancient Wisdom for the Modern World",
    desc: "Our spiritually passionate Western-Indian team comes with 25+ years experience in spiritual trips, customer experience design, innovation, learning expeditions and matchmaking. We design diligently researched meaningful experiences for the rational seeker, focusing on authentic spiritual impact and practical learning.",
  },
];

const COMPARISON_ROWS = [
  {
    characteristic: "Logistics",
    sacredTrip: "Full guided package, everything arranged",
    coordinators: "Partial coordination, some self-management",
    nirvanist: "App-guided with expert on-demand support",
  },
  {
    characteristic: "Experience",
    sacredTrip: "Group tours, fixed schedule",
    coordinators: "Semi-flexible, coordinator-led",
    nirvanist: "Fully personalised seeker experience",
  },
  {
    characteristic: "Guides",
    sacredTrip: "Generic tour guide",
    coordinators: "Local coordinator",
    nirvanist: "Spiritually trained, philosophy-fluent guide",
  },
  {
    characteristic: "Costs",
    sacredTrip: "High — all-inclusive premium pricing",
    coordinators: "Medium — variable, unclear breakdown",
    nirvanist: "Transparent, value-driven pricing",
  },
  {
    characteristic: "Technology",
    sacredTrip: "Minimal digital support",
    coordinators: "Basic itinerary PDFs",
    nirvanist: "Rich app experience with wisdom, maps, reflections",
  },
];

function JourneyCarousel() {
  const { data: journeys, isLoading } = useJourneys();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const cards = journeys ? [...journeys, ...journeys] : [];

  if (isLoading) {
    return (
      <div className="flex gap-6 px-6 py-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-6 px-6"
        style={{
          animation: `journeyScroll 28s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          width: "max-content",
        }}
      >
        {cards.map((journey, i) => (
          <div
            key={`${journey.id}-${i}`}
            className="flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white shadow-md border border-gray-100 flex flex-col"
            style={{ height: "400px" }}
          >
            <div className="relative overflow-hidden h-44 flex-shrink-0">
              <img
                src={journey.image}
                alt={journey.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                {journey.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed flex-grow">
                {journey.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[hsl(75,64%,49%)]" />
                  {journey.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[hsl(75,64%,49%)]" />
                  {journey.duration}
                </span>
              </div>
              <div className="mt-auto">
                <Link href={`/journeys/${journey.id}`} onClick={() => window.scrollTo(0, 0)}>
                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black text-sm font-semibold transition-all duration-300">
                    View Journey
                    <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes journeyScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  useEffect(() => {
    if (!isAutoPlaying || !testimonials?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const go = (dir: 1 | -1) => {
    if (!testimonials?.length) return;
    setCurrentIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  if (isLoading || !testimonials?.length) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Testimonials</h2>
          <p className="text-gray-500">Loading experiences…</p>
        </div>
      </section>
    );
  }

  const t = testimonials[currentIndex];

  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Testimonials</h2>
          <p className="text-gray-600 text-lg">What our travelers say</p>
        </div>

        <div className="relative">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardContent className="p-10 md:p-14 text-center">
              <Quote className="w-12 h-12 text-[hsl(75,64%,49%)] mx-auto mb-6 opacity-20" />

              <div className="flex justify-center mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < t.rating
                        ? "text-[hsl(75,64%,49%)] fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8 italic">
                "{t.content}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.location}</p>
                  {t.journeyTitle && (
                    <p className="text-[hsl(75,64%,49%)] text-xs font-medium mt-0.5">
                      {t.journeyTitle}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => go(-1)}
              className="w-11 h-11 rounded-full brand-primary flex items-center justify-center text-white hover:opacity-90 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.slice(0, Math.min(testimonials.length, 15)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-[hsl(75,64%,49%)] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              className="w-11 h-11 rounded-full brand-primary flex items-center justify-center text-white hover:opacity-90 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SacredJourneys() {
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
      <section
        className="relative w-full flex items-end justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          minHeight: "70vh",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 text-center text-white px-6 pb-20 max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.18em] text-[hsl(70,71%,72%)] font-semibold mb-4">
            The Nirvanist
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-tight tracking-tight">
            Sacred Journeys
          </h1>
          <p className="text-xl md:text-2xl text-white/85 leading-relaxed max-w-2xl mx-auto">
            Embark on Outer Pilgrimages for Inner Evolution
          </p>
        </div>
      </section>

      {/* Why Do You Need One? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Do You Need One?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A sacred journey is not a holiday. It is an intentional step toward something deeper.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-[#F7F2E8] rounded-2xl p-8 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <span className="text-4xl mb-5">{card.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Journeys fast-moving carousel */}
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sacred Journeys</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each pilgrimage opens a different door into the sacred.
            </p>
          </div>
        </div>
        <JourneyCarousel />
      </section>

      {/* How Are We Different — comparison table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Are We Different
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A transparent comparison so you can make the right choice for your journey.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#F7F2E8]">
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">
                    Characteristics
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">
                    Sacred Trip
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">
                    Coordinators / Organisers
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">
                    <span className="text-[hsl(75,64%,39%)]">The Nirvanist Way</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={row.characteristic}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {row.characteristic}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.sacredTrip}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.coordinators}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[hsl(75,64%,39%)]">
                      {row.nirvanist}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
    </div>
  );
}
