const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const PIXEL_ID = process.env.META_PIXEL_ID;
  const TOKEN = process.env.META_ACCESS_TOKEN_CAPI;

  if (!PIXEL_ID || !TOKEN) {
    console.error("meta-proxy: META_PIXEL_ID or META_ACCESS_TOKEN_CAPI not set");
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfiguration" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { eventName, eventId, url } = body;

  if (!eventName || !eventId) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing eventName or eventId" }),
    };
  }

  const forwarded = (event.headers && event.headers["x-forwarded-for"]) || "";
  const ip = forwarded.split(",")[0].trim() || undefined;
  const ua = (event.headers && event.headers["user-agent"]) || undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: url || "",
        action_source: "website",
        user_data: {
          ...(ip ? { client_ip_address: ip } : {}),
          ...(ua ? { client_user_agent: ua } : {}),
        },
      },
    ],
  };

  if (process.env.META_TEST_CODE) {
    payload.test_event_code = process.env.META_TEST_CODE;
  }

  try {
    const metaRes = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await metaRes.json();

    if (!metaRes.ok) {
      console.error("meta-proxy: Graph API error", JSON.stringify(data));
      return {
        statusCode: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Graph API error", detail: data }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, events_received: data.events_received }),
    };
  } catch (err) {
    console.error("meta-proxy: fetch failed", err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Upstream fetch failed" }),
    };
  }
};
