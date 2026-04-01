import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { MapPin, Clock, Check, X, ChevronDown, Plus, Minus, MessageCircle, RotateCcw } from "lucide-react";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema, createTripSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useJourney } from "@/hooks/useSupabaseQuery";

/* ─── Static placeholder content ─────────────────────────────────── */

const PLACEHOLDER_DAYS = [
  {
    day: "Day 1",
    title: "Arrival & Sacred Welcome",
    subtitle: "Settle into the energy of the land",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80&fit=crop",
    description:
      "Arrive at your destination and be welcomed with a traditional ceremony. Your guide introduces the spiritual significance of the region — its history, its deities, and its living traditions. Evening satsang and group introductions set the tone for the journey ahead.",
    textLeft: false,
  },
  {
    day: "Day 2",
    title: "Dawn Rituals at the River",
    subtitle: "The sacred relationship with water",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80&fit=crop",
    description:
      "Rise before the sun and witness the morning aarti at the ghats. Understand how water is not merely a resource but a living deity in Indian philosophy. Afternoon: guided meditation and journaling by the banks.",
    textLeft: true,
  },
  {
    day: "Day 3",
    title: "Himalayan Temple Circuit",
    subtitle: "Seeking blessings at ancient shrines",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop",
    description:
      "A full day visiting three temples of distinct traditions — Shaivite, Vaishnavite, and Devi. Each stop includes guided darshan, mantra recitation, and a conversation with the resident priest about the temple's mythology and purpose.",
    textLeft: false,
  },
  {
    day: "Day 4",
    title: "Silence & Meditation Retreat",
    subtitle: "The practice of inner stillness",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&fit=crop",
    description:
      "A full day of maintained noble silence. Guided meditations at sunrise and sunset. Morning yoga nidra. Afternoon free time for walking in nature or resting. The silence is broken only at dinner for a group sharing circle.",
    textLeft: true,
  },
  {
    day: "Day 5",
    title: "Meeting the Teachers",
    subtitle: "Wisdom passed directly, human to human",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
    description:
      "Private and small-group audience with a local spiritual teacher. Questions are welcomed; depth is the goal. Afternoon session with a practitioner of an indigenous healing art — Ayurveda, Jyotish, or Vastu depending on your journey.",
    textLeft: false,
  },
  {
    day: "Day 6",
    title: "Sacred Pilgrimage Walk",
    subtitle: "The body as vehicle for the sacred",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fit=crop",
    description:
      "A 12 km pilgrimage walk on a historically significant trail. Walk in silence for the first half; the second half is walked in community — sharing insights and questions. Destination: a mountaintop viewpoint used for centuries as a place of prayer.",
    textLeft: true,
  },
  {
    day: "Day 7",
    title: "Integration & Departure",
    subtitle: "Carrying the journey home",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80&fit=crop",
    description:
      "Morning closing circle: each traveller shares one insight and one commitment they take home. A ritual of gratitude is performed together. After breakfast, departures begin. Your guide remains available for 30-day post-journey support.",
    textLeft: false,
  },
];

const OPTIONAL_ADDONS = [
  { id: "meditation", title: "7-Day Meditation Course with Tushita", description: "Subject to availability", standardPrice: 420, luxuryPrice: 420 },
  { id: "vipassana", title: "10-Day Vipassana Meditation", description: "Dana-based, enrollment required", standardPrice: 80, luxuryPrice: 80 },
  { id: "naturopathy", title: "Naturopathy Camp — 7 Days", description: "Panchakarma & Ayurvedic reset", standardPrice: 650, luxuryPrice: 950 },
];

const INCLUSIONS = [
  "Airport transfers (arrival & departure)",
  "All accommodation (standard or luxury)",
  "Daily breakfast and dinner",
  "All temple entrance fees",
  "Expert spiritual guide throughout",
  "Meditation & yoga sessions",
  "Sacred texts and reading list",
  "Post-journey 30-day guidance",
];

const EXCLUSIONS = [
  "International flights",
  "Travel insurance",
  "Personal shopping",
  "Lunches (unless noted)",
  "Optional add-on activities",
  "Visa fees",
];

const DAY_PRICE_STANDARD = 350; // per day
const DAY_PRICE_LUXURY = 530;   // per day

type Tab = "overview" | "itinerary" | "description";
type Tier = "standard" | "luxury";

/* ─── Animated price counter ─────────────────────────────────────── */
function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>${display.toLocaleString()}</span>;
}

