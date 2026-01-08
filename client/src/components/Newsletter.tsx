import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const captchaTokenRef = useRef<string | null>(null);

  const submitSubscription = useCallback(async (emailValue: string) => {
    try {
      const confirmToken = crypto.randomUUID();
      
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from('newsletter_subscriber')
        .insert({
          email: emailValue.toLowerCase().trim(),
          source: 'homepage_guest',
          status: 'pending',
          confirmation_token: confirmToken,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already on our list. Check your inbox for the confirmation link.",
          });
        } else {
          throw error;
        }
      } else {
        const response = await fetch('/api/newsletter/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailValue.toLowerCase().trim(), token: confirmToken }),
        });

        if (!response.ok) {
          console.error('Failed to send confirmation email');
        }

        setIsSuccess(true);
        toast({
          title: "Thank you!",
          description: "Please check your inbox for a confirmation link to finalize your subscription.",
        });
      }
      
      setEmail("");
      captchaTokenRef.current = null;
      
      if (widgetIdRef.current && typeof window !== 'undefined' && (window as any).turnstile) {
        try {
          (window as any).turnstile.reset(widgetIdRef.current);
        } catch (e) {
          // Ignore reset errors
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again or contact our support team.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || !turnstileRef.current) return;

    const initTurnstile = () => {
      if (typeof window !== 'undefined' && (window as any).turnstile && turnstileRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = (window as any).turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            size: 'invisible',
            callback: (token: string) => {
              captchaTokenRef.current = token;
            },
            'error-callback': () => {
              // Turnstile failed - proceed without CAPTCHA
              console.warn('Turnstile verification failed');
            },
          });
        } catch (e) {
          console.warn('Turnstile initialization failed:', e);
        }
      }
    };

    if (typeof window !== 'undefined' && (window as any).turnstile) {
      initTurnstile();
    } else if (typeof window !== 'undefined') {
      (window as any).onTurnstileLoad = initTurnstile;
    }

    return () => {
      if (widgetIdRef.current && typeof window !== 'undefined' && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    await submitSubscription(email);
  };

  if (isSuccess) {
    return (
      <section className="py-20 bg-[#F7F2E8] text-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Thank You!</h2>
          <p className="text-xl text-gray-700">
            Please check your inbox for a confirmation link to finalize your subscription.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F7F2E8] text-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Stay Connected to Your Journey</h2>
        <p className="text-xl mb-8 text-gray-700">
          Receive weekly inspiration, retreat updates, and spiritual insights delivered to your inbox
        </p>
        <form onSubmit={onFormSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[hsl(70,71%,62%)]"
            required
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            data-testid="button-newsletter-subscribe"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <div ref={turnstileRef} className="cf-turnstile mt-4 hidden" data-testid="turnstile-widget"></div>
      </div>
    </section>
  );
}
