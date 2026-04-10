import type { Context } from "@netlify/edge-functions";

const BASE_URL = "https://www.thenirvanist.com";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function urlEntry(
  loc: string,
  opts: { changefreq: string; priority: string; lastmod?: string }
): string {
  const lastmodLine = opts.lastmod ? `\n    <lastmod>${opts.lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${loc}</loc>${lastmodLine}
    <changefreq>${opts.changefreq}</changefreq>
    <priority>${opts.priority}</priority>
  </url>`;
}

export default async function sitemapHandler(_request: Request, _context: Context) {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    urlEntry(`${BASE_URL}/`, { changefreq: "daily", priority: "1.0", lastmod: today }),
    urlEntry(`${BASE_URL}/sages`, { changefreq: "weekly", priority: "0.9", lastmod: today }),
    urlEntry(`${BASE_URL}/journeys`, { changefreq: "weekly", priority: "0.9", lastmod: today }),
    urlEntry(`${BASE_URL}/meetups`, { changefreq: "weekly", priority: "0.8", lastmod: today }),
    urlEntry(`${BASE_URL}/heal`, { changefreq: "weekly", priority: "0.8", lastmod: today }),
    urlEntry(`${BASE_URL}/inner-nutrition`, { changefreq: "weekly", priority: "0.8", lastmod: today }),
    urlEntry(`${BASE_URL}/about`, { changefreq: "monthly", priority: "0.7", lastmod: today }),
    urlEntry(`${BASE_URL}/about/us`, { changefreq: "monthly", priority: "0.7", lastmod: today }),
    urlEntry(`${BASE_URL}/about/how-we-explore`, { changefreq: "monthly", priority: "0.6", lastmod: today }),
  ];

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  const dynamicPages: string[] = [];

  if (supabaseUrl && supabaseKey) {
    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    try {
      const [sagesRes, blogRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/sages?select=name`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/blog_posts?select=slug`, { headers }),
      ]);

      if (sagesRes.ok) {
        const sages: Array<{ name: string }> = await sagesRes.json();
        for (const sage of sages) {
          const slug = slugify(sage.name);
          if (slug) {
            dynamicPages.push(
              urlEntry(`${BASE_URL}/sages/${slug}`, { changefreq: "monthly", priority: "0.8" })
            );
          }
        }
      }

      if (blogRes.ok) {
        const posts: Array<{ slug: string }> = await blogRes.json();
        for (const post of posts) {
          if (post.slug) {
            dynamicPages.push(
              urlEntry(`${BASE_URL}/inner-nutrition/${post.slug}`, {
                changefreq: "monthly",
                priority: "0.8",
              })
            );
          }
        }
      }
    } catch {
      // Supabase unreachable — serve static pages only
    }
  }

  const allEntries = [...staticPages, ...dynamicPages].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allEntries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
