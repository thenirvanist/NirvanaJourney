import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { feature as topoFeature } from "topojson-client";

// ── ISO 3166-1 numeric (3-char string) → alpha-2 ───────────────────────────
const ISO: Record<string, string> = {
  "004":"AF","008":"AL","010":"AQ","012":"DZ","024":"AO","031":"AZ","032":"AR",
  "036":"AU","040":"AT","044":"BS","050":"BD","051":"AM","056":"BE","064":"BT",
  "068":"BO","070":"BA","072":"BW","076":"BR","084":"BZ","090":"SB","096":"BN",
  "100":"BG","104":"MM","108":"BI","112":"BY","116":"KH","120":"CM","124":"CA",
  "140":"CF","144":"LK","148":"TD","152":"CL","156":"CN","158":"TW","170":"CO",
  "178":"CG","180":"CD","188":"CR","191":"HR","192":"CU","196":"CY","203":"CZ",
  "204":"BJ","208":"DK","214":"DO","218":"EC","222":"SV","226":"GQ","231":"ET",
  "232":"ER","233":"EE","238":"FK","242":"FJ","246":"FI","250":"FR","260":"TF",
  "262":"DJ","266":"GA","268":"GE","270":"GM","275":"PS","276":"DE","288":"GH",
  "300":"GR","304":"GL","320":"GT","324":"GN","328":"GY","332":"HT","340":"HN",
  "348":"HU","352":"IS","356":"IN","360":"ID","364":"IR","368":"IQ","372":"IE",
  "376":"IL","380":"IT","384":"CI","388":"JM","392":"JP","398":"KZ","400":"JO",
  "404":"KE","408":"KP","410":"KR","414":"KW","417":"KG","418":"LA","422":"LB",
  "426":"LS","428":"LV","430":"LR","434":"LY","440":"LT","442":"LU","450":"MG",
  "454":"MW","458":"MY","466":"ML","478":"MR","484":"MX","496":"MN","498":"MD",
  "499":"ME","504":"MA","508":"MZ","512":"OM","516":"NA","524":"NP","528":"NL",
  "540":"NC","548":"VU","554":"NZ","558":"NI","562":"NE","566":"NG","578":"NO",
  "586":"PK","591":"PA","598":"PG","600":"PY","604":"PE","608":"PH","616":"PL",
  "620":"PT","624":"GW","626":"TL","630":"PR","634":"QA","642":"RO","643":"RU",
  "646":"RW","682":"SA","686":"SN","688":"RS","694":"SL","703":"SK","704":"VN",
  "705":"SI","706":"SO","710":"ZA","716":"ZW","724":"ES","728":"SS","729":"SD",
  "732":"EH","740":"SR","748":"SZ","752":"SE","756":"CH","760":"SY","762":"TJ",
  "764":"TH","768":"TG","780":"TT","784":"AE","788":"TN","792":"TR","795":"TM",
  "800":"UG","804":"UA","807":"MK","818":"EG","826":"GB","834":"TZ","840":"US",
  "854":"BF","858":"UY","860":"UZ","862":"VE","887":"YE","894":"ZM",
};

// ── Country configuration: category & CPM for the 63 Heal countries ─────────
interface CountryConfig {
  name: string;
  category: "high" | "mid" | "neutral" | "inaccessible";
  cpm: number;
}

