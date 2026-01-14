import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "Why Indian Philosophies" }
]);

export default function WhyIndianPhilosophies() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Why Indian Philosophies - The Nirvanist"
        description="Discover why Indian philosophy offers a wealth of inspiring thoughts and wisdom to help make sense of our existence and live with more peace and happiness."
      />
      <SchemaOrg schema={breadcrumb} />
      <Navigation />
      
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545387092-733e7e39afe4?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Why Explore Indian Philosophy?
          </h1>
          <p className="text-xl text-gray-700">
            A journey into wisdom that transforms how we understand life itself
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              You are said to be indulging in philosophy whenever you set your mind to a systematic investigation of the nature of the world, selfhood, values, human good, the sources of knowledge, and the limits of human reason.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Philosophy attempts to explain what cannot be explained by science. However, it differentiates itself from faith and religion in its approach: constantly questioning rather than accepting a certain truth.
            </p>

            <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
              <h2 className="text-2xl font-light text-gray-900 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                The Paradox of Indian Philosophy
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Indian philosophy is often mixed with faith and religion because it is rooted in the authority of ancient, sacred texts. But the paradox—and the originality—of Indian philosophy is that although it respects these ancient texts, for centuries commentators have interpreted them with such creativity that the philosophy has progressed enormously with time.
              </p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              The very vastness of those ancient texts, called the Vedas, allowed authors to select any portion for their authority, leaving ample room for original thought. Contemporary Indian philosophers are well versed in both Western and Indian thought, contributing to this interpretive creativity. The Vedas provide such a rich list of philosophical ingredients that philosophers can constantly upgrade them to be suited to prevalent times. In fact, there are many schools of thought within Indian philosophy.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Those commentators have also constantly encouraged questioning. They subjected their doctrines to rational analysis and justification, trying to give answers that rely as much as possible on logic. Strenuous attempts are made to show with logic and rationale what faith implicitly accepts.
            </p>

            <div className="border-l-4 border-[#70c92e] pl-6 my-12">
              <p className="text-xl text-gray-800 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                While in the West, philosophy is more of an intellectual exercise in search of the truth, in India, philosophy is more of a way of life. Although there is a strong truth-seeking strand in Indian philosophy, the truths sought are always ones that relate to the way we ought to live.
              </p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Therein lies the answer to "Why Indian philosophies?" They offer a wealth of inspiring thoughts and wisdom to help us make sense of our existence and to live our life with more peace and happiness. And if, after a sincere attempt to explore, they do not serve you, one must not hesitate to give them up either.
            </p>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about/understanding">
              <Button className="bg-[#70c92e] hover:bg-[#5fb025] text-white px-8 py-3 rounded-full">
                Understanding Indian Philosophies
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/us">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
