import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Journey, Sage, Ashram, Meetup, Testimonial, DailyWisdom, BlogPost } from "@shared/schema";

/**
 * Direct Supabase query hooks that bypass backend API
 * These hooks use the Supabase client with anon key and respect RLS policies
 * Perfect for Netlify deployment where serverless functions may have issues
 */

export function useJourneys() {
  return useQuery<Journey[]>({
    queryKey: ["supabase", "journeys"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useJourney(id: number) {
  return useQuery<Journey>({
    queryKey: ["supabase", "journeys", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSages() {
  return useQuery<Sage[]>({
    queryKey: ["supabase", "sages"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("sages")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSage(id: number) {
  return useQuery<Sage>({
    queryKey: ["supabase", "sages", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("sages")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAshrams() {
  return useQuery<Ashram[]>({
    queryKey: ["supabase", "ashrams"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("ashrams")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAshram(id: number) {
  return useQuery<Ashram>({
    queryKey: ["supabase", "ashrams", id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("ashrams")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMeetups() {
  return useQuery<Meetup[]>({
    queryKey: ["supabase", "meetups"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("meetups")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["supabase", "testimonials"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveQuotes() {
  return useQuery<DailyWisdom[]>({
    queryKey: ["supabase", "daily_wisdom", "active"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("daily_wisdom")
        .select("*")
        .eq("active", true)
        .lte("display_date", today)
        .order("display_date", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAllDailyWisdom() {
  return useQuery<DailyWisdom[]>({
    queryKey: ["supabase", "daily_wisdom", "all"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("daily_wisdom")
        .select("*")
        .order("display_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ["supabase", "blog_posts"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ["supabase", "blog_posts", slug],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBlogPostsByAuthor(authorName: string) {
  return useQuery<BlogPost[]>({
    queryKey: ["supabase", "blog_posts", "author", authorName],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .ilike("author", `%${authorName}%`)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!authorName,
    staleTime: 5 * 60 * 1000,
  });
}

export interface HealTestimonialRow {
  id: number;
  testimonial: string;
  clientName: string;
  country: string;
  quote?: string;
}

export function useHealTestimonials() {
  return useQuery<HealTestimonialRow[]>({
    queryKey: ["supabase", "heal_testimonials"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("Testimonial_Sacred Journeys")
        .select("*")
        .limit(15);
      if (error) throw error;
      return (data || []).map((row: Record<string, unknown>) => ({
        id: row["id"] as number,
        testimonial: row["Testimonial"] as string,
        clientName: row["Client name"] as string,
        country: row["Country"] as string,
        quote: row["Quote"] as string | undefined,
      }));
    },
    staleTime: 0,
    refetchInterval: 30000,
  });
}

export interface TransparencyLedgerRow {
  id: number;
  monthYear: string;
  peopleReached: number;
  engagement: number;
  countries: string;
  donors: string;
  totalBudget: number;
}

export function useTransparencyLedger() {
  return useQuery<TransparencyLedgerRow[]>({
    queryKey: ["supabase", "transparency_ledger"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("transparency_ledger")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return (data || []).map((row: Record<string, unknown>) => ({
        id: row["id"] as number,
        monthYear: row["month_year"] as string,
        peopleReached: Number(row["people_reached"] ?? 0),
        engagement: Number(row["engagement"] ?? 0),
        countries: (() => { const v = String(row["countries"] ?? "").trim(); return v && v !== "0" ? v : "—"; })(),
        donors: (() => { const v = String(row["donors"] ?? "").trim(); return v && v !== "0" ? v : "—"; })(),
        totalBudget: Number(row["total_budget"] ?? 0),
      }));
    },
    staleTime: 0,
    refetchInterval: 60000,
  });
}

export interface HealDonorRow {
  id: number;
  rank: number;
  donorName: string;
  totalContributed: number;
  soulsReached: number;
}

export function useHealDonors() {
  return useQuery<HealDonorRow[]>({
    queryKey: ["supabase", "heal_donors"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from("Donor_Heal The World")
        .select("*")
        .order("Rank", { ascending: true })
        .limit(10);
      if (error) throw error;
      return (data || []).map((row: Record<string, unknown>) => ({
        id: row["id"] as number,
        rank: row["Rank"] as number,
        donorName: row["Donor Name"] as string,
        totalContributed: Number(row["Total Contributed"]),
        soulsReached: Number(row["Souls reached"]),
      }));
    },
    staleTime: 0,
    refetchInterval: 30000,
  });
}
