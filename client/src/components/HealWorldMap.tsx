import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { feature as topoFeature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry, Position } from "geojson";
import worldAtlasRaw from "world-atlas/countries-50m.json";

// Typed boundary cast for the world-atlas JSON module (see world-atlas.d.ts).
interface WorldAtlasTopology extends Topology<{
  countries: GeometryCollection;
  land: GeometryCollection;
}> {}
const WORLD_ATLAS = worldAtlasRaw as WorldAtlasTopology;

// ── ISO 3166-1 numeric → alpha-2 lookup ──────────────────────────────────────
const ISO_LOOKUP: Record<string, { alpha2: string; name: string }> = {
  "004":{ alpha2:"AF", name:"Afghanistan" },
  "008":{ alpha2:"AL", name:"Albania" },
  "012":{ alpha2:"DZ", name:"Algeria" },
  "024":{ alpha2:"AO", name:"Angola" },
  "031":{ alpha2:"AZ", name:"Azerbaijan" },
  "032":{ alpha2:"AR", name:"Argentina" },
  "036":{ alpha2:"AU", name:"Australia" },
  "040":{ alpha2:"AT", name:"Austria" },
  "044":{ alpha2:"BS", name:"Bahamas" },
  "050":{ alpha2:"BD", name:"Bangladesh" },
  "051":{ alpha2:"AM", name:"Armenia" },
  "056":{ alpha2:"BE", name:"Belgium" },
  "064":{ alpha2:"BT", name:"Bhutan" },
  "068":{ alpha2:"BO", name:"Bolivia" },
  "070":{ alpha2:"BA", name:"Bosnia & Herzegovina" },
  "072":{ alpha2:"BW", name:"Botswana" },
  "076":{ alpha2:"BR", name:"Brazil" },
  "084":{ alpha2:"BZ", name:"Belize" },
  "090":{ alpha2:"SB", name:"Solomon Islands" },
  "096":{ alpha2:"BN", name:"Brunei" },
  "100":{ alpha2:"BG", name:"Bulgaria" },
  "104":{ alpha2:"MM", name:"Myanmar" },
  "108":{ alpha2:"BI", name:"Burundi" },
  "112":{ alpha2:"BY", name:"Belarus" },
  "116":{ alpha2:"KH", name:"Cambodia" },
  "120":{ alpha2:"CM", name:"Cameroon" },
  "124":{ alpha2:"CA", name:"Canada" },
  "140":{ alpha2:"CF", name:"Cent. African Republic" },
  "144":{ alpha2:"LK", name:"Sri Lanka" },
  "148":{ alpha2:"TD", name:"Chad" },
  "152":{ alpha2:"CL", name:"Chile" },
  "156":{ alpha2:"CN", name:"China" },
  "158":{ alpha2:"TW", name:"Taiwan" },
  "170":{ alpha2:"CO", name:"Colombia" },
  "178":{ alpha2:"CG", name:"Republic of Congo" },
  "180":{ alpha2:"CD", name:"DR Congo" },
  "188":{ alpha2:"CR", name:"Costa Rica" },
  "191":{ alpha2:"HR", name:"Croatia" },
  "192":{ alpha2:"CU", name:"Cuba" },
  "196":{ alpha2:"CY", name:"Cyprus" },
  "203":{ alpha2:"CZ", name:"Czech Republic" },
  "204":{ alpha2:"BJ", name:"Benin" },
  "208":{ alpha2:"DK", name:"Denmark" },
  "214":{ alpha2:"DO", name:"Dominican Republic" },
  "218":{ alpha2:"EC", name:"Ecuador" },
  "222":{ alpha2:"SV", name:"El Salvador" },
  "226":{ alpha2:"GQ", name:"Equatorial Guinea" },
  "231":{ alpha2:"ET", name:"Ethiopia" },
  "232":{ alpha2:"ER", name:"Eritrea" },
  "233":{ alpha2:"EE", name:"Estonia" },
  "238":{ alpha2:"FK", name:"Falkland Islands" },
  "242":{ alpha2:"FJ", name:"Fiji" },
  "246":{ alpha2:"FI", name:"Finland" },
  "250":{ alpha2:"FR", name:"France" },
  "260":{ alpha2:"TF", name:"French S. Territories" },
  "262":{ alpha2:"DJ", name:"Djibouti" },
  "266":{ alpha2:"GA", name:"Gabon" },
  "268":{ alpha2:"GE", name:"Georgia" },
  "270":{ alpha2:"GM", name:"Gambia" },
  "275":{ alpha2:"PS", name:"Palestine" },
  "276":{ alpha2:"DE", name:"Germany" },
  "288":{ alpha2:"GH", name:"Ghana" },
  "300":{ alpha2:"GR", name:"Greece" },
  "304":{ alpha2:"GL", name:"Greenland" },
  "320":{ alpha2:"GT", name:"Guatemala" },
  "324":{ alpha2:"GN", name:"Guinea" },
  "328":{ alpha2:"GY", name:"Guyana" },
  "332":{ alpha2:"HT", name:"Haiti" },
  "340":{ alpha2:"HN", name:"Honduras" },
  "348":{ alpha2:"HU", name:"Hungary" },
  "352":{ alpha2:"IS", name:"Iceland" },
  "356":{ alpha2:"IN", name:"India" },
  "360":{ alpha2:"ID", name:"Indonesia" },
  "364":{ alpha2:"IR", name:"Iran" },
  "368":{ alpha2:"IQ", name:"Iraq" },
  "372":{ alpha2:"IE", name:"Ireland" },
  "376":{ alpha2:"IL", name:"Israel" },
  "380":{ alpha2:"IT", name:"Italy" },
  "384":{ alpha2:"CI", name:"Ivory Coast" },
  "388":{ alpha2:"JM", name:"Jamaica" },
  "392":{ alpha2:"JP", name:"Japan" },
  "398":{ alpha2:"KZ", name:"Kazakhstan" },
  "400":{ alpha2:"JO", name:"Jordan" },
  "404":{ alpha2:"KE", name:"Kenya" },
  "408":{ alpha2:"KP", name:"North Korea" },
  "410":{ alpha2:"KR", name:"South Korea" },
  "414":{ alpha2:"KW", name:"Kuwait" },
  "417":{ alpha2:"KG", name:"Kyrgyzstan" },
  "418":{ alpha2:"LA", name:"Laos" },
  "422":{ alpha2:"LB", name:"Lebanon" },
  "426":{ alpha2:"LS", name:"Lesotho" },
  "428":{ alpha2:"LV", name:"Latvia" },
  "430":{ alpha2:"LR", name:"Liberia" },
  "434":{ alpha2:"LY", name:"Libya" },
  "440":{ alpha2:"LT", name:"Lithuania" },
  "442":{ alpha2:"LU", name:"Luxembourg" },
  "450":{ alpha2:"MG", name:"Madagascar" },
  "454":{ alpha2:"MW", name:"Malawi" },
  "458":{ alpha2:"MY", name:"Malaysia" },
  "466":{ alpha2:"ML", name:"Mali" },
  "478":{ alpha2:"MR", name:"Mauritania" },
  "484":{ alpha2:"MX", name:"Mexico" },
  "496":{ alpha2:"MN", name:"Mongolia" },
  "498":{ alpha2:"MD", name:"Moldova" },
  "499":{ alpha2:"ME", name:"Montenegro" },
  "504":{ alpha2:"MA", name:"Morocco" },
  "508":{ alpha2:"MZ", name:"Mozambique" },
  "512":{ alpha2:"OM", name:"Oman" },
  "516":{ alpha2:"NA", name:"Namibia" },
  "524":{ alpha2:"NP", name:"Nepal" },
  "528":{ alpha2:"NL", name:"Netherlands" },
  "540":{ alpha2:"NC", name:"New Caledonia" },
  "548":{ alpha2:"VU", name:"Vanuatu" },
  "554":{ alpha2:"NZ", name:"New Zealand" },
  "558":{ alpha2:"NI", name:"Nicaragua" },
  "562":{ alpha2:"NE", name:"Niger" },
  "566":{ alpha2:"NG", name:"Nigeria" },
  "578":{ alpha2:"NO", name:"Norway" },
  "586":{ alpha2:"PK", name:"Pakistan" },
  "591":{ alpha2:"PA", name:"Panama" },
  "598":{ alpha2:"PG", name:"Papua New Guinea" },
  "600":{ alpha2:"PY", name:"Paraguay" },
  "604":{ alpha2:"PE", name:"Peru" },
  "608":{ alpha2:"PH", name:"Philippines" },
  "616":{ alpha2:"PL", name:"Poland" },
  "620":{ alpha2:"PT", name:"Portugal" },
  "624":{ alpha2:"GW", name:"Guinea-Bissau" },
  "626":{ alpha2:"TL", name:"Timor-Leste" },
  "630":{ alpha2:"PR", name:"Puerto Rico" },
  "634":{ alpha2:"QA", name:"Qatar" },
  "642":{ alpha2:"RO", name:"Romania" },
  "643":{ alpha2:"RU", name:"Russia" },
  "646":{ alpha2:"RW", name:"Rwanda" },
  "682":{ alpha2:"SA", name:"Saudi Arabia" },
  "686":{ alpha2:"SN", name:"Senegal" },
  "688":{ alpha2:"RS", name:"Serbia" },
  "694":{ alpha2:"SL", name:"Sierra Leone" },
  "703":{ alpha2:"SK", name:"Slovakia" },
  "704":{ alpha2:"VN", name:"Vietnam" },
  "705":{ alpha2:"SI", name:"Slovenia" },
  "706":{ alpha2:"SO", name:"Somalia" },
  "710":{ alpha2:"ZA", name:"South Africa" },
  "716":{ alpha2:"ZW", name:"Zimbabwe" },
  "724":{ alpha2:"ES", name:"Spain" },
  "728":{ alpha2:"SS", name:"South Sudan" },
  "729":{ alpha2:"SD", name:"Sudan" },
  "732":{ alpha2:"EH", name:"Western Sahara" },
  "740":{ alpha2:"SR", name:"Suriname" },
  "748":{ alpha2:"SZ", name:"Eswatini" },
  "752":{ alpha2:"SE", name:"Sweden" },
  "756":{ alpha2:"CH", name:"Switzerland" },
  "760":{ alpha2:"SY", name:"Syria" },
  "762":{ alpha2:"TJ", name:"Tajikistan" },
  "764":{ alpha2:"TH", name:"Thailand" },
  "768":{ alpha2:"TG", name:"Togo" },
  "780":{ alpha2:"TT", name:"Trinidad & Tobago" },
  "784":{ alpha2:"AE", name:"United Arab Emirates" },
  "788":{ alpha2:"TN", name:"Tunisia" },
  "792":{ alpha2:"TR", name:"Turkey" },
  "795":{ alpha2:"TM", name:"Turkmenistan" },
  "800":{ alpha2:"UG", name:"Uganda" },
  "804":{ alpha2:"UA", name:"Ukraine" },
  "807":{ alpha2:"MK", name:"North Macedonia" },
  "818":{ alpha2:"EG", name:"Egypt" },
  "826":{ alpha2:"GB", name:"United Kingdom" },
  "834":{ alpha2:"TZ", name:"Tanzania" },
  "840":{ alpha2:"US", name:"United States" },
  "854":{ alpha2:"BF", name:"Burkina Faso" },
  "858":{ alpha2:"UY", name:"Uruguay" },
  "860":{ alpha2:"UZ", name:"Uzbekistan" },
  "862":{ alpha2:"VE", name:"Venezuela" },
  "887":{ alpha2:"YE", name:"Yemen" },
  "894":{ alpha2:"ZM", name:"Zambia" },
};

