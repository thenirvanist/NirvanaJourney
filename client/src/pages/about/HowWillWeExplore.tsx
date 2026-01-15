import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight, Mail, Video, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "How Will We Explore" }
]);

const explorationMethods = [
  {
    icon: Mail,
    title: "Weekly Newsletter",
    description: "Every week, in our newsletter, you will read what sages have to say on deep questions relevant to our everyday life. You will read some of their most inspiring and transformative texts, curated for you to explore timeless Indian philosophical wisdom applied to the dilemmas of contemporary life."
  },
  {
    icon: MessageCircle,
    title: "Daily Wisdom",
    description: "If you'd like to stay connected to spirituality throughout the week, you can join our WhatsApp group in which we post one inspiring quote by a sage daily. Alternatively, you may follow our social media channels or visit this site to view the quotes daily. Please note, while the main focus of the platform is Indian philosophy, we have taken the liberty to share quotes from western philosophers to emphasise unity in diversity."
  },
  {
    icon: Video,
    title: "Virtual Satsangs",
    description: "We will conduct virtual meetings where curated speeches by sages featured on this site will be broadcasted, followed by questions for introspection or discussion. If possible, this will be conducted in groups of 8 selected from within your country/location, so that you have the opportunity to gather physically in future if desired so. However, if you prefer solitude, you may also attend the videos on your own and introspect on the questions by yourself."
  },
  {
    icon: MapPin,
    title: "Ashram Visits",
    description: "In the near future, we will explore the potential to do site visits to ashrams across India. This deep experiential immersion will have a profound impact on you, as it has had on us."
  }
];

const deepQuestions = [
  "What is the purpose of my life?",
  "What is happiness and how do I reach a sustainable state of peace, joy, and happiness?",
  "How do I deal with my emotions and relationships in my everyday life?"
];

export default function HowWillWeExplore() {
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
            How Will We Explore?
          </h1>
          <p className="text-xl text-gray-700">
            Join us on a journey of discovery through multiple pathways of learning
          </p>
        </div>
      </section>

      <main className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-xl text-gray-700 leading-relaxed text-center">
              We will explore together all philosophers connected to Indian philosophy, past and present. There are many schools of thought within Indian philosophy, and our goal is to explore as many of them as possible, while giving you the keys to understand their particularities.
            </p>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-12 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Exploration Methods
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
                More about Satsangs
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The word satsang comes from two Sanskrit roots: sat, meaning truth, purity, or the real, and sanga/sangha, meaning company, association, or community. Put together, satsang means associating with people and teachings that reflect spiritual reality rather than ignorance.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Traditionally, a satsang is an audience with an enlightened teacher who provides spiritual instruction. However, in modern contexts, satsang can mean any gathering of people for the purpose of discussing, practicing, or contemplating spirituality.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-light text-gray-900 mb-6 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Deep Questions You'll Explore
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
                About Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/about/understanding">
              <Button variant="outline" className="border-[#70c92e] text-[#70c92e] hover:bg-[#70c92e]/10 px-8 py-3 rounded-full">
                Understanding Indian Philosophies
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
