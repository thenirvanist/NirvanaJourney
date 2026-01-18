import { SiFacebook, SiWhatsapp, SiInstagram, SiLinkedin, SiX } from "react-icons/si";

export default function CurateYourFeed() {
  return (
    <section className="py-20 bg-[#F7F2E8] text-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Curate Your Feed</h2>
        <p className="text-xl mb-8 text-gray-700">
          Inject timeless wisdom into your daily scroll.
        </p>
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
    </section>
  );
}