// European alpha-2 codes that aggregate to the "EU" config entry.
// Excludes countries with their own COUNTRY_CONFIG entries (RU, UA, TR).
const EU_MEMBERS = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","NL","PL","PT","RO","SK","SI","ES","SE","GB","CH","NO","IS",
  "MD","BA","RS","ME","MK","AL",
]);

// ── Country config ────────────────────────────────────────────────────────────
type Category = "high" | "mid" | "neutral" | "inaccessible";
interface CountryConfig { name: string; category: Category; cpm: number; }

const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  "EU":{ name:"Europe",                  category:"neutral",      cpm:6.5  },
  "SD":{ name:"Sudan",                   category:"high",         cpm:0.28 },
  "UA":{ name:"Ukraine",                 category:"high",         cpm:1.2  },
  "PS":{ name:"Palestine",               category:"high",         cpm:0.85 },
  "MM":{ name:"Myanmar",                 category:"high",         cpm:0.32 },
  "YE":{ name:"Yemen",                   category:"high",         cpm:0.45 },
  "SY":{ name:"Syria",                   category:"high",         cpm:0.9  },
  "SO":{ name:"Somalia",                 category:"high",         cpm:0.22 },
  "AF":{ name:"Afghanistan",             category:"high",         cpm:0.38 },
  "LY":{ name:"Libya",                   category:"high",         cpm:0.68 },
  "ML":{ name:"Mali",                    category:"high",         cpm:0.21 },
  "CD":{ name:"DR Congo",               category:"high",         cpm:0.19 },
  "ET":{ name:"Ethiopia",               category:"high",         cpm:0.25 },
  "CF":{ name:"Cent. African Republic", category:"high",         cpm:0.18 },
  "IQ":{ name:"Iraq",                   category:"mid",          cpm:0.72 },
  "PK":{ name:"Pakistan",               category:"mid",          cpm:0.3  },
  "BD":{ name:"Bangladesh",             category:"mid",          cpm:0.29 },
  "VE":{ name:"Venezuela",              category:"mid",          cpm:0.55 },
  "HT":{ name:"Haiti",                  category:"mid",          cpm:0.48 },
  "NG":{ name:"Nigeria",                category:"mid",          cpm:0.24 },
  "NE":{ name:"Niger",                  category:"mid",          cpm:0.2  },
  "TD":{ name:"Chad",                   category:"mid",          cpm:0.19 },
  "BF":{ name:"Burkina Faso",           category:"mid",          cpm:0.2  },
  "MZ":{ name:"Mozambique",             category:"mid",          cpm:0.21 },
  "LB":{ name:"Lebanon",               category:"mid",          cpm:0.95 },
  "IR":{ name:"Iran",                   category:"mid",          cpm:0.58 },
  "MR":{ name:"Mauritania",             category:"mid",          cpm:0.22 },
  "GN":{ name:"Guinea",                 category:"mid",          cpm:0.2  },
  "KP":{ name:"North Korea",            category:"inaccessible", cpm:0    },
  "CU":{ name:"Cuba",                   category:"inaccessible", cpm:0    },
  "RU":{ name:"Russia",                 category:"neutral",      cpm:1.5  },
  "CA":{ name:"Canada",                 category:"neutral",      cpm:8.2  },
  "US":{ name:"United States",          category:"neutral",      cpm:14.8 },
  "MX":{ name:"Mexico",                 category:"neutral",      cpm:1.8  },
  "BR":{ name:"Brazil",                 category:"neutral",      cpm:1.2  },
  "AR":{ name:"Argentina",              category:"neutral",      cpm:1.5  },
  "CL":{ name:"Chile",                  category:"neutral",      cpm:2.1  },
  "CO":{ name:"Colombia",               category:"neutral",      cpm:0.8  },
  "PE":{ name:"Peru",                   category:"neutral",      cpm:0.7  },
  "GL":{ name:"Greenland",              category:"neutral",      cpm:0    },
  "CN":{ name:"China",                  category:"neutral",      cpm:0.65 },
  "MN":{ name:"Mongolia",               category:"neutral",      cpm:0.4  },
  "IN":{ name:"India",                  category:"neutral",      cpm:0.3  },
  "KZ":{ name:"Kazakhstan",             category:"neutral",      cpm:0.6  },
  "SA":{ name:"Saudi Arabia",           category:"neutral",      cpm:1.2  },
  "TR":{ name:"Turkey",                 category:"neutral",      cpm:0.95 },
  "EG":{ name:"Egypt",                  category:"neutral",      cpm:0.55 },
  "DZ":{ name:"Algeria",               category:"neutral",      cpm:0.4  },
  "MA":{ name:"Morocco",               category:"neutral",      cpm:0.6  },
  "JP":{ name:"Japan",                  category:"neutral",      cpm:4.2  },
  "KR":{ name:"South Korea",            category:"neutral",      cpm:2.8  },
  "ID":{ name:"Indonesia",              category:"neutral",      cpm:0.45 },
  "PH":{ name:"Philippines",            category:"neutral",      cpm:0.5  },
  "VN":{ name:"Vietnam",               category:"neutral",      cpm:0.4  },
  "TH":{ name:"Thailand",              category:"neutral",      cpm:0.6  },
  "AU":{ name:"Australia",             category:"neutral",      cpm:5.8  },
  "ZA":{ name:"South Africa",           category:"neutral",      cpm:0.8  },
  "AO":{ name:"Angola",                 category:"neutral",      cpm:0.3  },
  "TZ":{ name:"Tanzania",              category:"neutral",      cpm:0.28 },
  "KE":{ name:"Kenya",                  category:"neutral",      cpm:0.35 },
  "MG":{ name:"Madagascar",             category:"neutral",      cpm:0.22 },
};

