import { schedule } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function currentMonthLabel(): string {
  const now = new Date();
  return `${MONTHS[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
}

interface MetaAction {
  action_type: string;
  value: string;
}

interface MetaInsightData {
  reach?: string;
  spend?: string;
  actions?: MetaAction[];
}

interface MetaInsightsResponse {
  data?: MetaInsightData[];
  error?: { message: string; type: string; code: number };
}

const handler = schedule("0 0 * * *", async () => {
  const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!META_ACCESS_TOKEN || !AD_ACCOUNT_ID || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("sync-meta: missing required environment variables");
    return { statusCode: 500, body: "Missing environment variables" };
  }

  const monthYear = currentMonthLabel();
  console.log(`sync-meta: syncing data for ${monthYear}`);

  try {
    const url = new URL(
      `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/insights`
    );
    url.searchParams.set("fields", "reach,actions,spend");
    url.searchParams.set("date_preset", "this_month");
    url.searchParams.set("level", "account");
    url.searchParams.set("access_token", META_ACCESS_TOKEN);

    const metaRes = await fetch(url.toString());
    const metaJson = (await metaRes.json()) as MetaInsightsResponse;

    if (metaJson.error) {
      console.error("sync-meta: Meta API error:", metaJson.error.message);
      return { statusCode: 500, body: `Meta API error: ${metaJson.error.message}` };
    }

    const insight: MetaInsightData = metaJson.data?.[0] ?? {};

    const peopleReached = insight.reach ? Number(insight.reach) : 0;

    const engagement = (insight.actions ?? [])
      .filter((a) => ["like", "share", "comment"].includes(a.action_type))
      .reduce((sum, a) => sum + Number(a.value), 0);

    const spend = insight.spend != null ? Number(insight.spend) : null;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: existing, error: selectError } = await supabase
      .from("transparency_ledger")
      .select("id")
      .eq("month_year", monthYear)
      .maybeSingle();

    if (selectError) {
      console.error("sync-meta: Supabase select error:", selectError.message);
      return { statusCode: 500, body: `Supabase error: ${selectError.message}` };
    }

    const updatePayload: Record<string, unknown> = {
      people_reached: peopleReached,
      engagement,
    };
    if (spend !== null) {
      updatePayload.total_budget = spend;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("transparency_ledger")
        .update(updatePayload)
        .eq("month_year", monthYear);

      if (updateError) {
        console.error("sync-meta: Supabase update error:", updateError.message);
        return { statusCode: 500, body: `Supabase error: ${updateError.message}` };
      }
      console.log(`sync-meta: updated row for ${monthYear} — reach=${peopleReached}, engagement=${engagement}, spend=${spend ?? "unchanged"}`);
    } else {
      const insertPayload: Record<string, unknown> = {
        month_year: monthYear,
        people_reached: peopleReached,
        engagement,
        countries: 0,
        donors: 0,
        total_budget: spend ?? 0,
      };

      const { error: insertError } = await supabase
        .from("transparency_ledger")
        .insert(insertPayload);

      if (insertError) {
        console.error("sync-meta: Supabase insert error:", insertError.message);
        return { statusCode: 500, body: `Supabase error: ${insertError.message}` };
      }
      console.log(`sync-meta: inserted new row for ${monthYear} — reach=${peopleReached}, engagement=${engagement}, spend=${spend ?? 0}`);
    }

    return { statusCode: 200, body: `Synced ${monthYear} successfully` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("sync-meta: unexpected error:", message);
    return { statusCode: 500, body: `Unexpected error: ${message}` };
  }
});

export { handler };
