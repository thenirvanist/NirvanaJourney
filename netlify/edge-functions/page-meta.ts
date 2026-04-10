import type { Context } from "@netlify/edge-functions";

const BASE_URL = "https://www.thenirvanist.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceMeta(html: string, attr: string, value: string): string {
  const re = new RegExp(`<meta\\s+${attr}[^>]*/>`, "i");
  const tag = `<meta ${attr} content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function injectMeta(
  html: string,
  opts: {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    ogType?: string;
    noindex?: boolean;
  }
): string {
  const { title, description, image, url, ogType = "website", noindex = false } = opts;
  const fullTitle = `${title} | The Nirvanist`;
  const desc = description ?? "";
  const img = image ?? DEFAULT_IMAGE;
  const canonUrl = url ?? BASE_URL;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(fullTitle)}</title>`);

  if (noindex) {
    html = replaceMeta(html, 'name="robots"', "noindex, nofollow");
  }

  if (desc) {
    html = replaceMeta(html, 'name="description"', desc);
  }

  html = replaceMeta(html, 'property="og:title"', fullTitle);
  html = replaceMeta(html, 'property="og:type"', ogType);
  html = replaceMeta(html, 'property="og:url"', canonUrl);

  if (desc) {
    html = replaceMeta(html, 'property="og:description"', desc);
  }

  html = replaceMeta(html, 'property="og:image"', img);
  html = replaceMeta(html, 'name="twitter:title"', fullTitle);

  if (desc) {
    html = replaceMeta(html, 'name="twitter:description"', desc);
  }

  html = replaceMeta(html, 'name="twitter:image"', img);

  return html;
}

// Static page metadata map
const STATIC_PAGES: Record<string, { title: string; description: string; noindex?: boolean }> = {
  "/sages": {
    title: "Spiritual Sages & Masters",
    description:
      "Explore the lives and teachings of enlightened sages and spiritual masters across traditions. Discover Hindu, Buddhist, Sufi, and Jain wisdom.",
  },
  "/journeys": {
    title: "Sacred Journeys",
    description:
      "Embark on curated sacred journeys to spiritual destinations around the world. Transform your life through authentic pilgrimage experiences.",
  },
  "/sacred-journeys": {
    title: "Sacred Journeys",
    description:
      "Discover sacred journeys and spiritual retreats designed for deep inner transformation and holistic well-being.",
  },
  "/meetups": {
    title: "Satsangs & Spiritual Gatherings",
    description:
      "Join our global community for weekly online satsangs and spiritual gatherings. Connect with seekers worldwide for meditation and reflection.",
  },
  "/heal": {
    title: "Heal the World",
    description:
      "Support spiritual philanthropy initiatives and help heal communities around the world through compassion and service.",
  },
  "/inner-nutrition": {
    title: "Inner Nutrition",
    description:
      "Nourish your soul with wisdom articles, spiritual teachings, and insights from sages and teachers across traditions.",
  },
  "/about/us": {
    title: "About Us",
    description:
      "Meet the founders of The Nirvanist, dedicated to sharing Indian philosophical wisdom and creating transformative spiritual experiences.",
  },
  "/about/how-we-explore": {
    title: "How We Explore",
    description:
      "Discover how we explore Indian philosophy together through newsletters, virtual satsangs, group sessions, and ashram visits.",
  },
  "/about/why-indian-philosophies": {
    title: "Why Indian Philosophies",
    description:
      "Discover why Indian philosophy offers a wealth of inspiring thoughts and wisdom to help make sense of our existence and live with more peace.",
  },
  "/about/understanding": {
    title: "Understanding Indian Philosophies",
    description:
      "Explore the rich tapestry of Indian philosophical traditions from the Vedas to the Puranas, and understand the core concepts that unite them.",
  },
  "/ashrams": {
    title: "Sacred Ashrams",
    description:
      "Discover sacred ashrams across India and beyond. Find the perfect retreat for meditation, yoga, and spiritual growth.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Get in touch with The Nirvanist team. We'd love to hear from you about spiritual journeys, retreats, and community gatherings.",
  },
  "/daily-quotes": {
    title: "Daily Wisdom Quotes",
    description:
      "Receive daily spiritual wisdom quotes from enlightened sages, spiritual teachers, and philosophical traditions across the world.",
  },
  "/confirm-newsletter": {
    title: "Newsletter Confirmed",
    description: "You've successfully subscribed to The Nirvanist newsletter. Welcome to our spiritual community.",
  },
  "/login": { title: "Login", description: "", noindex: true },
  "/register": { title: "Register", description: "", noindex: true },
  "/forgot-password": { title: "Reset Your Password", description: "", noindex: true },
  "/dashboard": { title: "My Dashboard", description: "", noindex: true },
};

