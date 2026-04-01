import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { useJourneys } from "@/hooks/useSupabaseQuery";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import rishikeshImg from "@assets/Rishikesh_1775042874525.webp";
import himalayaImg from "@assets/Himalaya_1775043392013.webp";
import monkImg from "@assets/Monk_Meditating_1775043392015.webp";
import meditationImg from "@assets/Meditation_1775043392016.webp";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Sacred Journeys", url: "https://www.thenirvanist.com/sacred-journeys" },
]);

const CARD_TITLES = [
  { title: "GANDHI'S SPIRITUAL JOURNEY", subtitle: "Walk the path of the Mahatma" },
  { title: "HOLY GANGES SPIRITUAL JOURNEY", subtitle: "Surrender to the sacred river" },
  { title: "THE HIMALAYAN SPIRITUAL JOURNEY", subtitle: "Rise into the abode of the gods" },
];

const EXPERTISE = [
  {
    title: "Experience Deep Transformation",
    desc: "Every itinerary is designed for seekers — with time built in for silence, reflection, and genuine encounter. We facilitate inner growth through a blend of sacred locations and curated content. Your evolution begins before you depart and continues long after you return, ensuring the insights you gain stay with you for life.",
    image: himalayaImg,
    imageAlt: "Himalayan landscape",
    imageLeft: false,
  },
  {
    title: "Independent Travel, Expert Support",
    desc: "Navigate your path with total autonomy. Our user friendly app provides all the knowledge you need in your pocket, allowing you to explore at your own pace. You have the freedom to travel solo or with a guide, supported by high-quality assistance whenever you need it.",
    image: monkImg,
    imageAlt: "Monk meditating in mountains",
    imageLeft: true,
  },
  {
    title: "Ancient Wisdom for the Modern World",
    desc: "Our spiritually passionate Western-Indian team comes with 25+ years experience in spiritual trips, customer experience design, innovation, learning expeditions and matchmaking. We design diligently researched meaningful experiences for the rational seeker, focusing on authentic spiritual impact and practical learning.",
    image: meditationImg,
    imageAlt: "Meditation on a cliff",
    imageLeft: false,
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

function JourneyCards() {
  const { data: journeys, isLoading } = useJourneys();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 animate-pulse ${i === 2 ? "md:col-span-2" : ""}`}
            style={{ height: "480px" }}
          />
        ))}
      </div>
    );
  }

  const displayed = (journeys || []).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      {displayed.map((journey, i) => (
        <div
          key={journey.id}
          className={`relative overflow-hidden group cursor-pointer ${i === 2 ? "md:col-span-2" : ""}`}
          style={{ height: i === 2 ? "400px" : "480px" }}
        >
          <img
            src={journey.image}
            alt={CARD_TITLES[i]?.title || journey.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-12 h-px bg-white/60 mb-5" />
            <h2 className="text-white text-2xl md:text-3xl font-bold tracking-[0.15em] mb-3 leading-tight">
              {CARD_TITLES[i]?.title || journey.title.toUpperCase()}
            </h2>
            <div className="w-8 h-px bg-white/60 mb-4" />
            <p className="text-white/85 text-base md:text-lg italic font-light">
              {CARD_TITLES[i]?.subtitle}
            </p>
          </div>
        </div>
      ))}
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

  const current = testimonials[currentIndex];

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
                    className={`w-5 h-5 ${i < current.rating ? "text-[hsl(75,64%,49%)] fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-8 italic">
                "{current.content}"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                {current.avatar && (
                  <img src={current.avatar} alt={current.name} className="w-14 h-14 rounded-full object-cover" />
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{current.name}</p>
                  <p className="text-gray-500 text-sm">{current.location}</p>
                  {current.journeyTitle && (
                    <p className="text-[hsl(75,64%,49%)] text-xs font-medium mt-0.5">{current.journeyTitle}</p>
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
              {testimonials.slice(0, 15).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-3 h-3 bg-[hsl(75,64%,49%)] scale-125"
                      : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
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
        style={{ backgroundImage: `url(${rishikeshImg})`, minHeight: "70vh" }}
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

      {/* Intro paragraph */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            A sacred journey is not a holiday — it is an intentional step toward something deeper.
            We curate pilgrimages across India's most spiritually potent landscapes: ancient temples,
            mountain monasteries, sacred rivers, and living wisdom traditions. Each journey is
            designed not for tourists, but for genuine seekers ready to let the landscape transform them.
          </p>
        </div>
      </section>

      {/* Journey Cards — full-image overlay style */}
      <section className="bg-white">
        <JourneyCards />
      </section>

      {/* Our Expertise */}
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Expertise</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Why thousands of seekers trust us to design their most important journey.
            </p>
          </div>

          <div className="space-y-20">
            {EXPERTISE.map((item) => (
              <div key={item.title} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {item.imageLeft ? (
                  <>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-72 md:h-80">
                      <img src={item.image} alt={item.imageAlt} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-72 md:h-80">
                      <img src={item.image} alt={item.imageAlt} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Are We Different — comparison table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Are We Different</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A transparent comparison so you can make the right choice for your journey.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-100">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-[#F7F2E8]">
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">Characteristics</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">Self Organised Trip</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">Commercial Organisers</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-1/4">
                    <span className="text-[hsl(75,64%,39%)]">The Nirvanist Way</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={row.characteristic} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{row.characteristic}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.sacredTrip}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.coordinators}</td>
                    <td className="px-6 py-4 text-sm font-medium text-[hsl(75,64%,39%)]">{row.nirvanist}</td>
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