const CATEGORY_COLOR: Record<Category, string> = {
  high: "#4a7c10", mid: "#a3cc2a", neutral: "#D1D1D1", inaccessible: "#7A7A7A",
};
const CATEGORY_HOVER: Record<Category, string> = {
  high: "#5e9e14", mid: "#b8e030", neutral: "#b8b8b8", inaccessible: "#909090",
};
const RENDER_ORDER: Record<Category, number> = {
  neutral: 0, inaccessible: 1, mid: 2, high: 3,
};
const FALLBACK_CONFIG: CountryConfig = { name: "", category: "neutral", cpm: 0 };

// ── India claimed sub-regions (overlaid on base India geometry) ───────────────
// Approximated polygon shapes for Gilgit-Baltistan, Azad Kashmir, and Aksai Chin
// following the rough contour of India's claimed LOC/LAC boundaries.
const KASHMIR_REGIONS: [number, number][][] = [
  // Gilgit-Baltistan — trapezoid following Karakoram/Hindu Kush foothills
  [[72.4,36.8],[74.0,37.1],[76.2,37.0],[77.5,36.5],[77.8,35.3],[76.5,34.8],[74.5,35.1],[72.8,35.6]],
  // Azad Kashmir — elongated wedge along LOC
  [[73.2,36.1],[74.0,36.2],[74.7,35.6],[74.8,34.5],[74.2,33.4],[73.6,33.2],[73.1,34.0],[73.0,35.2]],
  // Aksai Chin — irregular polygon along LAC
  [[78.6,35.9],[79.2,36.1],[80.2,35.8],[80.5,35.0],[80.1,34.5],[79.0,34.3],[78.4,34.6],[78.2,35.3]],
];

