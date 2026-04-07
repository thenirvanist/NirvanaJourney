import { useState, useEffect } from "react";
import gandhiImg from "@assets/Monk_Meditating_1775056505285.webp";
import gangesImg from "@assets/Rishikesh_1775056505289.webp";
import himalayaImg from "@assets/Himalaya_1775056505289.webp";
import meditationImg from "@assets/Meditation_1775056572859.webp";

const CARD_DATA = [
  {
    title: "GANDHI'S SPIRITUAL JOURNEY",
    subtitle: "Walk the path of the Mahatma",
    image: gandhiImg,
    imageAlt: "Monk in red robe seated before the Himalayan panorama",
  },
  {
    title: "HOLY GANGES SPIRITUAL JOURNEY",
    subtitle: "Surrender to the sacred river",
    image: gangesImg,
    imageAlt: "Yogi performing aarti at sunset on the sacred Ganges",
  },
  {
    title: "THE HIMALAYAN SPIRITUAL JOURNEY",
    subtitle: "Rise into the abode of the gods",
    image: himalayaImg,
    imageAlt: "Himalayan peaks with rhododendron forests in bloom",
  },
];

const LETTERBOX_IMAGES = [
  { url: gandhiImg, alt: "Monk in red robe meditating before the Himalayan range" },
  { url: gangesImg, alt: "Yogi performing aarti at sunset on the sacred Ganges" },
  { url: himalayaImg, alt: "Himalayan peaks with rhododendron forests in bloom" },
  { url: meditationImg, alt: "Meditator seated on a cliff edge overlooking the valley" },
];

export default function HomeSacredJourneys() {
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState<number | null>(null);

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

  return (
    <section className="bg-[#F7F2E8]">
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
      <div className="relative w-full overflow-hidden" style={{ height: "58vh", minHeight: "374px", maxHeight: "691px" }}>
        {LETTERBOX_IMAGES.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: i === activeImage ? 1 : 0,
              transition: i === activeImage || i === prevImage ? "opacity 1.4s ease-in-out" : "none",
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

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.52) 60%, rgba(0,0,0,0.68) 100%)",
          }}
        />

        {/* Quote overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="text-white font-semibold tracking-wide"
            style={{
              fontSize: "clamp(1.1rem, 3vw, 1.75rem)",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              letterSpacing: "0.01em",
            }}
          >
            The Journey Within Begins with a Step Outward.
          </p>
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

      {/* Full-bleed image overlay cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARD_DATA.map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden group rounded-sm"
              style={{ height: "460px" }}
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-10 h-px bg-white/60 mb-4" />
                <h2 className="text-white text-xl font-bold tracking-[0.15em] mb-3 leading-tight">
                  {card.title}
                </h2>
                <div className="w-6 h-px bg-white/60 mb-3" />
                <p className="text-white/85 text-sm md:text-base italic font-light">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
