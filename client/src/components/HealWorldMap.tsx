import { useState, useRef } from "react";
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
    points: [[22,22],[24,22],[25,23],[36,23],[38,21],[38,19],[37,14],[37,10],[34,8],[30,8],[22,8],[22,14]],
  },
  {
    code: "UA",
    name: "Ukraine",
    category: "high",
    cpm: 1.2,
    points: [[22,52],[28,52],[32,52],[35,51],[38,50],[40,48],[39,46],[38,44],[34,44],[30,44],[26,46],[23,48],[22,50]],
  },
  {
    code: "PS",
    name: "Palestine",
    category: "high",
    cpm: 0.85,
    points: [[34.2,31.8],[35.0,31.8],[35.5,31.5],[35.2,31.0],[34.9,29.5],[34.2,29.5]],
  },
  {
    code: "MM",
    name: "Myanmar",
    category: "high",
    cpm: 0.32,
    points: [[92,28],[96,26],[100,26],[101,24],[100,20],[100,15],[99,10],[97,8],[94,10],[93,16],[92,20],[92,24]],
  },
  {
    code: "YE",
    name: "Yemen",
    category: "high",
    cpm: 0.45,
    points: [[43,19],[48,19],[52,19],[54,18],[54,13],[51,12],[45,12],[43,13],[43,16]],
  },
  {
    code: "SY",
    name: "Syria",
    category: "high",
    cpm: 0.9,
    points: [[36,37],[42,37],[42,36],[42,34],[40,33],[38,33],[36,34],[36,36]],
  },
  {
    code: "SO",
    name: "Somalia",
    category: "high",
    cpm: 0.22,
    points: [[41,12],[44,12],[48,11],[51,11],[51,8],[50,6],[48,4],[45,2],[44,-1],[41,-1],[41,4],[41,8]],
  },
  {
    code: "AF",
    name: "Afghanistan",
    category: "high",
    cpm: 0.38,
    points: [[61,38],[66,38],[68,37],[70,38],[74,37],[75,36],[74,29],[66,29],[61,30],[61,34]],
  },
  {
    code: "LY",
    name: "Libya",
    category: "high",
    cpm: 0.68,
    points: [[9,33],[12,33],[15,32],[20,33],[24,33],[25,31],[25,22],[25,19],[12,19],[9,19]],
  },
  {
    code: "ML",
    name: "Mali",
    category: "high",
    cpm: 0.21,
    points: [[-5,25],[4,25],[4,22],[2,18],[2,14],[0,14],[0,12],[-3,10],[-4,11],[-5,14],[-5,18]],
  },
  {
    code: "CD",
    name: "DR Congo",
    category: "high",
    cpm: 0.19,
    points: [[12,5],[14,5],[18,4],[22,4],[24,4],[28,3],[30,2],[31,0],[31,-5],[30,-8],[30,-12],[28,-14],[24,-14],[20,-14],[16,-14],[12,-10],[12,-4],[12,2]],
  },
  {
    code: "ET",
    name: "Ethiopia",
    category: "high",
    cpm: 0.25,
    points: [[33,15],[36,15],[40,15],[45,13],[48,12],[48,10],[46,8],[44,4],[42,4],[39,4],[36,5],[34,8],[33,12]],
  },
  {
    code: "CF",
    name: "Central African Republic",
    category: "high",
    cpm: 0.18,
    points: [[14,11],[18,11],[22,11],[26,11],[27,11],[27,7],[25,5],[22,4],[18,5],[16,4],[14,6]],
  },
  // ── MID NEED (economic / indirect impact) ─────────────────────────────
  {
    code: "IQ",
    name: "Iraq",
    category: "mid",
    cpm: 0.72,
    points: [[38,37],[42,38],[46,37],[48,36],[48,33],[46,30],[44,29],[40,29],[39,31],[38,33],[38,36]],
  },
  {
    code: "PK",
    name: "Pakistan",
    category: "mid",
    cpm: 0.3,
    points: [[60,37],[62,37],[66,36],[70,36],[72,37],[75,36],[74,29],[72,26],[68,23],[62,23],[60,25],[60,30]],
  },
  {
    code: "BD",
    name: "Bangladesh",
    category: "mid",
    cpm: 0.29,
    points: [[88.1,26.6],[92.7,26.6],[92.6,24.0],[91.9,22.8],[89.2,21.8],[88.1,22.5]],
  },
  {
    code: "VE",
    name: "Venezuela",
    category: "mid",
    cpm: 0.55,
    points: [[-73,12],[-66,12],[-60,11],[-59,6],[-61,4],[-63,4],[-68,2],[-72,4],[-73,7]],
  },
  {
    code: "HT",
    name: "Haiti",
    category: "mid",
    cpm: 0.48,
    points: [[-74.5,20],[-72.5,20],[-72.0,18.5],[-74.0,18.5]],
  },
  {
    code: "NG",
    name: "Nigeria",
    category: "mid",
    cpm: 0.24,
    points: [[3,14],[12,14],[14,13],[15,11],[14,8],[13,6],[8,4],[4,4],[3,6],[2,8],[2,12]],
  },
  {
    code: "NE",
    name: "Niger",
    category: "mid",
    cpm: 0.2,
    points: [[2,24],[14,24],[15,22],[16,16],[15,14],[14,14],[13,12],[8,12],[3,12],[2,14],[2,18]],
  },
  {
    code: "TD",
    name: "Chad",
    category: "mid",
    cpm: 0.19,
    points: [[13,24],[16,24],[24,22],[24,14],[24,12],[22,10],[20,10],[17,8],[16,8],[13,8],[13,14]],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    category: "mid",
    cpm: 0.2,
    points: [[-5,15],[0,15],[2,14],[2,12],[0,10],[-2,10],[-5,11],[-5,14]],
  },
  {
    code: "MZ",
    name: "Mozambique",
    category: "mid",
    cpm: 0.21,
    points: [[32,-10],[36,-12],[36,-16],[36,-20],[35,-24],[34,-26],[33,-27],[32,-25],[34,-22],[34,-18],[32,-14]],
  },
  {
    code: "LB",
    name: "Lebanon",
    category: "mid",
    cpm: 0.95,
    points: [[35.1,34.7],[36.6,34.7],[36.6,33.1],[35.1,33.1]],
  },
  {
    code: "IR",
    name: "Iran",
    category: "mid",
    cpm: 0.58,
    points: [[44,40],[50,40],[54,38],[60,38],[62,37],[63,36],[63,30],[60,26],[56,26],[52,26],[48,24],[44,28],[44,32],[44,36]],
  },
  {
    code: "MR",
    name: "Mauritania",
    category: "mid",
    cpm: 0.22,
    points: [[-17,27],[-9,27],[-5,24],[-5,18],[-7,18],[-12,16],[-17,16]],
  },
  {
    code: "GN",
    name: "Guinea",
    category: "mid",
    cpm: 0.2,
    points: [[-15,12],[-11,12],[-8.5,11],[-8.5,7.5],[-11,7.5],[-14,8],[-15,9]],
  },
  // ── INACCESSIBLE ──────────────────────────────────────────────────────
  {
    code: "KP",
    name: "North Korea",
    category: "inaccessible",
    cpm: 0,
    points: [[124,42],[130,42],[130,40],[129,38],[126,37],[124,39],[124,41]],
  },
  {
    code: "CU",
    name: "Cuba",
    category: "inaccessible",
    cpm: 0,
    points: [[-84,22],[-80,23],[-76,23],[-74,22],[-75,20],[-82,20],[-84,21]],
  },
  // ── NEUTRAL / BACKGROUND ──────────────────────────────────────────────
  {
    code: "RU",
    name: "Russia",
    category: "neutral",
    cpm: 1.5,
    points: [[30,72],[60,72],[90,73],[120,74],[150,72],[170,66],[180,65],[180,52],[160,52],[140,52],[120,54],[100,50],[80,52],[60,56],[50,55],[42,54],[36,62],[30,66]],
  },
  {
    code: "CA",
    name: "Canada",
    category: "neutral",
    cpm: 8.2,
    points: [[-140,70],[-90,72],[-60,72],[-55,58],[-60,46],[-76,44],[-82,44],[-90,46],[-100,49],[-120,49],[-130,54],[-140,60]],
  },
  {
    code: "US",
    name: "United States",
    category: "neutral",
    cpm: 14.8,
    points: [[-125,48],[-100,48],[-75,44],[-67,44],[-65,38],[-76,34],[-80,25],[-90,26],[-100,28],[-110,31],[-120,34],[-125,38]],
  },
  {
    code: "MX",
    name: "Mexico",
    category: "neutral",
    cpm: 1.8,
    points: [[-117,32],[-100,28],[-97,24],[-94,18],[-88,16],[-90,16],[-92,16],[-94,20],[-117,24]],
  },
  {
    code: "BR",
    name: "Brazil",
    category: "neutral",
    cpm: 1.2,
    points: [[-72,5],[-55,4],[-35,5],[-35,-10],[-38,-15],[-42,-22],[-48,-28],[-53,-34],[-56,-34],[-66,-34],[-74,-16],[-74,-8],[-72,0]],
  },
  {
    code: "AR",
    name: "Argentina",
    category: "neutral",
    cpm: 1.5,
    points: [[-68,-22],[-54,-22],[-54,-28],[-60,-40],[-66,-56],[-74,-50],[-74,-38],[-68,-32]],
  },
  {
    code: "CL",
    name: "Chile",
    category: "neutral",
    cpm: 2.1,
    points: [[-68,-18],[-70,-20],[-74,-38],[-72,-50],[-68,-55],[-66,-56],[-65,-52],[-65,-38],[-66,-24]],
  },
  {
    code: "CO",
    name: "Colombia",
    category: "neutral",
    cpm: 0.8,
    points: [[-77,8],[-72,12],[-67,12],[-66,2],[-68,-2],[-74,-2],[-77,0],[-78,4]],
  },
  {
    code: "PE",
    name: "Peru",
    category: "neutral",
    cpm: 0.7,
    points: [[-80,0],[-74,2],[-70,0],[-70,-6],[-68,-14],[-68,-18],[-76,-16],[-80,-8]],
  },
  {
    code: "GL",
    name: "Greenland",
    category: "neutral",
    cpm: 0,
    points: [[-72,76],[-20,83],[-17,76],[-22,70],[-32,65],[-48,60],[-72,63]],
  },
  {
    code: "CN",
    name: "China",
    category: "neutral",
    cpm: 0.65,
    points: [[73,46],[80,50],[86,48],[92,50],[100,50],[110,53],[122,47],[130,47],[135,46],[135,40],[122,32],[118,24],[108,20],[102,22],[100,22],[92,28],[86,28],[80,36],[76,36],[73,40]],
  },
  {
    code: "MN",
    name: "Mongolia",
    category: "neutral",
    cpm: 0.4,
    points: [[87,49],[92,50],[100,50],[110,50],[120,48],[120,42],[114,42],[107,44],[100,42],[92,42],[87,44]],
  },
  {
    code: "IN",
    name: "India",
    category: "neutral",
    cpm: 0.3,
    points: [[68,36],[72,36],[78,34],[80,32],[84,28],[90,26],[92,26],[88,22],[82,24],[76,20],[72,20],[68,22],[66,24],[68,28],[68,32]],
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    category: "neutral",
    cpm: 0.6,
    points: [[50,55],[60,56],[68,55],[78,55],[82,52],[84,50],[80,44],[72,40],[62,40],[52,44],[50,46]],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    category: "neutral",
    cpm: 1.2,
    points: [[36,30],[38,30],[42,32],[50,32],[56,28],[56,22],[54,18],[50,16],[44,14],[40,16],[36,22],[36,26]],
  },
  {
    code: "TR",
    name: "Turkey",
    category: "neutral",
    cpm: 0.95,
    points: [[26,42],[32,42],[36,42],[40,40],[44,40],[44,37],[42,36],[38,36],[34,36],[30,36],[26,38],[26,40]],
  },
  {
    code: "EG",
    name: "Egypt",
    category: "neutral",
    cpm: 0.55,
    points: [[25,32],[32,32],[36,30],[37,22],[34,22],[32,20],[25,22]],
  },
  {
    code: "DZ",
    name: "Algeria",
    category: "neutral",
    cpm: 0.4,
    points: [[-8,37],[8,37],[9,34],[9,28],[4,24],[2,20],[0,18],[-5,18],[-8,22],[-8,30]],
  },
  {
    code: "MA",
    name: "Morocco",
    category: "neutral",
    cpm: 0.6,
    points: [[-14,36],[-2,36],[-1,34],[-2,32],[-2,28],[-8,28],[-14,30],[-14,34]],
  },
  {
    code: "EU",
    name: "Europe",
    category: "neutral",
    cpm: 6.5,
    points: [[-10,71],[30,72],[40,60],[44,46],[36,36],[30,34],[20,36],[12,36],[8,36],[-2,42],[-10,44],[-5,50],[10,54],[12,60],[-2,62],[-10,64]],
  },
  {
    code: "JP",
    name: "Japan",
    category: "neutral",
    cpm: 4.2,
    points: [[130,32],[132,34],[134,35],[136,36],[138,38],[141,40],[141,43],[140,45],[138,44],[136,40],[134,35],[132,33]],
  },
  {
    code: "KR",
    name: "South Korea",
    category: "neutral",
    cpm: 2.8,
    points: [[126,38],[130,38],[130,34],[127,34],[126,36]],
  },
  {
    code: "ID",
    name: "Indonesia",
    category: "neutral",
    cpm: 0.45,
    points: [[95,5],[102,5],[104,1],[110,-2],[115,-4],[120,-8],[126,-8],[130,-4],[136,-4],[140,-8],[141,-10],[130,-9],[120,-10],[114,-8],[108,-8],[100,-4],[95,1]],
  },
  {
    code: "PH",
    name: "Philippines",
    category: "neutral",
    cpm: 0.5,
    points: [[116,20],[118,22],[122,18],[125,16],[126,10],[124,8],[120,6],[118,8],[116,14],[116,18]],
  },
  {
    code: "VN",
    name: "Vietnam",
    category: "neutral",
    cpm: 0.4,
    points: [[104,23],[108,23],[108,20],[108,16],[107,12],[106,10],[104,10],[102,12],[102,16],[103,20]],
  },
  {
    code: "TH",
    name: "Thailand",
    category: "neutral",
    cpm: 0.6,
    points: [[98,20],[102,20],[102,14],[102,10],[100,6],[99,4],[98,8],[97,12],[97,16],[98,18]],
  },
  {
    code: "AU",
    name: "Australia",
    category: "neutral",
    cpm: 5.8,
    points: [[114,-22],[120,-18],[124,-14],[130,-12],[138,-14],[140,-18],[142,-22],[148,-24],[154,-28],[150,-38],[144,-38],[136,-36],[128,-34],[115,-34],[113,-26]],
  },
  {
    code: "ZA",
    name: "South Africa",
    category: "neutral",
    cpm: 0.8,
    points: [[16,-28],[22,-28],[28,-28],[32,-28],[34,-30],[34,-34],[28,-36],[22,-34],[18,-34],[16,-32]],
  },
  {
    code: "AO",
    name: "Angola",
    category: "neutral",
    cpm: 0.3,
    points: [[12,-5],[16,-5],[20,-6],[24,-6],[24,-18],[20,-22],[14,-18],[12,-12]],
  },
  {
    code: "TZ",
    name: "Tanzania",
    category: "neutral",
    cpm: 0.28,
    points: [[30,-1],[34,-1],[40,-3],[40,-9],[38,-11],[36,-11],[34,-12],[30,-10],[29,-6],[30,-2]],
  },
  {
    code: "KE",
    name: "Kenya",
    category: "neutral",
    cpm: 0.35,
    points: [[34,5],[38,4],[42,2],[42,-1],[40,-4],[34,-4],[34,-1]],
  },
  {
    code: "MG",
    name: "Madagascar",
    category: "neutral",
    cpm: 0.22,
    points: [[44,-12],[48,-14],[50,-16],[50,-22],[48,-26],[44,-26],[44,-20],[44,-16]],
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
              width={190}
              height={44}
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
              <text
                x={Math.min(tooltip.x + 16, 768)}
                y={Math.max(tooltip.y - 24, 38)}
                fill="#c8f088"
                fontSize="9.5"
              >
                {showResults
                  ? "Souls reached: " + formatNum(tooltip.campaignData?.totalReach ?? 0)
                  : "Reach per US $1: ~" + formatNum(reachPerDollar(tooltip.country.cpm))}
              </text>
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
