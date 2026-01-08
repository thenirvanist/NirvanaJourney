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

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'error-callback'?: () => void;
        size?: 'invisible' | 'normal' | 'compact';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const captchaTokenRef = useRef<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!email || !captchaTokenRef.current) return;
    
    setIsSubmitting(true);
    
    try {
      const confirmToken = crypto.randomUUID();
      
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from('newsletter_subscriber')
        .insert({
          email: email.toLowerCase().trim(),
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
          body: JSON.stringify({ email: email.toLowerCase().trim(), token: confirmToken }),
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
      
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
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
  }, [email, toast]);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || !turnstileRef.current) return;

    const initTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          size: 'invisible',
          callback: (token: string) => {
            captchaTokenRef.current = token;
            handleSubmit();
          },
          'error-callback': () => {
            toast({
              title: "Verification failed",
              description: "Please try again.",
              variant: "destructive",
            });
            setIsSubmitting(false);
          },
        });
      }
    };

    if (window.turnstile) {
      initTurnstile();
    } else {
      window.onTurnstileLoad = initTurnstile;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [handleSubmit, toast]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    if (captchaTokenRef.current) {
      handleSubmit();
    } else if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    } else {
      handleSubmit();
    }
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
        <div ref={turnstileRef} className="cf-turnstile mt-4" data-testid="turnstile-widget"></div>
      </div>
    </section>
  );
}
