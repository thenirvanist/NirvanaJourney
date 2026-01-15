import { Link } from "wouter";
import { Heart, MapPin, Mail } from "lucide-react";
import { SiFacebook, SiWhatsapp, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#253e1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-[#70c92e] mb-4">The Nirvanist</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <Heart className="w-4 h-4 mr-1 text-[#70c92e]" />
              {t("footer.madeWithLove")}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.explore")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/meetups" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.satsang")}</span>
                </Link>
              </li>
              <li>
                <Link href="/sages" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("navigation.sages")}</span>
                </Link>
              </li>
              <li>
                <Link href="/inner-nutrition" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.insights")}</span>
                </Link>
              </li>
              <li>
                <Link href="/daily-quotes" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("navigation.dailyQuotes")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.community")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#newsletter" className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">
                  {t("footer.newsletter")}
                </a>
              </li>
              <li>
                <Link href="/register" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.joinUs")}</span>
                </Link>
              </li>
              <li>
                <Link href="/login" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.memberLogin")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.connect")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about/us" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.aboutUs")}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">{t("footer.contact")}</span>
                </Link>
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-[#70c92e]" />
                <span className="text-sm">Tamarin, Mauritius</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-[#70c92e]" />
                <span className="text-sm">hello@nirvanist.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.social")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.facebook.com/thenirvanistofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#70c92e] transition-colors flex items-center gap-2">
                  <SiFacebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://whatsapp.com/channel/0029VbBqaSJ0QeapgNPxcR05" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#70c92e] transition-colors flex items-center gap-2">
                  <SiWhatsapp className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/thenirvanistofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#70c92e] transition-colors flex items-center gap-2">
                  <SiInstagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/the-nirvanist/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#70c92e] transition-colors flex items-center gap-2">
                  <SiLinkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://x.com/the_nirvanist" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#70c92e] transition-colors flex items-center gap-2">
                  <SiX className="w-4 h-4" />
                  <span>X</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {t("footer.copyright")} | 
            <span className="mx-2">{t("footer.privacy")}</span> | 
            <span className="mx-2">{t("footer.terms")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