const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  // HIGH NEED — active conflict zones
  "SD": { name: "Sudan",                    category: "high",         cpm: 0.28 },
  "UA": { name: "Ukraine",                  category: "high",         cpm: 1.2  },
  "PS": { name: "Palestine",                category: "high",         cpm: 0.85 },
  "MM": { name: "Myanmar",                  category: "high",         cpm: 0.32 },
  "YE": { name: "Yemen",                    category: "high",         cpm: 0.45 },
  "SY": { name: "Syria",                    category: "high",         cpm: 0.9  },
  "SO": { name: "Somalia",                  category: "high",         cpm: 0.22 },
  "AF": { name: "Afghanistan",              category: "high",         cpm: 0.38 },
  "LY": { name: "Libya",                    category: "high",         cpm: 0.68 },
  "ML": { name: "Mali",                     category: "high",         cpm: 0.21 },
  "CD": { name: "DR Congo",                 category: "high",         cpm: 0.19 },
  "ET": { name: "Ethiopia",                 category: "high",         cpm: 0.25 },
  "CF": { name: "Cent. African Republic",   category: "high",         cpm: 0.18 },
  // MID NEED — economic / indirect impact
  "IQ": { name: "Iraq",                     category: "mid",          cpm: 0.72 },
  "PK": { name: "Pakistan",                 category: "mid",          cpm: 0.3  },
  "BD": { name: "Bangladesh",               category: "mid",          cpm: 0.29 },
  "VE": { name: "Venezuela",                category: "mid",          cpm: 0.55 },
  "HT": { name: "Haiti",                    category: "mid",          cpm: 0.48 },
  "NG": { name: "Nigeria",                  category: "mid",          cpm: 0.24 },
  "NE": { name: "Niger",                    category: "mid",          cpm: 0.2  },
  "TD": { name: "Chad",                     category: "mid",          cpm: 0.19 },
  "BF": { name: "Burkina Faso",             category: "mid",          cpm: 0.2  },
  "MZ": { name: "Mozambique",               category: "mid",          cpm: 0.21 },
  "LB": { name: "Lebanon",                  category: "mid",          cpm: 0.95 },
  "IR": { name: "Iran",                     category: "mid",          cpm: 0.58 },
  "MR": { name: "Mauritania",               category: "mid",          cpm: 0.22 },
  "GN": { name: "Guinea",                   category: "mid",          cpm: 0.2  },
  // INACCESSIBLE
  "KP": { name: "North Korea",              category: "inaccessible", cpm: 0    },
  "CU": { name: "Cuba",                     category: "inaccessible", cpm: 0    },
  // NEUTRAL / ACCESSIBLE
  "RU": { name: "Russia",                   category: "neutral",      cpm: 1.5  },
  "CA": { name: "Canada",                   category: "neutral",      cpm: 8.2  },
  "US": { name: "United States",            category: "neutral",      cpm: 14.8 },
  "MX": { name: "Mexico",                   category: "neutral",      cpm: 1.8  },
  "BR": { name: "Brazil",                   category: "neutral",      cpm: 1.2  },
  "AR": { name: "Argentina",                category: "neutral",      cpm: 1.5  },
  "CL": { name: "Chile",                    category: "neutral",      cpm: 2.1  },
  "CO": { name: "Colombia",                 category: "neutral",      cpm: 0.8  },
  "PE": { name: "Peru",                     category: "neutral",      cpm: 0.7  },
  "GL": { name: "Greenland",                category: "neutral",      cpm: 0    },
  "CN": { name: "China",                    category: "neutral",      cpm: 0.65 },
  "MN": { name: "Mongolia",                 category: "neutral",      cpm: 0.4  },
  "IN": { name: "India",                    category: "neutral",      cpm: 0.3  },
  "KZ": { name: "Kazakhstan",               category: "neutral",      cpm: 0.6  },
  "SA": { name: "Saudi Arabia",             category: "neutral",      cpm: 1.2  },
  "TR": { name: "Turkey",                   category: "neutral",      cpm: 0.95 },
  "EG": { name: "Egypt",                    category: "neutral",      cpm: 0.55 },
  "DZ": { name: "Algeria",                  category: "neutral",      cpm: 0.4  },
  "MA": { name: "Morocco",                  category: "neutral",      cpm: 0.6  },
  "JP": { name: "Japan",                    category: "neutral",      cpm: 4.2  },
  "KR": { name: "South Korea",              category: "neutral",      cpm: 2.8  },
  "ID": { name: "Indonesia",                category: "neutral",      cpm: 0.45 },
  "PH": { name: "Philippines",              category: "neutral",      cpm: 0.5  },
  "VN": { name: "Vietnam",                  category: "neutral",      cpm: 0.4  },
  "TH": { name: "Thailand",                 category: "neutral",      cpm: 0.6  },
  "AU": { name: "Australia",                category: "neutral",      cpm: 5.8  },
  "ZA": { name: "South Africa",             category: "neutral",      cpm: 0.8  },
  "AO": { name: "Angola",                   category: "neutral",      cpm: 0.3  },
  "TZ": { name: "Tanzania",                 category: "neutral",      cpm: 0.28 },
  "KE": { name: "Kenya",                    category: "neutral",      cpm: 0.35 },
  "MG": { name: "Madagascar",               category: "neutral",      cpm: 0.22 },
};

const CATEGORY_COLOR: Record<string, string> = {
  high: "#4a7c10",
  mid: "#a3cc2a",
  neutral: "#D1D1D1",
  inaccessible: "#7A7A7A",
};

const CATEGORY_HOVER: Record<string, string> = {
  high: "#5e9e14",
  mid: "#b8e030",
  neutral: "#b8b8b8",
  inaccessible: "#909090",
};

