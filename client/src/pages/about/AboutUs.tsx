import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import foundersImage from "@assets/Screenshot_2026-01-14_at_14.02.51_1768386248129.png";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "About Us" }
]);

export default function AboutUs() {
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
            About Us
          </h1>
          <p className="text-xl text-gray-700">
            Our journey into Indian philosophy and the vision behind The Nirvanist
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Many of the ideas of Indian philosophies, which were once regarded as eccentric, exotic, foreign, or cranky, are now part of everyday life. Where once Christian ministers and clerics railed against the "heresies" of Hinduism, yoga classes are now held in church halls. Meditation has been stripped of its spiritual connotations and rebranded as 'mindfulness'. Statues of the Buddha have become a ubiquitous accoutrement in design magazines. The term 'guru' has floated free of its original significance to become a cliché for any expert or wise counselor.
            </p>

            <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                However, this is akin to merely dipping your toes in the water. A vast ocean of peace and happiness awaits those who are prepared to delve deeper. Where societies rely on cold rationale and science, they often lose meaning and purpose, which is given by philosophy. After all, science is limited to what has been discovered physically, whereas spirituality extends to what has been discovered experientially.
              </p>
            </div>

            <div className="border-l-4 border-[#70c92e] pl-6 my-12">
              <p className="text-xl text-gray-800 italic leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                "Those who speculate from the shore about the ocean shall know only its surface, but those who would know the depths of the ocean must be willing to plunge into it."
              </p>
              <p className="text-gray-600 mt-2">— Meher Baba</p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our humble attempt with The Nirvanist is to offer a door for a curious mind to be exposed to Indian philosophy and spirituality—for those who want to explore this rich source of wisdom, better understand its uniqueness, and potentially go through a profound positive transformation.
            </p>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-12 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Meet the Founders
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
                We are <strong>Pratik Malia</strong> and <strong>Celine Delacharlerie</strong>, an Indian-Belgian couple who met in Singapore and now live in Mauritius.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                We wanted to create this platform because we are ourselves very curious to indulge deeper in Indian philosophies, from which we have deeply benefited in our personal lives.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We wanted to create a ritual for ourselves to stay connected to this wisdom in the midst of our worldly life.
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
                How Will We Explore
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/why-indian-philosophies">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                Why Indian Philosophies
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
