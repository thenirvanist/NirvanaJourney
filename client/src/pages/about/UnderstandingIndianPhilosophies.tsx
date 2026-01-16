import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import rigVedaImage from "@assets/Rig_Veda_Poem_on_parchment_1768386280615.png";
import heroImage from "@assets/stock_images/himalayan_mountains__77518048.jpg";
import { useTranslation } from "@/hooks/useTranslation";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "Understanding Indian Philosophies" }
]);

const getTimelineSections = (t: (key: string) => string) => [
  {
    id: "vedas",
    title: t("pages.about.understanding.vedas.title"),
    period: t("pages.about.understanding.vedas.period"),
    content: t("pages.about.understanding.vedas.content")
  },
  {
    id: "upanishads",
    title: t("pages.about.understanding.upanishads.title"),
    period: t("pages.about.understanding.upanishads.period"),
    content: t("pages.about.understanding.upanishads.content")
  },
  {
    id: "epics",
    title: t("pages.about.understanding.epics.title"),
    period: t("pages.about.understanding.epics.period"),
    content: t("pages.about.understanding.epics.content")
  },
  {
    id: "gita",
    title: t("pages.about.understanding.gita.title"),
    period: t("pages.about.understanding.gita.period"),
    content: t("pages.about.understanding.gita.content"),
    quote: t("pages.about.understanding.gita.quote")
  },
  {
    id: "dharmashastras",
    title: t("pages.about.understanding.dharmashastras.title"),
    period: t("pages.about.understanding.dharmashastras.period"),
    content: t("pages.about.understanding.dharmashastras.content")
  },
  {
    id: "puranas",
    title: t("pages.about.understanding.puranas.title"),
    period: t("pages.about.understanding.puranas.period"),
    content: t("pages.about.understanding.puranas.content")
  }
];

const getConcepts = (t: (key: string) => string) => [
  {
    title: t("pages.about.understanding.oneInMany.title"),
    content: t("pages.about.understanding.oneInMany.content")
  },
  {
    title: t("pages.about.understanding.unityInDiversity.title"),
    content: t("pages.about.understanding.unityInDiversity.content")
  },
  {
    title: t("pages.about.understanding.guruShishya.title"),
    content: t("pages.about.understanding.guruShishya.content")
  }
];

export default function UnderstandingIndianPhilosophies() {
  const { t } = useTranslation();
  const timelineSections = getTimelineSections(t);
  const concepts = getConcepts(t);
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Seo
        title="Understanding Indian Philosophies - The Nirvanist"
        description="Explore the rich tapestry of Indian philosophical traditions from the Vedas to the Puranas, and understand the core concepts that unite them."
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />
      
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t("pages.about.understanding.title")}
          </h1>
          <p className="text-xl text-gray-700">
            {t("pages.about.understanding.subtitle")}
          </p>
        </div>
      </section>

      <main className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t("pages.about.understanding.timeline")}</h3>
                <nav className="space-y-2">
                  {timelineSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-[#70c92e] transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <span className="text-xs uppercase text-gray-500 font-medium">{t("pages.about.understanding.coreConcepts")}</span>
                    {concepts.map((concept, idx) => (
                      <a
                        key={idx}
                        href={`#concept-${idx}`}
                        className="block text-sm text-gray-600 hover:text-[#70c92e] transition-colors py-1"
                      >
                        {concept.title}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {t("pages.about.understanding.intro1")}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t("pages.about.understanding.intro2")}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t("pages.about.understanding.intro3")}
                </p>
              </div>

              <h2 className="text-3xl font-light text-gray-900 mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.understanding.timelineTitle")}
              </h2>

              <div className="space-y-12">
                {timelineSections.map((section, index) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="hidden sm:block flex-shrink-0 w-24 text-center">
                        <div className="w-4 h-4 rounded-full bg-[#70c92e] mx-auto mb-2"></div>
                        <span className="text-xs text-gray-500">{section.period}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex sm:hidden items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-[#70c92e]"></div>
                          <span className="text-xs text-gray-500">{section.period}</span>
                        </div>
                        <h3 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                          {section.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{section.content}</p>
                        {section.quote && (
                          <blockquote className="border-l-4 border-[#70c92e] pl-4 my-4 italic text-gray-700">
                            {section.quote}
                          </blockquote>
                        )}
                        {section.id === "vedas" && (
                          <div className="mt-6">
                            <img 
                              src={rigVedaImage} 
                              alt="Rig Veda poem on parchment" 
                              className="rounded-xl shadow-lg w-full sm:max-w-md"
                            />
                            <p className="text-sm text-gray-500 mt-2 italic">
                              {t("pages.about.understanding.rigVedaCaption")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < timelineSections.length - 1 && (
                      <div className="hidden sm:block ml-12 border-l-2 border-gray-200 h-8 mt-4"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
                <p className="text-lg text-gray-700 leading-relaxed text-center italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {t("pages.about.understanding.foundationQuote")}
                </p>
              </div>

              <h2 className="text-3xl font-light text-gray-900 mb-8 mt-16" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {t("pages.about.understanding.coreConceptsTitle")}
              </h2>

              <div className="space-y-8">
                {concepts.map((concept, idx) => (
                  <div key={idx} id={`concept-${idx}`} className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-24">
                    <h3 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {concept.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{concept.content}</p>
                  </div>
                ))}
              </div>

              <div className="border-l-4 border-[#70c92e] pl-6 my-12">
                <p className="text-xl text-gray-800 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {t("pages.about.understanding.kabirQuote")}
                </p>
                <p className="text-gray-600 mt-2">{t("pages.about.understanding.kabirAttribution")}</p>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/about/how-we-explore">
                  <Button className="bg-[#70c92e] hover:bg-[#5fb025] text-white px-8 py-3 rounded-full">
                    {t("pages.about.understanding.howExploreBtn")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about/why-indian-philosophies">
                  <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                    {t("pages.about.understanding.whyPhilosophiesBtn")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
