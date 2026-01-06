import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Settings } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#253e1a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-[#70c92e] mb-4">The Nirvanist</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Connecting souls with sacred journeys. Discover your path to inner peace and spiritual transformation.
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <Heart className="w-4 h-4 mr-1 text-[#70c92e]" />
              Made with love for seekers
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/meetups" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">Satsangs</span>
                </Link>
              </li>
              <li>
                <Link href="/sages" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">Spiritual Sages</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">Join Us</span>
                </Link>
              </li>
              <li>
                <Link href="/login" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">Member Login</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-300 hover:text-[#70c92e] transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#70c92e] transition-colors">
                  Newsletter
                </a>
              </li>
              <li className="pt-2 border-t border-gray-600">
                <Link href="/admin" onClick={() => window.scrollTo(0, 0)}>
                  <span className="text-gray-500 hover:text-gray-400 transition-colors text-xs flex items-center cursor-pointer" data-testid="link-admin-access">
                    <Settings className="w-3 h-3 mr-1" />
                    Admin Access
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-[#70c92e]" />
                <span className="text-sm">Spiritual Journeys Worldwide</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-[#70c92e]" />
                <span className="text-sm">+1 (555) 123-PEACE</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-[#70c92e]" />
                <span className="text-sm">hello@nirvanist.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 The Nirvanist. All rights reserved. | 
            <span className="mx-2">Privacy Policy</span> | 
            <span className="mx-2">Terms of Service</span>
          </p>
        </div>
      </div>
    </footer>
  );
}