// ── Projection utilities ──────────────────────────────────────────────────────
const coord2xy = (lon: number, lat: number): string =>
  `${((lon + 180) * 2.5).toFixed(2)},${((90 - lat) * 2.5).toFixed(2)}`;

const ring2d = (ring: Position[]): string =>
  ring.map((c, i) => (i === 0 ? "M" : "L") + coord2xy(c[0], c[1])).join(" ") + " Z";

const geom2path = (geom: Geometry | null): string => {
  if (!geom) return "";
  if (geom.type === "Polygon") return geom.coordinates.map(ring2d).join(" ");
  if (geom.type === "MultiPolygon") return geom.coordinates.flatMap(p => p.map(ring2d)).join(" ");
  return "";
};

const kashmirPath = (ring: [number, number][]): string =>
  ring.map((c, i) => (i === 0 ? "M" : "L") + coord2xy(c[0], c[1])).join(" ") + " Z";

const formatNum = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n);

const reachPerDollar = (cpm: number): number => cpm > 0 ? Math.round(1000 / cpm) : 0;

// ── Types ─────────────────────────────────────────────────────────────────────
interface WorldFeature {
  numericId: string;
  configAlpha2: string;
  displayName: string;
  config: CountryConfig;
  path: string;
  isConfigured: boolean;
}
interface CampaignRecord { countryCode: string; totalReach: number; totalReactions: number; }
interface TooltipState { x: number; y: number; config: CountryConfig; configAlpha2: string; displayName: string; isConfigured: boolean; campaignData?: CampaignRecord; }
interface Props { onCountryClick?: (countryName: string) => void; }

