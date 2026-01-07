import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If supabase is not configured, stop loading
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get the current session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
          setSession(null);
        } else if (session?.user) {
          setSession(session);
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error("Session fetch error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSession(session);
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
          setSession(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      firstName: supabaseUser.user_metadata?.first_name || null,
      lastName: supabaseUser.user_metadata?.last_name || null,
      emailVerified: !!supabaseUser.email_confirmed_at,
    };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    // Clean up any legacy tokens
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    logout,
  };
}
