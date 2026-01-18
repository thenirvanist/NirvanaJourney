import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Video, Users, Globe } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import satsangImage from "@assets/Satsang_4_1768371365026.png";

export default function MeetupsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-trigger");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="meetups" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">{t("sections.meetups.title")}</h2>
            <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">{t("sections.meetups.subtitle")}</h3>
            <p className="text-lg text-gray-700 mb-6">
              {t("pages.meetups.description")}
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Video className="text-[hsl(75,64%,49%)] text-xl" />
                <span>{t("pages.meetups.features.virtual")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-[hsl(75,64%,49%)] text-xl" />
                <span>{t("pages.meetups.features.global")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-[hsl(75,64%,49%)] text-xl" />
                <span>{t("pages.meetups.features.weekly")}</span>
              </div>
            </div>
          </div>
          
          <div className="scroll-trigger">
            <img 
              src={satsangImage} 
              alt="Satsang: Truth, Love, Community gathering" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/register" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              {t("pages.meetups.attendSatsangs")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
