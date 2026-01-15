import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SiFacebook, SiWhatsapp, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

export default function Newsletter() {
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
          title: "Thank you!",
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

        {/* Stay In Touch - Social Links */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">Stay In Touch</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.facebook.com/thenirvanistofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg text-gray-700 hover:bg-[#70c92e] hover:text-white transition-all duration-300 shadow-sm"
            >
              <SiFacebook className="w-5 h-5" />
              <span>Facebook</span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbBqaSJ0QeapgNPxcR05"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg text-gray-700 hover:bg-[#70c92e] hover:text-white transition-all duration-300 shadow-sm"
            >
              <SiWhatsapp className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/thenirvanistofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg text-gray-700 hover:bg-[#70c92e] hover:text-white transition-all duration-300 shadow-sm"
            >
              <SiInstagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/company/the-nirvanist/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg text-gray-700 hover:bg-[#70c92e] hover:text-white transition-all duration-300 shadow-sm"
            >
              <SiLinkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/the_nirvanist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-lg text-gray-700 hover:bg-[#70c92e] hover:text-white transition-all duration-300 shadow-sm"
            >
              <SiX className="w-5 h-5" />
              <span>X</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
