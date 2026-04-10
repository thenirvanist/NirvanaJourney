import type { Context } from "@netlify/edge-functions";

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function replaceMeta(html: string, attr: string, value: string): string {
  const re = new RegExp(`<meta\\s+${attr}[^>]*/>`, "i");
  const tag = `<meta ${attr} content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `${tag}\n</head>`);
}

export default async function sageMetaHandler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (pathParts.length < 2 || pathParts[0] !== "sages") {
    return context.next();
  }

  const slug = pathParts[1];

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return context.next();
  }

  let sage: { name: string; description: string | null; image: string | null } | null = null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/sages?select=name,description,image`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    if (res.ok) {
      const sages: Array<{ name: string; description: string | null; image: string | null }> =
        await res.json();
      sage = sages.find((s) => slugify(s.name) === slug) ?? null;
    }
  } catch {
    // Supabase unreachable — serve unmodified HTML
  }

  const response = await context.next();

  if (!sage) {
    return response;
  }

  const title = `Biography of ${sage.name} | The Nirvanist`;
  const description =
    (sage.description ?? "").slice(0, 160) ||
    "Explore the life and teachings of a spiritual sage on The Nirvanist.";
  const image = sage.image ?? "https://www.thenirvanist.com/og-image.png";
  const sageUrl = `https://www.thenirvanist.com/sages/${slug}`;

  let html = await response.text();

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  html = replaceMeta(html, 'name="description"', description);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', description);
  html = replaceMeta(html, 'property="og:image"', image);
  html = replaceMeta(html, 'property="og:type"', "profile");
  html = replaceMeta(html, 'property="og:url"', sageUrl);
  html = replaceMeta(html, 'name="twitter:title"', title);
  html = replaceMeta(html, 'name="twitter:description"', description);
  html = replaceMeta(html, 'name="twitter:image"', image);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status: response.status,
  });
}
