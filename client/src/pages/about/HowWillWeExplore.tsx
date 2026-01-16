import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight, Mail, Video, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "How Will We Explore" }
]);

const getExplorationMethods = (t: (key: string) => string) => [
  {
    icon: Mail,
    title: t("pages.about.howExplore.newsletter.title"),
    description: t("pages.about.howExplore.newsletter.description")
  },
  {
    icon: MessageCircle,
    title: t("pages.about.howExplore.dailyWisdom.title"),
    description: t("pages.about.howExplore.dailyWisdom.description")
  },
  {
    icon: Video,
    title: t("pages.about.howExplore.virtualSatsangs.title"),
    description: t("pages.about.howExplore.virtualSatsangs.description")
  },
  {
    icon: MapPin,
    title: t("pages.about.howExplore.ashramVisits.title"),
    description: t("pages.about.howExplore.ashramVisits.description")
  }
];

const getDeepQuestions = (t: (key: string) => string) => [
  t("pages.about.howExplore.question1"),
  t("pages.about.howExplore.question2"),
  t("pages.about.howExplore.question3")
];

export default function HowWillWeExplore() {
  const { t } = useTranslation();
  const explorationMethods = getExplorationMethods(t);
  const deepQuestions = getDeepQuestions(t);
  return (
    <div className="min-h-screen">
      <Seo
        title="How Will We Explore - The Nirvanist"
        description="Discover how we'll explore Indian philosophy together through newsletters, virtual satsangs, group sessions, and ashram visits."
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />
      
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.howExplore.title")}
          </h1>
          <p className="text-xl text-gray-700">
            {t("pages.about.howExplore.subtitle")}
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              {t("pages.about.howExplore.intro")}
            </p>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-12 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.howExplore.methods")}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {explorationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 rounded-full bg-[#70c92e]/10 flex items-center justify-center mb-6">
                  <method.icon className="w-7 h-7 text-[#70c92e]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{method.title}</h3>
                <p className="text-gray-600 leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#F7F2E8] rounded-3xl p-12 mb-20">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-light text-gray-900 mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.howExplore.moreSatsangs")}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t("pages.about.howExplore.satsangDesc1")}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("pages.about.howExplore.satsangDesc2")}
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-light text-gray-900 mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.howExplore.deepQuestionsTitle")}
              </h3>
              <ul className="space-y-4">
                {deepQuestions.map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#70c92e] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/us">
              <Button className="bg-[#70c92e] hover:bg-[#5fb025] text-white px-8 py-3 rounded-full">
                {t("pages.about.howExplore.aboutUsBtn")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/understanding">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                {t("pages.about.howExplore.understandingBtn")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