const computeFill = (
  configAlpha2: string, config: CountryConfig,
  hovered: string | null, showResults: boolean, campaignMap: Record<string, CampaignRecord>,
): string => {
  const isHov = hovered === configAlpha2;
  const base = isHov ? CATEGORY_HOVER[config.category] : CATEGORY_COLOR[config.category];
  if (showResults && campaignMap[configAlpha2]) return config.category === "high" ? "#2d5c08" : "#82a322";
  return base;
};

// ── Build world features from world-atlas (runs once at module init) ──────────
function buildWorldFeatures(): WorldFeature[] {
  const geo: FeatureCollection<Geometry> = topoFeature(WORLD_ATLAS, WORLD_ATLAS.objects.countries);
  const out: WorldFeature[] = [];
  for (const f of geo.features) {
    if (f.id === undefined || f.id === null) continue;
    const numericId = String(f.id);
    if (numericId === "010") continue;
    const path = geom2path(f.geometry);
    if (!path) continue;
    const isoInfo = ISO_LOOKUP[numericId];
    const alpha2 = isoInfo?.alpha2 ?? numericId;
    const displayName = isoInfo?.name ?? numericId;
    const configAlpha2 = EU_MEMBERS.has(alpha2) ? "EU" : alpha2;
    const config = COUNTRY_CONFIG[configAlpha2];
    out.push({ numericId, configAlpha2, displayName: config?.name ?? displayName, config: config ?? FALLBACK_CONFIG, path, isConfigured: config !== undefined });
  }
  out.sort((a, b) => RENDER_ORDER[a.config.category] - RENDER_ORDER[b.config.category]);
  return out;
}

