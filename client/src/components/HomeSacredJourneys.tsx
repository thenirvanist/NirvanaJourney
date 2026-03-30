import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { useJourneys } from "@/hooks/useSupabaseQuery";

const LETTERBOX_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80&fit=crop",
    alt: "Ancient Hindu temple in the Himalayas"
  },
  {
    url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1600&q=80&fit=crop",
    alt: "Ganga Aarti ceremony at Varanasi"
  },
  {
    url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80&fit=crop",
    alt: "Sacred South Indian temple at dawn"
  },
  {
    url: "https://images.unsplash.com/photo-1533050487297-09b450131914?w=1600&q=80&fit=crop",
    alt: "Buddhist monks in Dharamshala"
  }
];

export default function HomeSacredJourneys() {
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef0 = useRef<HTMLDivElement>(null);
  const cardRef1 = useRef<HTMLDivElement>(null);
  const cardRef2 = useRef<HTMLDivElement>(null);
  const cardRefs = [cardRef0, cardRef1, cardRef2];

  const { data: journeys } = useJourneys();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImage(activeImage);
      setActiveImage((prev) => (prev + 1) % LETTERBOX_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeImage]);

  useEffect(() => {
    if (prevImage === null) return;
    const timer = setTimeout(() => setPrevImage(null), 1200);
    return () => clearTimeout(timer);
  }, [prevImage]);

  useEffect(() => {
    const PARALLAX_OFFSETS = [-35, 0, 35];

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = windowHeight + rect.height;
      const progress = 1 - rect.bottom / totalHeight;

      cardRefs.forEach((ref, i) => {
        if (ref.current) {
          const y = PARALLAX_OFFSETS[i] * progress;
          ref.current.style.transform = `translateY(${y}px)`;
          ref.current.style.transition = "transform 0.1s linear";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayedJourneys = journeys?.slice(0, 3) || [];

  return (
    <section className="bg-white">
      {/* Section header */}
      <div className="py-16 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
          Sacred Journeys
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Philosophy is not just to be read, but to be lived. Step into the landscapes that have shaped seekers for millennia.
        </p>
      </div>

      {/* Letterbox image montage */}
      <div className="relative w-full overflow-hidden" style={{ height: "40vh", minHeight: "260px", maxHeight: "480px" }}>
        {LETTERBOX_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: i === activeImage ? 1 : i === prevImage ? 0 : 0,
              transition: i === activeImage
                ? "opacity 1.4s ease-in-out"
                : i === prevImage
                ? "opacity 1.4s ease-in-out"
                : "none",
              zIndex: i === activeImage ? 2 : i === prevImage ? 1 : 0,
            }}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.6) brightness(0.82)" }}
              loading="lazy"
            />
          </div>
        ))}

        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.52) 60%, rgba(0,0,0,0.68) 100%)",
          }}
        />

        {/* Text overlay — stays fixed as images change */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="text-white font-semibold tracking-wide mb-6"
            style={{
              fontSize: "clamp(1.1rem, 3vw, 1.75rem)",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              letterSpacing: "0.01em",
            }}
          >
            The Journey Within Begins with a Step Outward.
          </p>
          <Link href="/sacred-journeys" onClick={() => window.scrollTo(0, 0)}>
            <Button
              className="px-7 py-3 text-sm font-semibold rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              style={{ letterSpacing: "0.04em" }}
            >
              Explore Sacred Journeys
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Image indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {LETTERBOX_IMAGES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => { setPrevImage(activeImage); setActiveImage(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeImage ? "20px" : "8px",
                height: "8px",
                background: i === activeImage ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll-parallax journey cards */}
      {displayedJourneys.length > 0 && (
        <div ref={sectionRef} className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start" style={{ perspective: "1000px" }}>
            {displayedJourneys.map((journey, i) => (
              <div
                key={journey.id}
                ref={cardRefs[i]}
                style={{ willChange: "transform" }}
              >
                <Link
                  href="/sacred-journeys#journeys-grid"
                >
                  <div className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-400 border border-gray-100">
                    {/* Card image */}
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={journey.image}
                        alt={journey.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Card body */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {journey.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {journey.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
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
                        <span className="font-semibold text-[hsl(75,64%,39%)] text-sm">
                          {journey.price}
                        </span>
                        <span className="text-xs text-[hsl(75,64%,49%)] font-medium group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                          Learn more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
