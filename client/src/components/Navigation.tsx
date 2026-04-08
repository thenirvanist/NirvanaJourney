import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, Heart, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LanguageDropdown } from "./LanguageDropdown";
import { useTranslation } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const insightsSubItems = [
  { href: "/inner-nutrition", label: "Inner Nutrition" },
  { href: "/daily-quotes", label: "Daily Quotes" },
];

const aboutSubItems = [
  { href: "/about/why-indian-philosophies", labelKey: "navigation.whyIndianPhilosophies" as const },
  { href: "/about/understanding", labelKey: "navigation.understandingPhilosophies" as const },
  { href: "/about/us", labelKey: "navigation.aboutUs" as const },
  { href: "/about/how-we-explore", labelKey: "navigation.howWeExplore" as const },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { t } = useTranslation();

  const isActive = (href: string) => location === href;
  const isAboutActive = () => location.startsWith("/about");
  const isInsightsActive = () =>
    location.startsWith("/inner-nutrition") || location.startsWith("/daily-quotes");

  const navBtnClass = (active: boolean) =>
    `text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 ${
      active ? "bg-[hsl(70,71%,62%)] text-black" : ""
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="rounded-lg hover:bg-[hsl(70,71%,62%)] p-2 transition-all duration-300">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Meetups / Satsangs */}
            <Link href="/meetups">
              <Button variant="ghost" className={navBtnClass(isActive("/meetups"))}>
                {t("navigation.meetups")}
              </Button>
            </Link>

            {/* Insights Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={navBtnClass(isInsightsActive())}>
                  Insights
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg rounded-lg mt-2">
                {insightsSubItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                    <Link href={item.href} className="w-full">
                      <span className={`w-full px-2 py-1 ${isActive(item.href) ? "text-[#70c92e] font-semibold" : "text-gray-700 hover:text-[#70c92e]"}`}>
                        {item.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Heal */}
            <Link href="/heal">
              <Button variant="ghost" className={navBtnClass(isActive("/heal"))}>
                Heal
              </Button>
            </Link>

            {/* Sages */}
            <Link href="/sages">
              <Button variant="ghost" className={navBtnClass(isActive("/sages"))}>
                {t("navigation.sages")}
              </Button>
            </Link>

            {/* About Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={navBtnClass(isAboutActive())}>
                  {t("navigation.about")}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg rounded-lg mt-2">
                {aboutSubItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                    <Link href={item.href} className="w-full">
                      <span className={`w-full px-2 py-1 ${isActive(item.href) ? "text-[#70c92e] font-semibold" : "text-gray-700 hover:text-[#70c92e]"}`}>
                        {t(item.labelKey)}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language and Auth */}
            <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
              <LanguageDropdown />
              {isLoading ? (
                <div className="text-white">{t("navigation.loading")}</div>
              ) : isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    {t("navigation.welcome")}, {user.firstName}
                  </div>
                  <Link href="/dashboard">
                    <Button variant="ghost" className={navBtnClass(isActive("/dashboard"))}>
                      <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                      {t("navigation.myCollection")}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    {t("navigation.logout")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300">
                      <User className="w-4 h-4 mr-1" />
                      {t("navigation.login")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 mt-4">
              {/* Meetups */}
              <Link href="/meetups" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${navBtnClass(isActive("/meetups"))}`}>
                  {t("navigation.meetups")}
                </Button>
              </Link>

              {/* Insights expandable */}
              <div>
                <Button
                  variant="ghost"
                  className={`w-full justify-between ${navBtnClass(isInsightsActive())}`}
                  onClick={() => setInsightsOpen(!insightsOpen)}
                >
                  Insights
                  <ChevronDown className={`w-4 h-4 transition-transform ${insightsOpen ? "rotate-180" : ""}`} />
                </Button>
                {insightsOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {insightsSubItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setIsOpen(false); setInsightsOpen(false); }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm ${navBtnClass(isActive(item.href))}`}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Heal */}
              <Link href="/heal" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${navBtnClass(isActive("/heal"))}`}>
                  Heal
                </Button>
              </Link>

              {/* Sages */}
              <Link href="/sages" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className={`w-full justify-start ${navBtnClass(isActive("/sages"))}`}>
                  {t("navigation.sages")}
                </Button>
              </Link>

              {/* About expandable */}
              <div>
                <Button
                  variant="ghost"
                  className={`w-full justify-between ${navBtnClass(isAboutActive())}`}
                  onClick={() => setAboutOpen(!aboutOpen)}
                >
                  {t("navigation.about")}
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                </Button>
                {aboutOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {aboutSubItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setIsOpen(false); setAboutOpen(false); }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm ${navBtnClass(isActive(item.href))}`}
                        >
                          {t(item.labelKey)}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="px-4 py-2">
                <LanguageDropdown />
              </div>

              {/* Auth */}
              <div className="pt-2 border-t border-white/20 mt-4">
                {isLoading ? (
                  <div className="text-white text-center py-2">{t("navigation.loading")}</div>
                ) : isAuthenticated && user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-white text-sm px-4 py-2">
                      {t("navigation.welcome")}, {user.firstName}
                    </div>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${navBtnClass(isActive("/dashboard"))}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                        {t("navigation.myCollection")}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full text-white hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("navigation.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="w-full text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t("navigation.login")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
