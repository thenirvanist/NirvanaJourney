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

function sumActions(actions: MetaAction[], ...types: string[]): number {
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((sum, a) => sum + Number(a.value), 0);
}

async function fetchMetaInsights(
  adAccountId: string,
  token: string,
  datePreset: string,
  fields: string
): Promise<MetaInsightData | null> {
  const url = new URL(`https://graph.facebook.com/v19.0/act_${adAccountId}/insights`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("date_preset", datePreset);
  url.searchParams.set("level", "account");
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString());
  const json = (await res.json()) as MetaInsightsResponse;

  if (json.error) {
    throw new Error(`Meta API error: ${json.error.message}`);
  }
  return json.data?.[0] ?? null;
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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const monthYear = currentMonthLabel();

  let task1Success = false;
  let task2Success = false;

  // ── TASK 1: Monthly Ledger ─────────────────────────────────────────────────
  try {
    console.log(`sync-meta [task1]: fetching this_month data for ${monthYear}`);
    const insight = await fetchMetaInsights(AD_ACCOUNT_ID, META_ACCESS_TOKEN, "this_month", "reach,actions,spend");
    const monthly_outreach = insight?.reach ? Number(insight.reach) : 0;
    const engagement = sumActions(insight?.actions ?? [], "like", "share", "comment");
    const spend = insight?.spend != null ? Number(insight.spend) : null;

    const upsertPayload: Record<string, unknown> = {
      month_year: monthYear,
      monthly_outreach,
      engagement,
    };
    if (spend !== null) {
      upsertPayload.total_budget = spend;
    }

    const { error } = await supabase
      .from("transparency_ledger")
      .upsert(upsertPayload, { onConflict: "month_year", ignoreDuplicates: false });

    if (error) throw new Error(error.message);

    console.log(`sync-meta [task1]: success — outreach=${monthly_outreach}, engagement=${engagement}, spend=${spend ?? "unchanged"}`);
    task1Success = true;
  } catch (err) {
    console.error("sync-meta [task1]: failed —", err instanceof Error ? err.message : String(err));
  }

  // ── TASK 2: Global Success Bar (lifetime) ──────────────────────────────────
  try {
    console.log("sync-meta [task2]: fetching maximum (lifetime) data");
    const insight = await fetchMetaInsights(AD_ACCOUNT_ID, META_ACCESS_TOKEN, "maximum", "reach,actions");
    const newReach = insight?.reach ? Number(insight.reach) : 0;
    const newLikes = sumActions(insight?.actions ?? [], "post_reaction");
    const newShares = sumActions(insight?.actions ?? [], "post_share");
    const newComments = sumActions(insight?.actions ?? [], "comment");

    const { data: existing, error: selectError } = await supabase
      .from("heal_success_metrics")
      .select("total_unique_reach, total_likes, total_shares, total_comments")
      .eq("id", 1)
      .maybeSingle();

    if (selectError) throw new Error(selectError.message);

    const current = existing ?? { total_unique_reach: 0, total_likes: 0, total_shares: 0, total_comments: 0 };

    const updatePayload: Record<string, unknown> = {};
    if (newReach > Number(current.total_unique_reach ?? 0)) updatePayload.total_unique_reach = newReach;
    if (newLikes > Number(current.total_likes ?? 0)) updatePayload.total_likes = newLikes;
    if (newShares > Number(current.total_shares ?? 0)) updatePayload.total_shares = newShares;
    if (newComments > Number(current.total_comments ?? 0)) updatePayload.total_comments = newComments;

    if (Object.keys(updatePayload).length === 0) {
      console.log("sync-meta [task2]: no updates needed — all Meta values <= existing values");
    } else {
      const { error: updateError } = await supabase
        .from("heal_success_metrics")
        .update(updatePayload)
        .eq("id", 1);

      if (updateError) throw new Error(updateError.message);

      console.log("sync-meta [task2]: success — updated fields:", JSON.stringify(updatePayload));
    }

    task2Success = true;
  } catch (err) {
    console.error("sync-meta [task2]: failed —", err instanceof Error ? err.message : String(err));
  }

  if (!task1Success && !task2Success) {
    return { statusCode: 500, body: "Both sync tasks failed — see logs" };
  }

  const summary = [
    task1Success ? `task1=ok (${monthYear})` : "task1=failed",
    task2Success ? "task2=ok (lifetime)" : "task2=failed",
  ].join(", ");

  return { statusCode: 200, body: `Sync complete: ${summary}` };
});

export { handler };
