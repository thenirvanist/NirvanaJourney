import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface CountryData {
  code: string;
  name: string;
  category: "high" | "mid" | "neutral" | "inaccessible";
  points: [number, number][];
  cpm: number;
}

interface Tooltip {
  x: number;
  y: number;
  country: CountryData;
  campaignData?: CampaignRecord;
}

const toSVG = (lon: number, lat: number): [number, number] => [
  (lon + 180) * 2.5,
  (90 - lat) * 2.5,
];

const polyPath = (pts: [number, number][]): string =>
  pts
    .map(([lon, lat], i) => {
      const [x, y] = toSVG(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

const COUNTRIES: CountryData[] = [
  // ── HIGH NEED (active conflict zones) ─────────────────────────────────
  {
    code: "SD",
    name: "Sudan",
    category: "high",
    cpm: 0.28,
    points: [[22,24],[38,24],[38,8],[22,8]],
  },
  {
    code: "UA",
    name: "Ukraine",
    category: "high",
    cpm: 1.2,
    points: [[22,52],[32,52],[37,52],[40,50],[40,44],[22,44]],
  },
  {
    code: "PS",
    name: "Palestine",
    category: "high",
    cpm: 0.85,
    points: [[34,34],[36,34],[36,29],[34,29]],
  },
  {
    code: "MM",
    name: "Myanmar",
    category: "high",
    cpm: 0.32,
    points: [[92,28],[101,25],[101,10],[94,10],[92,18]],
  },
  {
    code: "YE",
    name: "Yemen",
    category: "high",
    cpm: 0.45,
    points: [[43,19],[54,19],[54,12],[43,12]],
  },
  {
    code: "SY",
    name: "Syria",
    category: "high",
    cpm: 0.9,
    points: [[36,37],[42,37],[42,33],[36,33]],
  },
  {
    code: "SO",
    name: "Somalia",
    category: "high",
    cpm: 0.22,
    points: [[41,12],[51,12],[50,4],[44,-2],[41,-2]],
  },
  {
    code: "AF",
    name: "Afghanistan",
    category: "high",
    cpm: 0.38,
    points: [[61,38],[75,38],[75,29],[61,29]],
  },
  {
    code: "LY",
    name: "Libya",
    category: "high",
    cpm: 0.68,
    points: [[9,33],[25,33],[25,19],[9,19]],
  },
  {
    code: "ML",
    name: "Mali",
    category: "high",
    cpm: 0.21,
    points: [[-4,25],[4,25],[4,10],[-4,10]],
  },
  {
    code: "CD",
    name: "DR Congo",
    category: "high",
    cpm: 0.19,
    points: [[12,5],[18,5],[24,2],[31,2],[31,-14],[12,-14]],
  },
  {
    code: "ET",
    name: "Ethiopia",
    category: "high",
    cpm: 0.25,
    points: [[33,15],[48,15],[48,3],[33,3]],
  },
  {
    code: "CF",
    name: "Central African Republic",
    category: "high",
    cpm: 0.18,
    points: [[14,11],[27,11],[27,2],[14,2]],
  },
  // ── MID NEED (economic / indirect impact) ─────────────────────────────
  {
    code: "IQ",
    name: "Iraq",
    category: "mid",
    cpm: 0.72,
    points: [[39,37],[48,37],[48,29],[39,29]],
  },
  {
    code: "PK",
    name: "Pakistan",
    category: "mid",
    cpm: 0.3,
    points: [[60,37],[77,37],[77,23],[60,23]],
  },
  {
    code: "BD",
    name: "Bangladesh",
    category: "mid",
    cpm: 0.29,
    points: [[88,26],[92,26],[92,21],[88,21]],
  },
  {
    code: "VE",
    name: "Venezuela",
    category: "mid",
    cpm: 0.55,
    points: [[-73,12],[-59,12],[-59,1],[-73,1]],
  },
  {
    code: "HT",
    name: "Haiti",
    category: "mid",
    cpm: 0.48,
    points: [[-74,20],[-72,20],[-72,18],[-74,18]],
  },
  {
    code: "NG",
    name: "Nigeria",
    category: "mid",
    cpm: 0.24,
    points: [[3,14],[15,14],[15,4],[3,4]],
  },
  {
    code: "NE",
    name: "Niger",
    category: "mid",
    cpm: 0.2,
    points: [[2,24],[16,24],[16,11],[2,11]],
  },
  {
    code: "TD",
    name: "Chad",
    category: "mid",
    cpm: 0.19,
    points: [[13,23],[24,23],[24,7],[13,7]],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    category: "mid",
    cpm: 0.2,
    points: [[-5,15],[2,15],[2,10],[-5,10]],
  },
  {
    code: "MZ",
    name: "Mozambique",
    category: "mid",
    cpm: 0.21,
    points: [[32,-10],[41,-10],[41,-26],[32,-26]],
  },
  {
    code: "LB",
    name: "Lebanon",
    category: "mid",
    cpm: 0.95,
    points: [[35,34.5],[37,34.5],[37,33],[35,33]],
  },
  {
    code: "IR",
    name: "Iran",
    category: "mid",
    cpm: 0.58,
    points: [[44,40],[63,40],[63,25],[44,25]],
  },
  {
    code: "MR",
    name: "Mauritania",
    category: "mid",
    cpm: 0.22,
    points: [[-17,27],[-5,27],[-5,15],[-17,15]],
  },
  {
    code: "GN",
    name: "Guinea",
    category: "mid",
    cpm: 0.2,
    points: [[-15,12],[-8,12],[-8,7],[-15,7]],
  },
  // ── INACCESSIBLE ──────────────────────────────────────────────────────
  {
    code: "KP",
    name: "North Korea",
    category: "inaccessible",
    cpm: 0,
    points: [[124,43],[130,43],[130,37],[124,37]],
  },
  {
    code: "CU",
    name: "Cuba",
    category: "inaccessible",
    cpm: 0,
    points: [[-84,23],[-74,23],[-74,20],[-84,20]],
  },
  // ── NEUTRAL / BACKGROUND ──────────────────────────────────────────────
  {
    code: "RU",
    name: "Russia",
    category: "neutral",
    cpm: 1.5,
    points: [[30,82],[90,82],[140,72],[180,68],[180,50],[140,52],[100,50],[80,52],[55,54],[30,68]],
  },
  {
    code: "CA",
    name: "Canada",
    category: "neutral",
    cpm: 8.2,
    points: [[-141,84],[-60,84],[-52,47],[-100,42],[-125,49],[-141,60]],
  },
  {
    code: "US",
    name: "United States",
    category: "neutral",
    cpm: 14.8,
    points: [[-125,49],[-67,47],[-65,25],[-97,25],[-125,32]],
  },
  {
    code: "MX",
    name: "Mexico",
    category: "neutral",
    cpm: 1.8,
    points: [[-117,32],[-86,21],[-86,14],[-92,14],[-117,23]],
  },
  {
    code: "BR",
    name: "Brazil",
    category: "neutral",
    cpm: 1.2,
    points: [[-74,5],[-35,5],[-35,-34],[-70,-34],[-74,-10]],
  },
  {
    code: "AR",
    name: "Argentina",
    category: "neutral",
    cpm: 1.5,
    points: [[-74,-21],[-53,-21],[-66,-56],[-74,-38]],
  },
  {
    code: "CL",
    name: "Chile",
    category: "neutral",
    cpm: 2.1,
    points: [[-75,-17],[-66,-17],[-66,-56],[-75,-30]],
  },
  {
    code: "CO",
    name: "Colombia",
    category: "neutral",
    cpm: 0.8,
    points: [[-79,12],[-66,12],[-66,-4],[-79,-4]],
  },
  {
    code: "PE",
    name: "Peru",
    category: "neutral",
    cpm: 0.7,
    points: [[-81,0],[-68,0],[-68,-18],[-81,-14]],
  },
  {
    code: "GL",
    name: "Greenland",
    category: "neutral",
    cpm: 0,
    points: [[-73,84],[-11,84],[-18,59],[-73,60]],
  },
  {
    code: "CN",
    name: "China",
    category: "neutral",
    cpm: 0.65,
    points: [[73,54],[135,54],[135,18],[73,18]],
  },
  {
    code: "MN",
    name: "Mongolia",
    category: "neutral",
    cpm: 0.4,
    points: [[87,52],[120,52],[120,41],[87,41]],
  },
  {
    code: "IN",
    name: "India",
    category: "neutral",
    cpm: 0.3,
    points: [[68,36],[80,36],[80,36],[98,30],[98,7],[68,7]],
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    category: "neutral",
    cpm: 0.6,
    points: [[50,56],[87,56],[87,40],[50,40]],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    category: "neutral",
    cpm: 1.2,
    points: [[36,33],[56,33],[56,15],[36,15]],
  },
  {
    code: "TR",
    name: "Turkey",
    category: "neutral",
    cpm: 0.95,
    points: [[26,42],[44,42],[44,36],[26,36]],
  },
  {
    code: "EG",
    name: "Egypt",
    category: "neutral",
    cpm: 0.55,
    points: [[25,32],[37,32],[37,22],[25,22]],
  },
  {
    code: "DZ",
    name: "Algeria",
    category: "neutral",
    cpm: 0.4,
    points: [[-8,37],[12,37],[12,18],[-8,18]],
  },
  {
    code: "MA",
    name: "Morocco",
    category: "neutral",
    cpm: 0.6,
    points: [[-14,36],[-1,36],[-1,28],[-14,28]],
  },
  {
    code: "EU",
    name: "Europe",
    category: "neutral",
    cpm: 6.5,
    points: [[-10,71],[40,71],[40,35],[-10,35]],
  },
  {
    code: "JP",
    name: "Japan",
    category: "neutral",
    cpm: 4.2,
    points: [[130,45],[146,45],[146,31],[130,31]],
  },
  {
    code: "KR",
    name: "South Korea",
    category: "neutral",
    cpm: 2.8,
    points: [[126,38],[130,38],[130,34],[126,34]],
  },
  {
    code: "ID",
    name: "Indonesia",
    category: "neutral",
    cpm: 0.45,
    points: [[95,-1],[141,-1],[141,-12],[95,-12]],
  },
  {
    code: "PH",
    name: "Philippines",
    category: "neutral",
    cpm: 0.5,
    points: [[116,21],[127,21],[127,5],[116,5]],
  },
  {
    code: "VN",
    name: "Vietnam",
    category: "neutral",
    cpm: 0.4,
    points: [[102,23],[109,23],[109,8],[102,8]],
  },
  {
    code: "TH",
    name: "Thailand",
    category: "neutral",
    cpm: 0.6,
    points: [[97,21],[106,21],[106,5],[97,5]],
  },
  {
    code: "AU",
    name: "Australia",
    category: "neutral",
    cpm: 5.8,
    points: [[113,-10],[154,-10],[154,-44],[113,-44]],
  },
  {
    code: "ZA",
    name: "South Africa",
    category: "neutral",
    cpm: 0.8,
    points: [[16,-22],[33,-22],[33,-35],[16,-35]],
  },
  {
    code: "AO",
    name: "Angola",
    category: "neutral",
    cpm: 0.3,
    points: [[11,-5],[24,-5],[24,-18],[11,-18]],
  },
  {
    code: "TZ",
    name: "Tanzania",
    category: "neutral",
    cpm: 0.28,
    points: [[29,-1],[41,-1],[41,-12],[29,-12]],
  },
  {
    code: "KE",
    name: "Kenya",
    category: "neutral",
    cpm: 0.35,
    points: [[34,-5],[42,-5],[42,5],[34,5]],
  },
  {
    code: "MG",
    name: "Madagascar",
    category: "neutral",
    cpm: 0.22,
    points: [[43,-12],[50,-12],[50,-26],[43,-26]],
  },
];

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

const formatNum = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}K`
    : String(n);

interface CampaignRecord {
  countryCode: string;
  totalReach: number;
  totalReactions: number;
}

interface Props {
  onCountryClick?: (countryName: string) => void;
}

export default function HealWorldMap({ onCountryClick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [showResults, setShowResults] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: campaigns = [] } = useQuery<CampaignRecord[]>({
    queryKey: ["/api/heal/campaigns"],
  });

  const campaignMap = Object.fromEntries(
    campaigns.map((c) => [c.countryCode, c])
  );

  const handleMouseMove = (e: React.MouseEvent, country: CountryData) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 450 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setTooltip({
      x,
      y,
      country,
      campaignData: campaignMap[country.code],
    });
  };

  const reachPerDollar = (cpm: number) =>
    cpm > 0 ? Math.round(1000 / cpm) : 0;

  const neutralFirst = [...COUNTRIES].sort((a, b) => {
    const order = { neutral: 0, inaccessible: 1, mid: 2, high: 3 };
    return order[a.category] - order[b.category];
  });

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 900 450"
        className="w-full h-auto"
        style={{ background: "#F0EDE6" }}
      >
        {/* Ocean */}
        <rect x="0" y="0" width="900" height="450" fill="#F9F9F9" />

        {/* Graticule lines */}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <line
            key={lat}
            x1="0"
            y1={toSVG(0, lat)[1]}
            x2="900"
            y2={toSVG(0, lat)[1]}
            stroke="#E0DADA"
            strokeWidth="0.5"
          />
        ))}
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
          <line
            key={lon}
            x1={toSVG(lon, 0)[0]}
            y1="0"
            x2={toSVG(lon, 0)[0]}
            y2="450"
            stroke="#E0DADA"
            strokeWidth="0.5"
          />
        ))}

        {/* Country paths */}
        {neutralFirst.map((country) => {
          const isHov = hovered === country.code;
          const fill = isHov
            ? CATEGORY_HOVER[country.category]
            : CATEGORY_COLOR[country.category];

          const hasResult =
            showResults && campaignMap[country.code];
          const resultFill = hasResult
            ? country.category === "high"
              ? "#2d5c08"
              : "#82a322"
            : fill;

          return (
            <path
              key={country.code}
              d={polyPath(country.points)}
              fill={resultFill}
              stroke="#fff"
              strokeWidth="0.8"
              strokeLinejoin="round"
              style={{ cursor: "pointer", transition: "fill 0.2s" }}
              onMouseEnter={() => setHovered(country.code)}
              onMouseLeave={() => {
                setHovered(null);
                setTooltip(null);
              }}
              onMouseMove={(e) => handleMouseMove(e, country)}
              onClick={() => onCountryClick?.(country.name)}
            />
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x + 8, 760)}
              y={Math.max(tooltip.y - 60, 4)}
              width={showResults && tooltip.campaignData ? 190 : 160}
              height={showResults && tooltip.campaignData ? 78 : 56}
              rx="6"
              ry="6"
              fill="rgba(0,0,0,0.82)"
            />
            <text
              x={Math.min(tooltip.x + 16, 768)}
              y={Math.max(tooltip.y - 40, 22)}
              fill="white"
              fontSize="11"
              fontWeight="700"
              fontFamily="serif"
            >
              {tooltip.country.name}
            </text>
            {tooltip.country.category !== "inaccessible" ? (
              <>
                <text
                  x={Math.min(tooltip.x + 16, 768)}
                  y={Math.max(tooltip.y - 24, 38)}
                  fill="#c8f088"
                  fontSize="9.5"
                >
                  Reach Power: ~{formatNum(reachPerDollar(tooltip.country.cpm))} views/$1
                </text>
                <text
                  x={Math.min(tooltip.x + 16, 768)}
                  y={Math.max(tooltip.y - 10, 52)}
                  fill="#aaa"
                  fontSize="9"
                >
                  CPM ≈ ${tooltip.country.cpm.toFixed(2)}
                </text>
                {showResults && tooltip.campaignData && (
                  <>
                    <text
                      x={Math.min(tooltip.x + 16, 768)}
                      y={Math.max(tooltip.y + 6, 68)}
                      fill="#82ff82"
                      fontSize="9"
                    >
                      Reached: {formatNum(tooltip.campaignData.totalReach)} · Reactions: {formatNum(tooltip.campaignData.totalReactions)}
                    </text>
                  </>
                )}
              </>
            ) : (
              <text
                x={Math.min(tooltip.x + 16, 768)}
                y={Math.max(tooltip.y - 24, 38)}
                fill="#ff9999"
                fontSize="9.5"
              >
                Not accessible via Meta Ads
              </text>
            )}
          </g>
        )}

        {/* Results toggle button */}
        <g
          style={{ cursor: "pointer" }}
          onClick={() => setShowResults(!showResults)}
        >
          <rect
            x="780"
            y="415"
            width="110"
            height="26"
            rx="13"
            fill={showResults ? "#4a7c10" : "rgba(0,0,0,0.5)"}
          />
          <text x="835" y="431" fill="white" fontSize="9.5" textAnchor="middle" fontWeight="600">
            {showResults ? "● Results ON" : "○ Results OFF"}
          </text>
        </g>

        {/* Legend */}
        <g transform="translate(8, 380)">
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
