import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import rigVedaImage from "@assets/Rig_Veda_Poem_on_parchment_1768386280615.png";
import heroImage from "@assets/stock_images/himalayan_mountains__77518048.jpg";

const breadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "About" },
  { name: "Understanding Indian Philosophies" }
]);

const timelineSections = [
  {
    id: "vedas",
    title: "The Vedas",
    period: "2500 - 600 BCE",
    content: `Indian philosophy is rooted in the authority of ancient, sacred texts called the Vedas, which originated between 2500 and 600 BCE. The Rig Veda is the earliest of the four Vedas, with the remaining three known as the Sama, Yajur, and Atharva Veda. The earliest hymns of the Rig Veda began to be transmitted orally. They addressed topics including the creation and structure of the universe, the natural world, and praise of a number of deities including Indra and Agni.`
  },
  {
    id: "upanishads",
    title: "The Upanishads",
    period: "900 - 300 BCE",
    content: `This was followed by the Upanishads from 900 to 300 BCE, which tried to explain the tenets of the Vedas in an intellectually rigorous question-answer format between a Guru and a disciple. They were philosophical dialogues that appeared at the end of each of the four Vedas. Consequently, they are often referred to as Vedanta, which literally means "the end of the Veda," a term that has also come to refer to several schools of Indian philosophy.`
  },
  {
    id: "epics",
    title: "The Epics",
    period: "400 BCE - 200 CE",
    content: `Then followed the age of the epics from 400 BCE – 200 CE, when the Mahabharata (of which the Bhagavad Gita is part) and Ramayana were written. They were long narrative poems telling the stories of human heroes and dynasties with gods in supporting or guiding roles, centered on ethical dilemmas, dharma, and exemplary conduct in complex life situations. Their function was to show how dharma (or right code of conduct) is lived in the world: family conflict, kingship, warfare.`
  },
  {
    id: "gita",
    title: "The Bhagavad Gita",
    period: "Part of the Mahabharata",
    content: `The Bhagavad Gita appears as an episode in the sixth book of the Mahabharata. The Gita, one of the most widely read texts in the world, consists of a dialogue between the warrior Arjuna and his charioteer Krishna on the edge of a battlefield before the first day of war. The text blends a wide range of philosophical ideas within the context of a larger literary narrative.`,
    quote: `"As Krishna describes it, life is an impermanent, dreamlike state in which the soul is beset by dreams and illusions. The wise man learns to recognise these illusions for what they are and, freed from desires and attachments, goes through life with complete serenity, at the end of it merging into eternal unity with Brahman, the omnipresent spirit of all created things."`
  },
  {
    id: "dharmashastras",
    title: "Dharmashastras",
    period: "100 CE",
    content: `Building on this, in 100 CE, authoritative treatises that address the topic of dharma—which can be translated variously as duty, law, ethics, or moral order—were introduced. These texts offer pragmatic teachings on how to behave in accordance with the dharmic order of the universe, containing prescriptions for social order, family life, and gender relations.`
  },
  {
    id: "puranas",
    title: "The Puranas",
    period: "250 - 1000 CE",
    content: `Lastly came the age of the Puranas: myths and legends of gods and goddesses, cosmic cycles, creation and destruction, genealogies of gods, patriarchs, kings, pilgrim places, festivals, and ritual practice. Their function was to bridge high philosophy with popular worship; they taught cosmology, bhakti, ritual observances, and the glory of specific deities and holy places.`
  }
];

const concepts = [
  {
    title: "The One in Many",
    content: `The vast array of deities in the Hindu pantheon is held together philosophically through the concept of "Brahman," the infinite and eternal Ultimate spirit that underlies all existence. Brahman pervades all that exists, even the deities. The multiple divine forms are viewed as manifestations of that one Ultimate. Natural elements like the sun and rivers are viewed as divine forms worthy of worship. The worship of the divine in the feminine form is also an aspect that sets it apart.`
  },
  {
    title: "Unity in Diversity",
    content: `The shared assumption that validates the worship of the divine in multiple forms also validates diverse ways of worshipping. Depending on the inclination of an individual, various channels are recognized as valid: knowledge (gnan), meditation (dhyan), devotion (bhakti), and action (karma). Art is also recognized as a vital channel of religious expression. Music, dance, and painting are pursued as paths for approaching the divine.`
  },
  {
    title: "The Guru-Shishya (disciple) System",
    content: `The guru system demands a different relationship from that of congregant and priest. The guru is seen as a path to—or in some cases an embodiment of—the divine. In philosophical systems that emphasize the disintegration of the ego, unconditional devotion to the guru is seen as the most efficient way for spiritual progress. However, this in no manner means to stop questioning or encourages blind faith. True gurus are those who encourage seekers to constantly question.`
  }
];

export default function UnderstandingIndianPhilosophies() {
  return (
    <div className="min-h-screen">
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
            Understanding Indian Philosophies
          </h1>
          <p className="text-xl text-gray-700">
            From the Vedas to the Puranas: A journey through millennia of wisdom
          </p>
        </div>
      </section>

      <main className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
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
                    <span className="text-xs uppercase text-gray-500 font-medium">Core Concepts</span>
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
                  Many are bewildered to encounter the pantheon of deities in India: blue-faced gods and goddesses riding on tigers or seated in lotus flowers, snakes coiled around their necks; a god that is half-elephant, half-man; another riding on a rat; an eight-armed goddess wearing human skulls as a necklace and severed heads at her waist.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  As they go deeper, they recognize that belief in 'one God, eternal, omnific, omnipotent and omniscient' is fundamental to Indian philosophies, and that the multiplicity of deities is 'to be taken only in a figurative sense'. "One in Many" is the key theme, and that extends beyond deities to every living being.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  While Indian philosophies are marked by immense internal diversity of belief and practices, we do find broad patterns. They acknowledge explicitly or implicitly the authority of a vast scriptural corpus in the Sanskrit language known collectively as the Vedas. Most also share the concept that the divine manifests in a diversity of ways and believe in the eternity of the soul—reborn in body after body, life after life, guided by karma.
                </p>
              </div>

              <h2 className="text-3xl font-light text-gray-900 mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Timeline of Development
              </h2>

              <div className="space-y-12">
                {timelineSections.map((section, index) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-24 text-center">
                        <div className="w-4 h-4 rounded-full bg-[#70c92e] mx-auto mb-2"></div>
                        <span className="text-xs text-gray-500">{section.period}</span>
                      </div>
                      <div className="flex-grow">
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
                              className="rounded-xl shadow-lg max-w-md"
                            />
                            <p className="text-sm text-gray-500 mt-2 italic">
                              Translation by Wendy Doniger O'Flaherty. From the Book "The Rig Veda - Anthology"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < timelineSections.length - 1 && (
                      <div className="ml-12 border-l-2 border-gray-200 h-8 mt-4"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#F7F2E8] rounded-2xl p-8 my-12">
                <p className="text-lg text-gray-700 leading-relaxed text-center italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Together with the Upanishads and the Brahma Sutras, the Bhagavad Gita forms the triple foundation of orthodox Indian philosophy. They have determined the tone, if not the precise pattern, of Indian philosophical development ever since, upgraded and updated over time by countless learned sages.
                </p>
              </div>

              <h2 className="text-3xl font-light text-gray-900 mb-8 mt-16" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Core Underlying Concepts
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
                  "If you haven't experienced it, it's not true."
                </p>
                <p className="text-gray-600 mt-2">— Kabir</p>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