// ── India Kashmir supplement — disputed territories shown in India's colour ──
// Defined as simple [lon, lat] rectangle outlines (rough approximation of the
// three disputed sub-regions that India claims but does not fully administer).
const KASHMIR_SUPPLEMENT: [number, number][][] = [
  // Gilgit-Baltistan (Pakistan-administered)
  [[72.0,37.5],[77.8,37.5],[77.8,34.5],[72.0,34.5]],
  // Azad Kashmir (Pakistan-administered)
  [[73.2,36.0],[74.7,36.0],[74.7,33.3],[73.2,33.3]],
  // Aksai Chin (China-administered)
  [[78.5,36.2],[80.3,36.2],[80.3,34.4],[78.5,34.4]],
];

// ── Projection helpers ──────────────────────────────────────────────────────
const coord2xy = (lon: number, lat: number) =>
  `${((lon + 180) * 2.5).toFixed(2)},${((90 - lat) * 2.5).toFixed(2)}`;

const ring2d = (ring: number[][]): string =>
  ring.map((c, i) => (i === 0 ? "M" : "L") + coord2xy(c[0], c[1])).join(" ") + " Z";

const geom2path = (geom: { type: string; coordinates: unknown } | null): string => {
  if (!geom) return "";
  if (geom.type === "Polygon") {
    return (geom.coordinates as number[][][]).map(ring2d).join(" ");
  }
  if (geom.type === "MultiPolygon") {
    return (geom.coordinates as number[][][][])
      .flatMap((poly) => poly.map(ring2d))
      .join(" ");
  }
  return "";
};

const kashmirPath = (ring: [number, number][]): string =>
  ring.map((c, i) => (i === 0 ? "M" : "L") + coord2xy(c[0], c[1])).join(" ") + " Z";

const formatNum = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `${(n / 1_000).toFixed(0)}K`
  : String(n);

const reachPerDollar = (cpm: number) => (cpm > 0 ? Math.round(1000 / cpm) : 0);

// ── Types ───────────────────────────────────────────────────────────────────
interface WorldFeature {
  numericId: string;
  alpha2: string | null;
  config: CountryConfig | null;
  path: string;
}

interface TooltipState {
  x: number;
  y: number;
  config: CountryConfig;
  alpha2: string;
  campaignData?: { totalReach: number; totalReactions: number };
}

interface CampaignRecord {
  countryCode: string;
  totalReach: number;
  totalReactions: number;
}

interface Props {
  onCountryClick?: (countryName: string) => void;
}

// ── z-order: neutral behind, high in front ──────────────────────────────────
const RENDER_ORDER: Record<string, number> = { neutral: 0, inaccessible: 1, mid: 2, high: 3 };