const WORLD_FEATURES = buildWorldFeatures();

// ── Component ─────────────────────────────────────────────────────────────────
export default function HealWorldMap({ onCountryClick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [showResults, setShowResults] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: campaigns = [] } = useQuery<CampaignRecord[]>({ queryKey: ["/api/heal/campaigns"] });
  const campaignMap: Record<string, CampaignRecord> = Object.fromEntries(campaigns.map(c => [c.countryCode, c]));

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    f: WorldFeature,
  ) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (900 / rect.width);
    const y = (e.clientY - rect.top) * (400 / rect.height) + 25;
    setTooltip({ x, y, config: f.config, configAlpha2: f.configAlpha2, displayName: f.displayName, isConfigured: f.isConfigured, campaignData: campaignMap[f.configAlpha2] });
  };

  const indiaFill = computeFill("IN", COUNTRY_CONFIG["IN"], hovered, showResults, campaignMap);

  return (
    <div className="relative w-full select-none">
      <svg ref={svgRef} viewBox="0 25 900 400" className="w-full h-auto">
        <rect x="0" y="0" width="900" height="450" fill="#F9F9F9" />

        {[-60,-30,0,30,60].map(lat => (
          <line key={`lat-${lat}`} x1="0" y1={((90-lat)*2.5).toFixed(1)} x2="900" y2={((90-lat)*2.5).toFixed(1)} stroke="#E0DADA" strokeWidth="0.5" />
        ))}
        {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lon => (
          <line key={`lon-${lon}`} x1={((lon+180)*2.5).toFixed(1)} y1="0" x2={((lon+180)*2.5).toFixed(1)} y2="450" stroke="#E0DADA" strokeWidth="0.5" />
        ))}

        {WORLD_FEATURES.map((f, i) => {
          const fill = computeFill(f.configAlpha2, f.config, hovered, showResults, campaignMap);
          return (
            <path key={`${f.numericId}-${i}`} d={f.path}
              fill={fill} fillRule="evenodd"
              stroke="#fff" strokeWidth={f.isConfigured ? "0.5" : "0.4"} strokeLinejoin="round"
              style={{ cursor: f.isConfigured ? "pointer" : "default", transition: "fill 0.18s" }}
              onMouseEnter={() => setHovered(f.configAlpha2)}
              onMouseLeave={() => { setHovered(null); setTooltip(null); }}
              onMouseMove={e => handleMouseMove(e, f)}
              onClick={() => { if (f.isConfigured) onCountryClick?.(f.config.name); }} />
          );
        })}

        {KASHMIR_REGIONS.map((ring, i) => (
          <path key={`kashmir-${i}`} d={kashmirPath(ring)} fill={indiaFill}
            stroke="#fff" strokeWidth="0.3" strokeLinejoin="round"
            style={{ cursor: "pointer", transition: "fill 0.18s" }}
            onMouseEnter={() => setHovered("IN")}
            onMouseLeave={() => { setHovered(null); setTooltip(null); }}
            onMouseMove={e => handleMouseMove(e, { numericId:"356", configAlpha2:"IN", displayName:"India", config:COUNTRY_CONFIG["IN"], path:"", isConfigured:true })}
            onClick={() => onCountryClick?.(COUNTRY_CONFIG["IN"].name)} />
        ))}

        {tooltip && (
          <g>
            <rect x={Math.min(tooltip.x+8,692)} y={Math.max(tooltip.y-60,29)} width={200} height={44} rx="6" ry="6" fill="rgba(0,0,0,0.82)" />
            <text x={Math.min(tooltip.x+16,700)} y={Math.max(tooltip.y-40,47)} fill="white" fontSize="11" fontWeight="700" fontFamily="serif">
              {tooltip.displayName}
            </text>
            {!tooltip.isConfigured ? (
              <text x={Math.min(tooltip.x+16,700)} y={Math.max(tooltip.y-24,63)} fill="#aaa" fontSize="9.5">
                Not in current campaigns
              </text>
            ) : tooltip.config.category === "inaccessible" ? (
              <text x={Math.min(tooltip.x+16,700)} y={Math.max(tooltip.y-24,63)} fill="#ff9999" fontSize="9.5">
                Not accessible via Meta Ads
              </text>
            ) : (
              <text x={Math.min(tooltip.x+16,700)} y={Math.max(tooltip.y-24,63)} fill="#c8f088" fontSize="9.5">
                {showResults ? "Souls reached: "+formatNum(tooltip.campaignData?.totalReach??0) : "Reach per US $1: ~"+formatNum(reachPerDollar(tooltip.config.cpm))}
              </text>
            )}
          </g>
        )}

        <g style={{ cursor:"pointer" }} onClick={() => setShowResults(!showResults)}>
          <rect x="780" y="390" width="110" height="26" rx="13" fill={showResults ? "#4a7c10" : "rgba(0,0,0,0.5)"} />
          <text x="835" y="406" fill="white" fontSize="9.5" textAnchor="middle" fontWeight="600">
            {showResults ? "● Results ON" : "○ Results OFF"}
          </text>
        </g>

        <g transform="translate(8,355)">
          <rect x="0" y="0" width="190" height="64" rx="6" fill="rgba(255,255,255,0.85)" />
          {([
            { color:"#4a7c10", label:"Active conflict zones" },
            { color:"#a3cc2a", label:"Economic / indirect impact" },
            { color:"#D1D1D1", label:"Neutral / accessible" },
            { color:"#7A7A7A", label:"Non-accessible region" },
          ] as const).map(({ color, label }, i) => (
            <g key={label} transform={`translate(8,${12+i*14})`}>
              <rect x="0" y="-7" width="10" height="10" fill={color} rx="2" />
              <text x="16" y="2" fill="#333" fontSize="8.5">{label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
