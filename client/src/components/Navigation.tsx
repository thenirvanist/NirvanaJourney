import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut, Heart, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LanguageDropdown } from "./LanguageDropdown";
import usePreviewMode from "@/hooks/usePreviewMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const isPreviewMode = usePreviewMode();

  const allNavItems = [
    { href: "/journeys", label: "Sacred Journeys", hidden: true },
    { href: "/meetups", label: "Satsangs", hidden: false },
    { href: "/sages", label: "Sages", hidden: false },
    { href: "/ashrams", label: "Ashrams", hidden: true },
  ];
  
  const navItems = useMemo(() => 
    allNavItems.filter(item => isPreviewMode || !item.hidden),
    [isPreviewMode]
  );

  const innerNutritionItems = [
    { href: "/daily-quotes", label: "Daily Quotes" },
    { href: "/inner-nutrition", label: "Articles" },
  ];

  const isActive = (href: string) => location === href;
  
  const isInnerNutritionActive = innerNutritionItems.some(item => isActive(item.href));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="rounded-lg hover:bg-[hsl(70,71%,62%)] p-2 transition-all duration-300">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.href) ? "bg-[hsl(70,71%,62%)] text-black" : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Inner Nutrition Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 ${
                    isInnerNutritionActive ? "bg-[hsl(70,71%,62%)] text-black" : ""
                  }`}
                  data-testid="button-inner-nutrition-dropdown"
                >
                  Inner Nutrition
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg z-[100] min-w-[200px]" align="start">
                {innerNutritionItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                    <Link href={item.href} className="w-full">
                      <div className="w-full px-2 py-2 hover:bg-gray-100 text-gray-900">
                        {item.label}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Language and Authentication Section */}
            <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
              <LanguageDropdown />
              {isLoading ? (
                <div className="text-white">Loading...</div>
              ) : isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-white text-sm">
                    Welcome, {user.firstName}
                  </div>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className={`text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-3 py-2 rounded-lg transition-all duration-300 ${
                        isActive("/dashboard") ? "bg-[hsl(70,71%,62%)] text-black" : ""
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                      My Collection
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-white hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-[hsl(70,71%,62%)] text-black hover:bg-[hsl(70,71%,72%)] px-4 py-2 rounded-lg transition-all duration-300">
                      Sign Up
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
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 justify-start ${
                      isActive(item.href) ? "bg-[hsl(70,71%,62%)] text-black" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {/* Inner Nutrition Section in Mobile */}
              <div className="pl-2">
                <div className="text-white text-sm font-semibold px-2 py-2">Inner Nutrition</div>
                {innerNutritionItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full text-white hover:bg-[hsl(70,71%,62%)] hover:text-black px-4 py-2 rounded-lg transition-all duration-300 justify-start ${
                        isActive(item.href) ? "bg-[hsl(70,71%,62%)] text-black" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
              
              
              {/* Mobile Language Selection */}
              <div className="px-4 py-2">
                <LanguageDropdown />
              </div>
              
              {/* Mobile Authentication Section */}
              <div className="pt-2 border-t border-white/20 mt-4">
                {isLoading ? (
                  <div className="text-white text-center py-2">Loading...</div>
                ) : isAuthenticated && user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-white text-sm px-4 py-2">
                      Welcome, {user.firstName}
                    </div>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className={`w-full px-4 py-2 rounded-lg transition-all duration-300 justify-start ${
                          isActive("/dashboard") 
                            ? "bg-[hsl(70,71%,62%)] text-black" 
                            : "text-white hover:bg-[hsl(70,71%,62%)] hover:text-black"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                        My Collection
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-white hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
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
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        className="w-full bg-[hsl(70,71%,62%)] text-black hover:bg-[hsl(70,71%,72%)] px-4 py-2 rounded-lg transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
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