export default function HealWorldMap({ onCountryClick }: Props) {
  const [worldFeatures, setWorldFeatures] = useState<WorldFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [showResults, setShowResults] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: campaigns = [] } = useQuery<CampaignRecord[]>({
    queryKey: ["/api/heal/campaigns"],
  });

  const campaignMap = Object.fromEntries(campaigns.map((c) => [c.countryCode, c]));

  // Load world-atlas TopoJSON and convert to SVG paths
  useEffect(() => {
    fetch("/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geo = topoFeature(topo as any, (topo as any).objects.countries) as any;
        const features: WorldFeature[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const f of geo.features as any[]) {
          const numericId = String(f.id);
          if (numericId === "010") continue; // skip Antarctica
          const alpha2 = ISO[numericId] || null;
          const config = alpha2 ? (COUNTRY_CONFIG[alpha2] || null) : null;
          const path = geom2path(f.geometry);
          if (!path) continue;
          features.push({ numericId, alpha2, config, path });
        }
        features.sort((a, b) => {
          const catA = a.config?.category ?? "neutral";
          const catB = b.config?.category ?? "neutral";
          return RENDER_ORDER[catA] - RENDER_ORDER[catB];
        });
        setWorldFeatures(features);
        setLoading(false);
      });
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent,
    config: CountryConfig,
    alpha2: string,
  ) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (900 / rect.width);
    const y = (e.clientY - rect.top) * (400 / rect.height) + 25;
    setTooltip({ x, y, config, alpha2, campaignData: campaignMap[alpha2] });
  };

  const indiaFill =
    hovered === "IN" ? CATEGORY_HOVER["neutral"] : CATEGORY_COLOR["neutral"];

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox="0 25 900 400"
        className="w-full h-auto"
      >
        {/* Ocean */}
        <rect x="0" y="0" width="900" height="450" fill="#F9F9F9" />

        {/* Graticule lines */}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <line
            key={lat}
            x1="0" y1={((90 - lat) * 2.5).toFixed(1)}
            x2="900" y2={((90 - lat) * 2.5).toFixed(1)}
            stroke="#E0DADA" strokeWidth="0.5"
          />
        ))}
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
          <line
            key={lon}
            x1={((lon + 180) * 2.5).toFixed(1)} y1="0"
            x2={((lon + 180) * 2.5).toFixed(1)} y2="450"
            stroke="#E0DADA" strokeWidth="0.5"
          />
        ))}

        {/* Loading placeholder */}
        {loading && (
          <text x="450" y="225" textAnchor="middle" fill="#aaa" fontSize="13">
            Loading map…
          </text>
        )}

        {/* World-atlas country paths */}
        {worldFeatures.map((f) => {
          const category = f.config?.category ?? "neutral";
          const isHov = f.alpha2 !== null && hovered === f.alpha2;
          const baseFill = isHov ? CATEGORY_HOVER[category] : CATEGORY_COLOR[category];
          const resultFill =
            showResults && f.alpha2 && campaignMap[f.alpha2]
              ? category === "high" ? "#2d5c08" : "#82a322"
              : baseFill;
          const interactive = f.config !== null;

          return (
            <path
              key={f.numericId}
              d={f.path}
              fill={resultFill}
              fillRule="evenodd"
              stroke="#fff"
              strokeWidth={interactive ? "0.5" : "0.25"}
              strokeLinejoin="round"
              style={{ cursor: interactive ? "pointer" : "default", transition: "fill 0.18s" }}
              onMouseEnter={interactive ? () => setHovered(f.alpha2) : undefined}
              onMouseLeave={
                interactive
                  ? () => { setHovered(null); setTooltip(null); }
                  : undefined
              }
              onMouseMove={
                interactive
                  ? (e) => handleMouseMove(e, f.config!, f.alpha2!)
                  : undefined
              }
              onClick={interactive ? () => onCountryClick?.(f.config!.name) : undefined}
            />
          );
        })}

        {/* India Kashmir supplement — claimed territory overlay */}
        {!loading && KASHMIR_SUPPLEMENT.map((ring, i) => (
          <path
            key={`kashmir-${i}`}
            d={kashmirPath(ring)}
            fill={indiaFill}
            stroke="#fff"
            strokeWidth="0.25"
            strokeLinejoin="round"
            style={{ pointerEvents: "none" }}
          />
        ))}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x + 8, 692)}
              y={Math.max(tooltip.y - 60, 29)}
              width={200}
              height={44}
              rx="6" ry="6"
              fill="rgba(0,0,0,0.82)"
            />
            <text
              x={Math.min(tooltip.x + 16, 700)}
              y={Math.max(tooltip.y - 40, 47)}
              fill="white" fontSize="11" fontWeight="700" fontFamily="serif"
            >
              {tooltip.config.name}
            </text>
            {tooltip.config.category !== "inaccessible" ? (
              <text
                x={Math.min(tooltip.x + 16, 700)}
                y={Math.max(tooltip.y - 24, 63)}
                fill="#c8f088" fontSize="9.5"
              >
                {showResults
                  ? "Souls reached: " + formatNum(tooltip.campaignData?.totalReach ?? 0)
                  : "Reach per US $1: ~" + formatNum(reachPerDollar(tooltip.config.cpm))}
              </text>
            ) : (
              <text
                x={Math.min(tooltip.x + 16, 700)}
                y={Math.max(tooltip.y - 24, 63)}
                fill="#ff9999" fontSize="9.5"
              >
                Not accessible via Meta Ads
              </text>
            )}
          </g>
        )}

        {/* Results toggle */}
        <g style={{ cursor: "pointer" }} onClick={() => setShowResults(!showResults)}>
          <rect x="780" y="390" width="110" height="26" rx="13"
            fill={showResults ? "#4a7c10" : "rgba(0,0,0,0.5)"} />
          <text x="835" y="406" fill="white" fontSize="9.5" textAnchor="middle" fontWeight="600">
            {showResults ? "● Results ON" : "○ Results OFF"}
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(8, 355)">
          <rect x="0" y="0" width="190" height="64" rx="6" fill="rgba(255,255,255,0.85)" />
          {[
            { color: "#4a7c10", label: "Active conflict zones" },
            { color: "#a3cc2a", label: "Economic / indirect impact" },
            { color: "#D1D1D1", label: "Neutral / accessible" },
            { color: "#7A7A7A", label: "Non-accessible region" },
          ].map(({ color, label }, i) => (
            <g key={label} transform={`translate(8,${12 + i * 14})`}>
              <rect x="0" y="-7" width="10" height="10" fill={color} rx="2" />
              <text x="16" y="2" fill="#333" fontSize="8.5">{label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
