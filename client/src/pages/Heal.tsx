import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HealWorldMap from "@/components/HealWorldMap";
import { useHealTestimonials, useHealDonors, useTransparencyLedger } from "@/hooks/useSupabaseQuery";

import {
  Heart,
  Eye,
  ThumbsUp,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  CreditCard,
  X,
} from "lucide-react";

// ─── Typed API response shapes ────────────────────────────────────────────────

interface HealStats {
  totalReach: number | string;
  totalReactions: number | string;
  totalShares: number | string;
  totalComments: number | string;
}

interface HealLeaderboardRow {
  rank: number;
  donorName: string;
  totalAmount: number | string;
  totalReach: number | string;
}

// ─── Country list ─────────────────────────────────────────────────────────────
// Blacklisted countries are excluded — they are NOT available for campaigns.
// (Afghanistan, Iran, Pakistan, Saudi Arabia, Somalia, Yemen, North Korea, China,
//  Maldives, Mauritania, Eritrea, Sudan, Libya)
const COUNTRY_LIST = [
  "Worldwide",
  "Albania","Algeria","Angola","Argentina","Armenia","Australia","Azerbaijan",
  "Bahamas","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia & Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
  "Burundi","Cambodia","Cameroon","Canada","Central African Republic","Chad",
  "Chile","Colombia","Republic of Congo","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Djibouti","Dominican Republic","DR Congo","Ecuador",
  "Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Fiji","Finland",
  "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Greenland",
  "Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iraq","Ireland","Israel","Italy","Ivory Coast",
  "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos",
  "Latvia","Lebanon","Lesotho","Liberia","Lithuania","Luxembourg","Madagascar",
  "Malawi","Malaysia","Mali","Mexico","Moldova","Mongolia","Montenegro","Morocco",
  "Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","Nigeria","North Macedonia","Norway","Oman","Palestine","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Puerto Rico","Qatar","Romania","Russia","Rwanda","Senegal","Serbia",
  "Sierra Leone","Slovakia","Slovenia","Solomon Islands","South Africa",
  "South Korea","South Sudan","Spain","Sri Lanka","Suriname","Sweden",
  "Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste",
  "Togo","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Venezuela","Vietnam","Zambia","Zimbabwe",
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Priya Sharma", loc: "Mumbai, India", text: "I dedicated a campaign to my late mother. Within days I received messages from people in Sudan saying these quotes brought them peace. There are no words." },
  { name: "James O.", loc: "London, UK", text: "Sponsoring content into conflict zones felt like sending light into darkness. The transparency ledger showed real reach — 84,000 people in one week." },
  { name: "Aisha Khalid", loc: "Toronto, Canada", text: "The world map made it visceral. Clicking on Yemen and knowing my $25 would reach real families changed something in me." },
  { name: "Martin Díaz", loc: "Buenos Aires, Argentina", text: "I had never thought of advertising as an act of compassion. The Nirvanist reframed everything for me." },
  { name: "Yuki Tanaka", loc: "Tokyo, Japan", text: "Beautifully designed and deeply purposeful. My monthly campaign has reached over 200,000 souls so far." },
  { name: "Fatima El-Hassan", loc: "Cairo, Egypt", text: "Simple, powerful, honest. I can see exactly where my money goes and who it reaches. This is real accountability." },
  { name: "David Chen", loc: "Singapore", text: "The Nichiren quote on their page stopped me cold. I signed up immediately. Best $50 I've ever spent." },
];

// ─── How it Works ─────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { n: "01", title: "Choose Your Content", desc: "Select a spiritual quote from our curated library or submit a URL to an article you believe carries wisdom worth sharing." },
  { n: "02", title: "Pick Your Region", desc: "Use our interactive map to select the countries you want to reach — from active conflict zones to economically vulnerable regions." },
  { n: "03", title: "Set Your Duration & Budget", desc: "Choose how long the campaign runs and how much you want to invest. Even $10 can reach thousands." },
  { n: "04", title: "Dedicate Your Campaign", desc: "Optionally dedicate your campaign to someone — a loved one, a cause, or simply your aspiration for a more peaceful world." },
  { n: "05", title: "We Do the Rest", desc: "Our team manages the Meta Ad placements, optimising for genuine reach in your chosen region and content type." },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
