import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import foundersImage from "@assets/Screenshot_2026-01-14_at_14.02.51_1768386248129.png";
import { useTranslation } from "@/hooks/useTranslation";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "About Us" }
]);

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Seo
        title="About Us - The Nirvanist"
        description="Meet Pratik Malia and Celine Delacharlerie, the founders of The Nirvanist, an Indian-Belgian couple dedicated to sharing Indian philosophical wisdom."
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />
      
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.aboutUs.title")}
          </h1>
          <p className="text-xl text-gray-700">
            {t("pages.about.aboutUs.subtitle")}
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {t("pages.about.aboutUs.intro")}
            </p>

            <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("pages.about.aboutUs.deeperText")}
              </p>
            </div>

            <div className="border-l-4 border-[#70c92e] pl-6 my-12">
              <p className="text-xl text-gray-800 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.aboutUs.oceanQuote")}
              </p>
              <p className="text-gray-600 mt-2">{t("pages.about.aboutUs.oceanAttribution")}</p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t("pages.about.aboutUs.missionText")}
            </p>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-12 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.aboutUs.meetFounders")}
          </h2>

          <div className="my-8 flex flex-col lg:flex-row items-start gap-12">
            <div className="lg:w-1/2">
              <img 
                src={foundersImage} 
                alt="Pratik and Celine, founders of The Nirvanist" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div className="lg:w-1/2">
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {t("pages.about.aboutUs.foundersIntro")}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {t("pages.about.aboutUs.foundersWhy")}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {t("pages.about.aboutUs.foundersRitual")}
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/pratik-malia-a3976227/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006699] text-white rounded-lg transition-colors"
                >
                  <SiLinkedin className="w-5 h-5" />
                  Pratik
                </a>
                <a 
                  href="https://www.linkedin.com/in/celinedelacharlerie/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] hover:bg-[#006699] text-white rounded-lg transition-colors"
                >
                  <SiLinkedin className="w-5 h-5" />
                  Celine
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/how-we-explore">
              <Button className="bg-[#70c92e] hover:bg-[#5fb025] text-white px-8 py-3 rounded-full">
                {t("pages.about.aboutUs.howExploreBtn")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/why-indian-philosophies">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                {t("pages.about.aboutUs.whyPhilosophiesBtn")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