export default async function pageMetaHandler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Pass through: homepage (already has correct generic metadata in index.html)
  if (pathname === "/") return context.next();

  // Pass through: file assets (JS, CSS, images, fonts, etc.)
  if (/\.[a-z0-9]+$/i.test(pathname)) return context.next();

  // Pass through: API, admin, auth paths
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_netlify/")
  ) {
    return context.next();
  }

  // Pass through: sage detail pages — handled by sage-meta edge function
  // (sage-meta runs first and terminates the chain for /sages/:slug)
  if (/^\/sages\/.+/.test(pathname)) return context.next();

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  // --- Dynamic route: /journeys/:id ---
  const journeyMatch = pathname.match(/^\/journeys\/(\d+)$/);
  if (journeyMatch && supabaseUrl && supabaseKey) {
    const id = journeyMatch[1];
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/journeys?select=title,description,image,hero_image&id=eq.${id}`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      if (res.ok) {
        const rows: Array<{
          title: string;
          description: string;
          image: string;
          hero_image: string | null;
        }> = await res.json();
        const journey = rows[0];
        if (journey) {
          const response = await context.next();
          let html = await response.text();
          html = injectMeta(html, {
            title: `${journey.title} — Sacred Journey`,
            description: journey.description?.slice(0, 160),
            image: journey.hero_image ?? journey.image,
            url: `${BASE_URL}${pathname}`,
          });
          return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
            status: response.status,
          });
        }
      }
    } catch {
      // Fall through to generic
    }
    return context.next();
  }

  // --- Dynamic route: /ashrams/:id ---
  const ashramMatch = pathname.match(/^\/ashrams\/(\d+)$/);
  if (ashramMatch && supabaseUrl && supabaseKey) {
    const id = ashramMatch[1];
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/ashrams?select=name,description,image&id=eq.${id}`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      if (res.ok) {
        const rows: Array<{ name: string; description: string; image: string }> =
          await res.json();
        const ashram = rows[0];
        if (ashram) {
          const response = await context.next();
          let html = await response.text();
          html = injectMeta(html, {
            title: `${ashram.name} — Sacred Ashram`,
            description: ashram.description?.slice(0, 160),
            image: ashram.image,
            url: `${BASE_URL}${pathname}`,
          });
          return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
            status: response.status,
          });
        }
      }
    } catch {
      // Fall through to generic
    }
    return context.next();
  }

  // --- Dynamic route: /inner-nutrition/:slug ---
  const blogMatch = pathname.match(/^\/inner-nutrition\/([^/]+)$/);
  if (blogMatch && supabaseUrl && supabaseKey) {
    const slug = blogMatch[1];
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?select=title,excerpt,image,banner_image&slug=eq.${encodeURIComponent(slug)}`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      if (res.ok) {
        const rows: Array<{
          title: string;
          excerpt: string;
          image: string;
          banner_image: string | null;
        }> = await res.json();
        const post = rows[0];
        if (post) {
          const response = await context.next();
          let html = await response.text();
          html = injectMeta(html, {
            title: post.title,
            description: post.excerpt?.slice(0, 160),
            image: post.banner_image ?? post.image,
            url: `${BASE_URL}${pathname}`,
            ogType: "article",
          });
          return new Response(html, {
            headers: { "content-type": "text/html; charset=utf-8" },
            status: response.status,
          });
        }
      }
    } catch {
      // Fall through to generic
    }
    return context.next();
  }

  // --- Static page lookup ---
  const staticMeta = STATIC_PAGES[pathname];
  if (staticMeta) {
    const response = await context.next();
    let html = await response.text();
    html = injectMeta(html, {
      title: staticMeta.title,
      description: staticMeta.description || undefined,
      url: `${BASE_URL}${pathname}`,
      noindex: staticMeta.noindex,
    });
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
      status: response.status,
    });
  }

  // All other paths — pass through unmodified
  return context.next();
}