const fmt = (n: number | string) => {
  const num = Number(n);
  if (isNaN(num)) return "—";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
  return String(num);
};

// ─── Form state type ──────────────────────────────────────────────────────────
interface FormData {
  contentType: "quotes" | "article";
  contentUrl: string;
  contentTitle: string;
  countries: string[];
  duration: string;
  budgetUsd: number | "Custom";
  customBudget: string;
  customDuration: string;
  coverFee: boolean;
  tipPercent: number | "Custom" | "None";
  customTip: string;
  donorName: string;
  email: string;
  dedication: string;
  anonymous: boolean;
}

const INITIAL_FORM: FormData = {
  contentType: "quotes",
  contentUrl: "",
  contentTitle: "",
  countries: ["Worldwide"],
  duration: "1 Month",
  budgetUsd: 15,
  customBudget: "",
  customDuration: "",
  coverFee: false,
  tipPercent: 10,
  customTip: "",
  donorName: "",
  email: "",
  dedication: "",
  anonymous: false,
};

const STEPS = [
  "Content Type",
  "Location",
  "Duration",
  "Budget",
  "Attribution",
  "Platform Tip",
  "Payment",
];

// ─── Donate mutation payload ──────────────────────────────────────────────────
interface DonateMutationInput {
  donorName: string;
  email: string;
  contentType: "quotes" | "article";
  contentUrl: string | null;
  contentTitle: string | null;
  countries: string[];
  duration: string;
  budgetUsd: number;
  dedication: string | null;
  anonymous: boolean;
}