/* ─── FlipCard ───────────────────────────────────────────────────── */
function FlipCard({
  day,
  excluded,
  onExclude,
}: {
  day: typeof PLACEHOLDER_DAYS[0];
  excluded: boolean;
  onExclude: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`relative transition-opacity duration-300 ${excluded ? "opacity-40" : "opacity-100"}`}
      style={{ perspective: "1000px", height: "300px" }}
    >
      {/* Exclude toggle button — top-left, above flip zone */}
      <button
        onClick={(e) => { e.stopPropagation(); onExclude(); }}
        title={excluded ? "Add back to trip" : "Remove from trip"}
        className={`absolute top-2 left-2 z-20 w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors shadow-md ${
          excluded ? "bg-[hsl(75,64%,49%)]" : "bg-black/40 hover:bg-red-500/80"
        }`}
      >
        {excluded ? <Plus className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      </button>

      {/* Flip zone */}
      <div
        className="w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.55s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={day.image} alt={day.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 pl-10">
            <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{day.day}</p>
            <h4 className="text-white font-bold text-sm leading-snug">{day.title}</h4>
            <p className="text-white/65 text-xs italic mt-0.5">{day.subtitle}</p>
          </div>
          <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
            <RotateCcw className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-[#1a1a2e] p-5 flex flex-col justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-[hsl(75,64%,60%)] text-xs tracking-widest uppercase mb-2">{day.day}</p>
          <h4 className="text-white font-bold text-sm mb-3">{day.title}</h4>
          <p className="text-white/75 text-xs leading-relaxed">{day.description}</p>
          <span className="mt-4 text-white/30 text-xs flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> flip back
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── TalkToUsForm modal ─────────────────────────────────────────── */
function TalkToUsForm({ journeyTitle, onClose }: { journeyTitle: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-auto p-8 shadow-2xl z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Talk to Us</h3>
        <p className="text-gray-500 text-sm mb-6">Tell us about your interest in <em>{journeyTitle}</em>.</p>
        <div className="space-y-4">
          <input type="text" placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(75,64%,49%)]" />
          <input type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(75,64%,49%)]" />
          <input type="tel" placeholder="Phone / WhatsApp (optional)" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(75,64%,49%)]" />
          <textarea rows={3} placeholder="What would you like to know?" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(75,64%,49%)] resize-none" />
          <button className="w-full brand-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">Send Message</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ReserveModal ───────────────────────────────────────────────── */
function ReserveModal({
  journeyTitle,
  tier,
  totalPrice,
  selectedDays,
  onClose,
}: {
  journeyTitle: string;
  tier: Tier;
  totalPrice: number;
  selectedDays: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg mx-auto p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Reserve Your Space</h3>
        <p className="text-gray-500 text-sm mb-5">Review your selection below.</p>

        <div className="bg-[#F7F2E8] rounded-xl p-5 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Journey</span>
            <span className="font-medium text-gray-900 text-right max-w-[60%]">{journeyTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tier</span>
            <span className="font-medium capitalize text-gray-900">{tier}</span>
          </div>
          <div className="h-px bg-gray-200 my-1" />
          {/* Selected days list */}
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1">Included Days</p>
          <ul className="space-y-1">
            {selectedDays.map((d) => (
              <li key={d} className="flex items-start gap-2 text-xs text-gray-700">
                <Check className="w-3.5 h-3.5 text-[hsl(75,64%,49%)] mt-0.5 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between text-base font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-[hsl(75,64%,39%)]">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-5 text-center leading-relaxed">
          We maintain quality of our local guides & ashram access — we only facilitate 10 individual journeys per month.
        </p>
        <button className="w-full brand-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition mb-3">
          Confirm & Pay Now
        </button>
        <p className="text-center text-xs text-gray-400">
          Have doubts?{" "}
          <button onClick={onClose} className="underline text-gray-600">Talk to us instead</button>
        </p>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function JourneyDetail() {
  const [, params] = useRoute("/journeys/:id");
  const journeyId = params?.id ? parseInt(params.id) : 0;
  const { data: journey, isLoading, error } = useJourney(journeyId);

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [tier, setTier] = useState<Tier>("standard");

  // Day selection: all included by default; toggling marks a day as excluded
  const [excludedDays, setExcludedDays] = useState<Set<string>>(new Set());

  // Optional add-ons
  const [activeAddons, setActiveAddons] = useState<Set<string>>(new Set());

  const [showReserve, setShowReserve] = useState(false);
  const [showTalkToUs, setShowTalkToUs] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Derived */
  const selectedDays = PLACEHOLDER_DAYS.filter((d) => !excludedDays.has(d.day));
  const dayPrice = tier === "standard" ? DAY_PRICE_STANDARD : DAY_PRICE_LUXURY;
  const addonTotal = OPTIONAL_ADDONS.filter((a) => activeAddons.has(a.id)).reduce(
    (sum, a) => sum + (tier === "standard" ? a.standardPrice : a.luxuryPrice),
    0
  );
  const totalPrice = selectedDays.length * dayPrice + addonTotal;

  const toggleDay = (dayKey: string) =>
    setExcludedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });

  const toggleAddon = (id: string) =>
    setActiveAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[hsl(75,64%,49%)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your sacred journey…</p>
        </div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Journey not found</h1>
            <p className="text-gray-500 mb-6">This journey may have moved or been updated.</p>
            <Link href="/sacred-journeys" className="brand-primary text-white px-6 py-3 rounded-lg font-semibold">
              Browse Sacred Journeys
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const journeyUrl = `https://www.thenirvanist.com/journeys/${journeyId}`;
  const journeyBreadcrumb = createBreadcrumbSchema([
    { name: "Home", url: "https://www.thenirvanist.com" },
    { name: "Sacred Journeys", url: "https://www.thenirvanist.com/sacred-journeys" },
    { name: journey.title },
  ]);
  const tripSchema = createTripSchema({
    name: journey.title,
    description: journey.description,
    image: journey.heroImage || journey.image,
    price: journey.price,
    duration: journey.duration,
    location: journey.location,
    available: journey.available ?? undefined,
    url: journeyUrl,
  });

  const heroImage = journey.heroImage || journey.image;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={`${journey.title} — Sacred Journey · The Nirvanist`}
        description={journey.description}
        ogImage={heroImage}
      />
      <SchemaOrg schema={[journeyBreadcrumb, tripSchema]} />
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex items-center justify-center bg-cover bg-center"
        style={{ height: "100vh", backgroundImage: `url('${heroImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/20" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="w-12 h-px bg-white/50 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.1em] uppercase mb-4 leading-tight">
            {journey.title}
          </h1>
          <div className="w-8 h-px bg-white/50 mx-auto mb-5" />
          <p className="text-white/80 text-lg md:text-xl italic font-light max-w-2xl mx-auto leading-relaxed">
            {journey.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-white/50 text-xs tracking-widest uppercase">
            <span>{journey.location}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{journey.duration}</span>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* ── Sticky tab strip ──────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex items-center">
          {(["overview", "itinerary", "description"] as Tab[]).map((tab, idx) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`relative px-5 py-4 text-sm font-medium tracking-wide transition-colors duration-200 ${
                activeTab === tab ? "text-[hsl(75,64%,39%)]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span className="text-gray-300 mr-2 font-light">{String(idx + 1).padStart(2, "0")}</span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(75,64%,49%)] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────── */}
      <div ref={contentRef} className="pb-36">

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">
            {/* Founder video */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Why We Chose This Route</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-2xl leading-relaxed">
                Spiritual travel is sold on <strong>trust</strong>, not itinerary points. Our founder explains in person why this specific route was curated and what makes it genuinely transformative.
              </p>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-black" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/ScMzIvxBSi4"
                  title="Founder's Journey Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Dates */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dates & Availability</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { month: "February 2026", status: "Available", spots: "4 spots left" },
                  { month: "April 2026", status: "Available", spots: "8 spots left" },
                  { month: "September 2026", status: "Open", spots: "10 spots left" },
                ].map((d) => (
                  <div key={d.month} className="border border-gray-100 rounded-xl p-5 bg-[#F7F2E8]">
                    <p className="font-semibold text-gray-900">{d.month}</p>
                    <p className="text-[hsl(75,64%,39%)] text-sm font-medium mt-1">{d.status}</p>
                    <p className="text-gray-500 text-xs mt-1">{d.spots}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Included</h3>
                  <ul className="space-y-3">
                    {(journey.inclusions?.length ? journey.inclusions : INCLUSIONS).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[hsl(75,64%,49%)] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Not Included</h3>
                  <ul className="space-y-3">
                    {EXCLUSIONS.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ITINERARY ─────────────────────────────────────────── */}
        {activeTab === "itinerary" && (
          <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">

            {/* Standard / Luxury toggle */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Click a card to read the description. Use the <X className="inline w-3 h-3" /> button to remove a day and see your price update.
                </p>
              </div>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm font-medium flex-shrink-0">
                <button
                  onClick={() => setTier("standard")}
                  className={`px-5 py-2.5 transition-colors ${tier === "standard" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setTier("luxury")}
                  className={`px-5 py-2.5 transition-colors ${tier === "luxury" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  Luxury
                </button>
              </div>
            </div>

            {/* Day cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PLACEHOLDER_DAYS.map((day) => (
                <FlipCard
                  key={day.day}
                  day={day}
                  excluded={excludedDays.has(day.day)}
                  onExclude={() => toggleDay(day.day)}
                />
              ))}
            </div>

            {excludedDays.size > 0 && (
              <p className="text-sm text-gray-400 text-center">
                {excludedDays.size} day{excludedDays.size > 1 ? "s" : ""} removed from your trip.{" "}
                <button
                  className="underline text-gray-600"
                  onClick={() => setExcludedDays(new Set())}
                >
                  Restore all
                </button>
              </p>
            )}

            {/* Optional add-ons */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add to Your Trip</h3>
              <p className="text-gray-500 text-sm mb-6">Select any optional experience to add it to your journey — price updates instantly.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {OPTIONAL_ADDONS.map((addon) => {
                  const isOn = activeAddons.has(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 ${
                        isOn ? "border-[hsl(75,64%,49%)] bg-[hsl(75,64%,97%)]" : "border-gray-100 bg-white opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900 text-sm leading-snug pr-3">{addon.title}</p>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOn ? "bg-[hsl(75,64%,49%)] text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {isOn ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs">{addon.description}</p>
                      <p className="text-[hsl(75,64%,39%)] font-semibold text-sm mt-2">
                        +${(tier === "standard" ? addon.standardPrice : addon.luxuryPrice).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setShowReserve(true)}
                className="mt-6 brand-primary text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition"
              >
                Reserve Your Space →
              </button>
            </div>
          </div>
        )}

        {/* ── DESCRIPTION ───────────────────────────────────────── */}
        {activeTab === "description" && (
          <div className="max-w-5xl mx-auto px-6 py-14 space-y-20">
            {PLACEHOLDER_DAYS.map((day, i) => (
              <div key={day.day} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {day.textLeft ? (
                  <>
                    <div>
                      <p className="text-xs text-[hsl(75,64%,39%)] uppercase tracking-widest font-semibold mb-2">{day.day}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{day.title}</h3>
                      <p className="text-gray-400 italic text-sm mb-4">{day.subtitle}</p>
                      <p className="text-gray-600 leading-relaxed">{day.description}</p>
                    </div>
                    <div className="rounded-2xl overflow-hidden h-72 shadow-md">
                      <img src={day.image} alt={day.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl overflow-hidden h-72 shadow-md">
                      <img src={day.image} alt={day.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <p className="text-xs text-[hsl(75,64%,39%)] uppercase tracking-widest font-semibold mb-2">{day.day}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{day.title}</h3>
                      <p className="text-gray-400 italic text-sm mb-4">{day.subtitle}</p>
                      <p className="text-gray-600 leading-relaxed">{day.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Fixed bottom CTA strip ────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Selected days summary + price */}
          <div className="flex items-start gap-6 min-w-0">
            {/* Day list */}
            <div className="hidden lg:block min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your itinerary</p>
              <p className="text-xs text-gray-600 leading-relaxed truncate max-w-xs">
                {selectedDays.length === 0
                  ? "No days selected"
                  : selectedDays.map((d) => d.day).join(" · ")}
              </p>
            </div>
            {/* Price */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                {tier === "standard" ? "Standard" : "Luxury"} · {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""}
                {activeAddons.size > 0 && ` + ${activeAddons.size} add-on${activeAddons.size > 1 ? "s" : ""}`}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                <AnimatedPrice value={totalPrice} />
                <span className="text-sm font-normal text-gray-400 ml-1">per person</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowTalkToUs(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Talk to us</span>
            </button>
            <button
              onClick={() => setShowReserve(true)}
              className="brand-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition text-sm"
            >
              Reserve Your Space
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      {showReserve && (
        <ReserveModal
          journeyTitle={journey.title}
          tier={tier}
          totalPrice={totalPrice}
          selectedDays={selectedDays.map((d) => `${d.day}: ${d.title}`)}
          onClose={() => setShowReserve(false)}
        />
      )}
      {showTalkToUs && (
        <TalkToUsForm journeyTitle={journey.title} onClose={() => setShowTalkToUs(false)} />
      )}

      <Footer />
    </div>
  );
}
