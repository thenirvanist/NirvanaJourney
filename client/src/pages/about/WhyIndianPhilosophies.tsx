import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/spiritual_meditation_8a5fb307.jpg";
import { useTranslation } from "@/hooks/useTranslation";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "Why Indian Philosophies" }
]);

export default function WhyIndianPhilosophies() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Seo
        title="Why Indian Philosophies - The Nirvanist"
        description="Discover why Indian philosophy offers a wealth of inspiring thoughts and wisdom to help make sense of our existence and live with more peace and happiness."
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />
      
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.whyPhilosophies.title")}
          </h1>
          <p className="text-xl text-gray-700">
            {t("pages.about.whyPhilosophies.subtitle")}
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {t("pages.about.whyPhilosophies.intro1")}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t("pages.about.whyPhilosophies.intro2")}
            </p>

            <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
              <h2 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.whyPhilosophies.paradoxTitle")}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("pages.about.whyPhilosophies.paradoxText")}
              </p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t("pages.about.whyPhilosophies.vedasText")}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t("pages.about.whyPhilosophies.questioningText")}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t("pages.about.whyPhilosophies.wayOfLife")}
            </p>

            <div className="border-l-4 border-[#70c92e] pl-6 my-12">
              <p className="text-xl text-gray-800 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.whyPhilosophies.conclusion")}
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/understanding">
              <Button className="bg-[#70c92e] hover:bg-[#5fb025] text-white px-8 py-3 rounded-full">
                {t("pages.about.whyPhilosophies.understandingBtn")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/us">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                {t("pages.about.whyPhilosophies.aboutUsBtn")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