export default function Heal() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [countrySearch, setCountrySearch] = useState("");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [hallSearch, setHallSearch] = useState("");
  const [ledgerYear, setLedgerYear] = useState(() => String(new Date().getFullYear()));

  // Queries
  const { data: stats } = useQuery<HealStats>({
    queryKey: ["/api/heal/stats"],
  });

  const { data: supabaseTestimonials = [] } = useHealTestimonials();
  const { data: supabaseDonors = [] } = useHealDonors();
  const { data: ledgerRows = [] } = useTransparencyLedger();

  // Donate mutation
  const donateMutation = useMutation({
    mutationFn: async (data: DonateMutationInput) => {
      const res = await fetch("/api/heal/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed" }));
        throw new Error((err as { message: string }).message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Thank you! Your campaign has been submitted.", description: "We'll begin your campaign within 24 hours." });
      qc.invalidateQueries({ queryKey: ["/api/heal/donations"] });
      qc.invalidateQueries({ queryKey: ["/api/heal/leaderboard"] });
      qc.invalidateQueries({ queryKey: ["/api/heal/stats"] });
      setForm(INITIAL_FORM);
      setStep(0);
    },
    onError: (err: Error) => {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    },
  });

  // Derived display data — Supabase data takes priority; falls back to static
  const displayTestimonials = supabaseTestimonials.length > 0
    ? supabaseTestimonials.map((t) => ({ name: t.clientName, loc: t.country, text: t.testimonial, quote: t.quote }))
    : TESTIMONIALS.map((t) => ({ ...t, quote: undefined }));

  const filteredDonors = supabaseDonors.filter((d) =>
    !hallSearch || d.donorName.toLowerCase().includes(hallSearch.toLowerCase())
  );

  // Testimonial auto-slide
  useEffect(() => {
    const max = Math.max(displayTestimonials.length - 3, 1);
    const id = setInterval(() => setTestimonialIdx((i) => (i + 1 >= max ? 0 : i + 1)), 3000);
    return () => clearInterval(id);
  }, [displayTestimonials.length]);

  const handleMapClick = (countryName: string) => {
    if (!form.countries.includes(countryName)) {
      setForm((f) => ({ ...f, countries: [...f.countries, countryName] }));
    }
    setStep(1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCountry = (c: string) =>
    setForm((f) => ({
      ...f,
      countries: f.countries.includes(c)
        ? f.countries.filter((x) => x !== c)
        : [...f.countries, c],
    }));

  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const canProceed = () => {
    if (step === 1 && form.countries.length === 0) return false;
    if (step === 2 && form.duration === "Custom" && !form.customDuration.trim()) return false;
    if (step === 3 && form.budgetUsd === "Custom" && (!form.customBudget || Number(form.customBudget) < 1)) return false;
    if (step === 4 && !form.anonymous && !form.donorName.trim()) return false;
    if (step === 4 && !form.email.trim()) return false;
    return true;
  };

  const resolvedBudget = (): number => {
    const base = form.budgetUsd === "Custom" ? Number(form.customBudget) || 0 : Number(form.budgetUsd);
    const withFee = form.coverFee ? base * 1.04 : base;
    if (form.tipPercent === "None") return Math.round(withFee * 100) / 100;
    if (form.tipPercent === "Custom") {
      const tipAmt = Number(form.customTip) || 0;
      return Math.round((withFee + tipAmt) * 100) / 100;
    }
    return Math.round(withFee * (1 + form.tipPercent / 100) * 100) / 100;
  };

  const resolvedDuration = (): string =>
    form.duration === "Custom" ? form.customDuration : form.duration;

  const handleSubmit = () => {
    donateMutation.mutate({
      donorName: form.anonymous ? "Anonymous" : form.donorName,
      email: form.email,
      contentType: form.contentType,
      contentUrl: form.contentUrl || null,
      contentTitle: form.contentTitle || null,
      countries: form.countries,
      duration: resolvedDuration(),
      budgetUsd: resolvedBudget(),
      dedication: form.dedication || null,
      anonymous: form.anonymous,
    });
  };

  const statItems: { icon: React.ElementType; label: string; subtitle: string; value: number | string | undefined }[] = [
    { icon: Eye, label: "People Reached", subtitle: "Total individuals who saw the message in their feed", value: stats?.totalReach },
    { icon: ThumbsUp, label: "Likes", subtitle: "Number of likes from viewers who resonated", value: stats?.totalReactions },
    { icon: Share2, label: "Shares", subtitle: "Number of times promoted content was reshared by viewers", value: stats?.totalShares },
    { icon: MessageCircle, label: "Comments", subtitle: "Total number of positive comments and reflections", value: stats?.totalComments },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── HERO: Global Peace Grid ── */}
      <section className="relative min-h-screen flex flex-col pt-20" style={{ background: "#0a1a0a" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />
        </div>

        <div className="relative z-20 text-center pt-10 pb-4 px-6">
          <p className="text-[#a3cc2a] uppercase tracking-[0.25em] text-xs mb-3 font-light">
            The Global Peace Project
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight max-w-3xl mx-auto">
            Help Us Heal<br />The World
          </h1>
          <p className="text-white mt-5 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            Promote spiritual content through Meta Ads in conflict zones or region of your choice.{" "}
            <span className="text-[#a3cc2a] font-semibold">Click a country to begin.</span>
          </p>
        </div>

        <div className="relative flex-1 px-2 sm:px-6 pb-4" style={{ minHeight: "420px" }}>
          <HealWorldMap onCountryClick={handleMapClick} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#4a7c10] text-white py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map(({ icon: Icon, label, subtitle, value }) => (
            <div key={label} className="text-center">
              <Icon className="w-6 h-6 mx-auto mb-2 text-[#c8f088]" />
              <div className="text-3xl md:text-4xl font-serif font-light">
                {value != null ? fmt(value) : "—"}
              </div>
              <div className="text-xs uppercase tracking-widest mt-1 text-[#c8f088]">{label}</div>
              <div className="text-[10px] mt-1 text-white/60 italic leading-tight max-w-[160px] mx-auto">{subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#F7F2E8] py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayTestimonials.slice(testimonialIdx, testimonialIdx + 4).map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="bg-white rounded-xl p-5 shadow-sm border border-[#e8e0d0]">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.loc}</div>
                  {t.quote && <p className="text-xs text-gray-400 italic mt-1">{t.quote}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NARRATIVE ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#4a7c10] mb-4">Why Heal</p>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">
              Our world needs words of compassion and solace more than ever before.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Conflict, economic pressure, and social fracture have left millions without access to
              the wisdom traditions that have guided humanity for millennia. The Nirvanist believes
              that a single verse, delivered at the right moment, can change a life.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Through the precision of digital advertising and the universality of spiritual teaching,
              we bring these moments to regions that need them most.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By ensuring words of hope and courage reach those in the greatest need, we cease to be
              spectators and become active participants in the global tide of peace and love.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#4a7c10] mb-6">How It Works</p>
            <div className="space-y-5">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div className="text-2xl font-serif text-[#a3cc2a] leading-none mt-1 w-8 flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{s.title}</div>
                    <div className="text-gray-500 text-sm leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NICHIREN QUOTE STRIP ── */}
      <section className="bg-[#1a2e0a] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed italic">
            "If you light a lamp for someone, it will also brighten your path."
          </p>
          <p className="text-[#a3cc2a] mt-4 text-sm tracking-widest uppercase">
            — Nichiren Daishonin
          </p>
        </div>
      </section>

      {/* ── MULTI-STEP FORM ── */}
      <section ref={formRef} className="bg-[#F7F2E8] py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#4a7c10] mb-2">Start Your Campaign</p>
            <h2 className="text-3xl font-serif text-gray-900">Gift A Moment Of Solace</h2>
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
              100% of the funds we receive go directly towards promotion of spiritual content.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 px-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    i < step
                      ? "bg-[#4a7c10] text-white"
                      : i === step
                      ? "bg-[#a3cc2a] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < step ? "bg-[#4a7c10]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mb-6 -mt-2 uppercase tracking-wider">
            Step {step + 1}: {STEPS[step]}
          </p>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-md p-8">

            {/* Step 1: Content Type */}
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-gray-900 mb-4">What content would you like to sponsor?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(["quotes", "article"] as const).map((ct) => (
                    <button
                      key={ct}
                      onClick={() => setForm((f) => ({ ...f, contentType: ct }))}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        form.contentType === ct
                          ? "border-[#4a7c10] bg-[#f0f8e8]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900 mb-1">
                        {ct === "quotes" ? "Spiritual Quotes" : "Spiritual Article"}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {ct === "quotes"
                          ? "Curated quotes from our 'Insights' library"
                          : "An article or teaching from our 'Insights' library"}
                      </div>
                    </button>
                  ))}
                </div>
                {form.contentType === "article" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Article URL</label>
                      <input
                        type="url"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                        placeholder="https://..."
                        value={form.contentUrl}
                        onChange={(e) => setForm((f) => ({ ...f, contentUrl: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span>— OR —</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                        placeholder="Title of the article or teaching"
                        value={form.contentTitle}
                        onChange={(e) => setForm((f) => ({ ...f, contentTitle: e.target.value }))}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Please select an article from our{" "}
                      <a href="/insights" className="text-[#4a7c10] underline underline-offset-2 hover:text-[#3d6a0d]">
                        Insights page
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-gray-900">Which regions do you want to reach?</h3>
                <p className="text-gray-500 text-sm">Click the map above or search below. Select multiple.</p>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>
                {form.countries.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.countries.map((c) => (
                      <span key={c} className="flex items-center gap-1 bg-[#f0f8e8] border border-[#a3cc2a] rounded-full px-3 py-1 text-xs">
                        {c}
                        <button onClick={() => toggleCountry(c)} className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y">
                  {filteredCountries.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleCountry(c)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        form.countries.includes(c)
                          ? "bg-[#f0f8e8] text-[#4a7c10] font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {form.countries.includes(c) ? "✓ " : ""}{c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Duration */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-gray-900">How long should the campaign run?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["3 Days", "7 Days", "1 Month", "3 Months", "Custom"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm((f) => ({ ...f, duration: d }))}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.duration === d
                          ? "border-[#4a7c10] bg-[#f0f8e8] text-[#4a7c10]"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {form.duration === "Custom" && (
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                    placeholder="e.g. 2 weeks"
                    value={form.customDuration}
                    onChange={(e) => setForm((f) => ({ ...f, customDuration: e.target.value }))}
                  />
                )}
                <p className="text-gray-400 text-xs italic">
                  For maximum effectiveness we recommend a minimum of $5 a day.
                </p>
              </div>
            )}

            {/* Step 4: Budget */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-gray-900">What is your budget?</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {([15, 35, 150, 450, "Custom"] as const).map((b) => (
                    <button
                      key={String(b)}
                      onClick={() => setForm((f) => ({ ...f, budgetUsd: b }))}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.budgetUsd === b
                          ? "border-[#4a7c10] bg-[#f0f8e8] text-[#4a7c10]"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {typeof b === "number" ? `$${b}` : b}
                    </button>
                  ))}
                </div>
                {form.budgetUsd === "Custom" && (
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                      placeholder="Enter amount"
                      value={form.customBudget}
                      onChange={(e) => setForm((f) => ({ ...f, customBudget: e.target.value }))}
                    />
                  </div>
                )}
                <label className="flex items-start gap-3 cursor-pointer bg-[#f7faf0] border border-[#c8e88a] rounded-xl px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.coverFee}
                    onChange={(e) => setForm((f) => ({ ...f, coverFee: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-[#4a7c10] flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    Cover the 4% bank processing fee so my impact is 100%.
                  </span>
                </label>
                <p className="text-gray-400 text-xs">
                  Based on regional CPMs, $25 can reach approximately{" "}
                  <strong className="text-[#4a7c10]">50,000–80,000 people</strong> in high-need areas.
                </p>
              </div>
            )}

            {/* Step 5: Attribution */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-gray-900">Who is this campaign from?</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
                    className="w-4 h-4 accent-[#4a7c10]"
                  />
                  <span className="text-sm text-gray-700">Make this campaign anonymous</span>
                </label>
                {!form.anonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                      placeholder="Full name"
                      value={form.donorName}
                      onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dedication <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a] resize-none"
                    rows={3}
                    placeholder="In memory of… / In honour of… / For…"
                    value={form.dedication}
                    onChange={(e) => setForm((f) => ({ ...f, dedication: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 6: Platform Tip */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-xl text-gray-900">Add a small tip</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Add a small tip to co-invest with The Nirvanist in growing the platform. The amount goes towards technical maintenance and adding content.
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {([5, 10, 15, "Custom", "None"] as const).map((t) => (
                    <button
                      key={String(t)}
                      onClick={() => setForm((f) => ({ ...f, tipPercent: t }))}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.tipPercent === t
                          ? "border-[#4a7c10] bg-[#f0f8e8] text-[#4a7c10]"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      {typeof t === "number" ? `${t}%` : t === "None" ? "No Tip" : t}
                    </button>
                  ))}
                </div>
                {form.tipPercent === "Custom" && (
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a3cc2a]"
                      placeholder="Enter tip amount"
                      value={form.customTip}
                      onChange={(e) => setForm((f) => ({ ...f, customTip: e.target.value }))}
                    />
                  </div>
                )}
                {form.tipPercent !== "None" && (
                  <p className="text-xs text-[#4a7c10]">
                    Your total will be <strong>${resolvedBudget().toFixed(2)}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Step 7: Payment */}
            {step === 6 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl text-gray-900">Complete Your Contribution</h3>
                <div className="bg-[#f0f8e8] rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Content</span>
                    <span className="font-medium">{form.contentType === "quotes" ? "Spiritual Quotes" : "Spiritual Article"}</span>
                  </div>
                  {form.contentTitle && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title</span>
                      <span className="font-medium text-right max-w-[60%]">{form.contentTitle}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries</span>
                    <span className="font-medium">{form.countries.join(", ") || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{resolvedDuration()}</span>
                  </div>
                  {form.coverFee && (
                    <div className="flex justify-between text-gray-500">
                      <span>Processing fee (4%)</span>
                      <span>included</span>
                    </div>
                  )}
                  {form.tipPercent !== "None" && (
                    <div className="flex justify-between text-gray-500">
                      <span>Platform tip</span>
                      <span>
                        {form.tipPercent === "Custom"
                          ? `$${Number(form.customTip || 0).toFixed(2)}`
                          : `${form.tipPercent}%`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="font-bold text-[#4a7c10]">
                      ${resolvedBudget().toFixed(2) || "—"}
                    </span>
                  </div>
                </div>

                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-1">Secure payment via Stripe / PayPal</p>
                  <p className="text-gray-300 text-xs">Payment integration coming soon — submitting will reserve your campaign.</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={donateMutation.isPending}
                  className="w-full bg-[#4a7c10] hover:bg-[#3d6a0d] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  {donateMutation.isPending ? "Submitting…" : "Submit My Campaign"}
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {step < STEPS.length - 1 && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-1 bg-[#4a7c10] hover:bg-[#3d6a0d] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY LEDGER ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#4a7c10] mb-2">Full Accountability</p>
              <h2 className="text-3xl font-serif text-gray-900">Transparency Ledger</h2>
              <p className="text-gray-500 mt-2 text-sm">Every campaign, every result — nothing hidden.</p>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm self-start sm:self-auto">
              <label htmlFor="ledgerYearFilter" className="text-gray-500 text-xs whitespace-nowrap">Filter by Year</label>
              <select
                id="ledgerYearFilter"
                value={ledgerYear}
                onChange={(e) => setLedgerYear(e.target.value)}
                className="focus:outline-none text-gray-700 bg-transparent cursor-pointer"
              >
                {["2024", "2025", "2026"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scrollable table wrapper */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto relative">
                <table className="w-full text-sm">
                  <thead className="bg-[#f8f5f0] sticky top-0 z-10">
                    <tr>
                      {["Month", "People Reached", "Engagement", "Countries", "Donors", "Total Budget"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(() => {
                      const filtered = ledgerRows.filter((r) => r.monthYear?.includes(ledgerYear));
                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                              No data available for {ledgerYear}.
                            </td>
                          </tr>
                        );
                      }
                      return filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700 font-medium">{r.monthYear}</td>
                          <td className="px-4 py-3 text-[#4a7c10] font-medium">{fmt(r.peopleReached)}</td>
                          <td className="px-4 py-3 text-gray-600">{fmt(r.engagement)}</td>
                          <td className="px-4 py-3 text-gray-600">{r.countries}</td>
                          <td className="px-4 py-3 text-gray-600">{r.donors}</td>
                          <td className="px-4 py-3 text-gray-600">${r.totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Sticky total row — always visible outside the scroll container */}
            {(() => {
              const filtered = ledgerRows.filter((r) => r.monthYear?.includes(ledgerYear));
              const totalPeople = filtered.reduce((s, r) => s + r.peopleReached, 0);
              const totalEngagement = filtered.reduce((s, r) => s + r.engagement, 0);
              const totalBudget = filtered.reduce((s, r) => s + r.totalBudget, 0);
              return (
                <div className="border-t-2 border-[#a3cc2a] bg-[#f0f8e8]">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 font-bold text-gray-900 text-xs uppercase tracking-wider">Total</td>
                        <td className="px-4 py-3 font-bold text-[#4a7c10]">{fmt(totalPeople)}</td>
                        <td className="px-4 py-3 font-bold text-gray-700">{fmt(totalEngagement)}</td>
                        <td className="px-4 py-3 text-gray-400">—</td>
                        <td className="px-4 py-3 text-gray-400">—</td>
                        <td className="px-4 py-3 font-bold text-gray-700">${totalBudget.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── DONOR HALL OF GRACE ── */}
      <section className="bg-[#F7F2E8] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-[#4a7c10] mb-2">Our Greatest Healers</p>
            <h2 className="text-3xl font-serif text-gray-900">Donor Hall of Grace</h2>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm mb-6 max-w-xs">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donor..."
              value={hallSearch}
              onChange={(e) => setHallSearch(e.target.value)}
              className="flex-1 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e8e0d0]">
            <table className="w-full text-sm bg-white">
              <thead className="bg-[#f0f8e8]">
                <tr>
                  {["Rank", "Donor", "Total Contributed (USD)", "Souls Reached"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-[#4a7c10] text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                      Be the first to enter the Hall of Grace.
                    </td>
                  </tr>
                ) : (
                  filteredDonors.map((d) => (
                    <tr key={d.id} className="hover:bg-[#fafdf5] transition-colors">
                      <td className="px-5 py-3">
                        {d.rank <= 3 ? (
                          <span className={`font-bold text-lg ${d.rank === 1 ? "text-yellow-500" : d.rank === 2 ? "text-gray-400" : "text-amber-600"}`}>
                            #{d.rank}
                          </span>
                        ) : (
                          <span className="text-gray-400">#{d.rank}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">{d.donorName}</td>
                      <td className="px-5 py-3 text-[#4a7c10] font-semibold">${Number(d.totalContributed).toFixed(2)}</td>
                      <td className="px-5 py-3 text-gray-700">{fmt(d.soulsReached)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
