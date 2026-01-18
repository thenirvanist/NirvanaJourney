import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function WeeklyReset() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "You're in!",
          description: data.message || "Please check your inbox for a confirmation link.",
        });
        setEmail("");
      } else {
        toast({
          title: "Subscription failed",
          description: data.message || "Please try again or contact our support team.",
          variant: "destructive",
        });
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
  };

  if (isSuccess) {
    return (
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">You're in!</h2>
          <p className="text-xl text-gray-700">
            Please check your inbox for a confirmation link to finalize your subscription.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">The Weekly Reset</h2>
        <p className="text-xl mb-8 text-gray-700">
          Reboot your mind and update your internal OS with timeless wisdom.
        </p>
        <form onSubmit={onFormSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[hsl(70,71%,62%)]"
            required
            data-testid="input-weekly-reset-email"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            data-testid="button-weekly-reset-subscribe"
          >
            {isSubmitting ? "Joining..." : "Join the Newsletter"}
          </Button>
        </form>
      </div>
    </section>
  );
}
