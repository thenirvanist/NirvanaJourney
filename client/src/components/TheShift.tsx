import { useState } from "react";

const PILLARS = [
  {
    number: "01",
    title: "Cognitive Stillness",
    description:
      "Beyond the noise of the modern world, find a clarity that stays with you.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&fit=crop",
    alt: "Misty mountain lake at dawn",
  },
  {
    number: "02",
    title: "Spiritual Reconnection",
    description:
      "Align your daily existence with your higher purpose through ancient wisdom.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&fit=crop",
    alt: "Temple bells at sunrise",
  },
  {
    number: "03",
    title: "Inner Transformation",
    description:
      "Experience profound shifts in consciousness through sacred practices, meditation, and connection with spiritual teachers and fellow seekers.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80&fit=crop",
    alt: "Monk meditating in a forest",
  },
  {
    number: "04",
    title: "Cultural Immersion",
    description:
      "Dive deep into authentic spiritual traditions, visiting sacred sites and learning from indigenous wisdom keepers in their natural environments.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80&fit=crop",
    alt: "Ancient Hindu temple",
  },
  {
    number: "05",
    title: "Soul Community",
    description:
      "Connect with like-minded spiritual seekers, forming lasting bonds and creating a supportive community for your ongoing spiritual journey.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&fit=crop",
    alt: "Group of people in a circle outdoors",
  },
];

export default function TheShift() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[hsl(75,64%,39%)] font-semibold mb-3">
          Why Journey
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-[0.12em] text-gray-900 mb-5">
          THE SHIFT
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          In our fast-paced world, sacred journeys offer profound shift within
          for spiritual growth, inner healing, and connection with ancient wisdom
          traditions.
        </p>
      </div>

      {/* Desktop accordion */}
      <div className="hidden md:flex w-full" style={{ height: "520px" }}>
        {PILLARS.map((pillar, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={pillar.number}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: isActive ? 3 : activeIndex !== null ? 0.5 : 1,
                transition: "flex 0.6s ease",
              }}
            >
              {/* Background image */}
              <img
                src={pillar.image}
                alt={pillar.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Dark overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.3) 100%)"
                    : "rgba(0,0,0,0.52)",
                }}
              />

              {/* Collapsed state — vertical number + title */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300"
                style={{ opacity: isActive ? 0 : 1 }}
              >
                <div
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <span
                    className="text-white/50 font-light"
                    style={{ fontSize: "11px", letterSpacing: "0.18em" }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="text-white font-semibold tracking-widest uppercase"
                    style={{ fontSize: "13px", letterSpacing: "0.2em" }}
                  >
                    {pillar.title}
                  </span>
                </div>
              </div>

              {/* Expanded state — horizontal content */}
              <div
                className="absolute inset-0 flex flex-col justify-end px-8 pb-10 transition-opacity duration-300"
                style={{
                  opacity: isActive ? 1 : 0,
                  transitionDelay: isActive ? "0.25s" : "0s",
                }}
              >
                <p
                  className="text-white/55 font-light mb-2"
                  style={{ fontSize: "11px", letterSpacing: "0.22em" }}
                >
                  {pillar.number}
                </p>
                <div
                  className="w-8 mb-3"
                  style={{ height: "1px", background: "rgba(255,255,255,0.4)" }}
                />
                <h3 className="text-white text-xl font-bold tracking-wider uppercase mb-4 leading-tight">
                  {pillar.title}
                </h3>
                <p
                  className="text-white/80 font-light leading-relaxed"
                  style={{ fontSize: "14px", maxWidth: "260px" }}
                >
                  {pillar.description}
                </p>
              </div>

              {/* Thin divider line between panels */}
              {i < PILLARS.length - 1 && (
                <div
                  className="absolute right-0 top-0 bottom-0 z-10"
                  style={{ width: "1px", background: "rgba(255,255,255,0.15)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile — vertical card stack */}
      <div className="md:hidden flex flex-col gap-4 px-6">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.number}
            className="relative overflow-hidden rounded-sm"
            style={{ height: "220px" }}
          >
            <img
              src={pillar.image}
              alt={pillar.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.2) 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6">
              <p
                className="text-white/50 font-light mb-1"
                style={{ fontSize: "10px", letterSpacing: "0.2em" }}
              >
                {pillar.number}
              </p>
              <h3 className="text-white font-bold tracking-wider uppercase mb-2 text-base">
                {pillar.title}
              </h3>
              <p className="text-white/75 font-light leading-relaxed text-sm">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
