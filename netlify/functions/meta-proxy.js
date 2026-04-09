import crypto from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sha256(value) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function ok200(data) {
  return {
    statusCode: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export const handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return ok200({ ok: false, error: "Method not allowed" });
  }

  const PIXEL_ID = process.env.META_PIXEL_ID;
  const TOKEN = process.env.META_ACCESS_TOKEN_CAPI;

  if (!PIXEL_ID || !TOKEN) {
    console.error("[meta-proxy] META_PIXEL_ID or META_ACCESS_TOKEN_CAPI not set");
    return ok200({ ok: false, error: "Server misconfiguration — env vars missing" });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (parseErr) {
    console.error("[meta-proxy] JSON parse error:", parseErr.message);
    return ok200({ ok: false, error: "Invalid JSON body" });
  }

  const { eventName, eventId, url, email, phone, firstName, lastName } = body;

  if (!eventName || !eventId) {
    console.error("[meta-proxy] Missing eventName or eventId in payload");
    return ok200({ ok: false, error: "Missing eventName or eventId" });
  }

  const forwarded = (event.headers && event.headers["x-forwarded-for"]) || "";
  const ip = forwarded.split(",")[0].trim() || undefined;
  const ua = (event.headers && event.headers["user-agent"]) || undefined;

  const userData = {
    ...(ip ? { client_ip_address: ip } : {}),
    ...(ua ? { client_user_agent: ua } : {}),
    ...(email ? { em: sha256(email) } : {}),
    ...(phone ? { ph: sha256(phone.replace(/\D/g, "")) } : {}),
    ...(firstName ? { fn: sha256(firstName) } : {}),
    ...(lastName ? { ln: sha256(lastName) } : {}),
  };

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: url || "",
        action_source: "website",
        user_data: userData,
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
      console.error("[meta-proxy] Graph API error:", JSON.stringify(data));
      return ok200({ ok: false, error: "Graph API error", detail: data });
    }

    console.log(`[meta-proxy] OK — event=${eventName} id=${eventId} received=${data.events_received}`);
    return ok200({ ok: true, events_received: data.events_received });
  } catch (err) {
    console.error("[meta-proxy] Upstream fetch failed:", err.message || err);
    return ok200({ ok: false, error: "Upstream fetch failed" });
  }
};
