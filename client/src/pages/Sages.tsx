import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, Sparkles, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSages } from "@/hooks/useSupabaseQuery";

const sagesBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Sages" }
]);

export default function Sages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: sages, isLoading, error } = useSages();

  const filterOptions = [
    "All",
    "Living Sages", 
    "Modern Sages",
    "Ancient Sages",
    "Hindu",
    "Buddhist", 
    "Sufi",
    "Jain"
  ];

  const filteredSages = useMemo(() => {
    if (!sages) return [];
    
    let filtered = sages.filter(sage => {
      const matchesSearch = sage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sage.teachings?.some(teaching => teaching.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          sage.books?.some(book => book.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (activeFilter === "All") return true;
      if (activeFilter === "Living Sages") return sage.status === "Living";
      if (activeFilter === "Modern Sages") return sage.era === "Modern";
      if (activeFilter === "Ancient Sages") return sage.era === "Ancient";
      
      return sage.category === activeFilter;
    });
    
    return filtered;
  }, [sages, searchTerm, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Wisdom of the Sages...</h1>
              <p className="text-xl text-gray-600">Gathering the profound teachings of spiritual masters</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Sage Wisdom</h1>
              <p className="text-xl text-gray-600">
                We're experiencing difficulties accessing the sacred texts and teachings. 
                Please try again later or contact our support team.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!sages || sages.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Wisdom of the Sages</h1>
              <p className="text-xl text-gray-600">
                The sacred teachings are being compiled. Please check back soon as we continue 
                to gather wisdom from spiritual masters across traditions.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Seo 
        title="Spiritual Sages & Masters - Biographies & Teachings"
        description="Explore the lives and teachings of enlightened sages and spiritual masters across traditions. Discover Hindu, Buddhist, Sufi, and Jain wisdom from ancient and modern teachers."
      />
      <SchemaOrg schema={sagesBreadcrumb} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Wisdom of the Sages</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Spiritual philosophers, to whatever background they may belong, have left their mark in sands of times. 
            They lived and left this world holding a single aspiration – progress of their fellow human beings 
            in paths of spirituality. For this they sacrificed their own comforts, tolerated hardships, censure, 
            torture, ridicule with grace and with kindness.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl font-light italic leading-relaxed">
            "By reading their lives and letting it inspire you, you pay your ultimate homage 
            to them and their lives efforts."
          </blockquote>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search sages by name or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg rounded-lg border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] transition-colors"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filterOptions.map((filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                variant={activeFilter === filter ? "default" : "outline"}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "brand-primary text-white hover:brand-bright hover:text-black"
                    : "border-gray-300 text-gray-700 hover:border-[hsl(75,64%,49%)] hover:text-[hsl(75,64%,49%)]"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredSages.length} {filteredSages.length === 1 ? 'sage' : 'sages'}
              {activeFilter !== "All" && ` in ${activeFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Sages Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {filteredSages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No sages found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find the wisdom you seek.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("All");
                }}
                className="brand-primary hover:brand-bright text-white hover:text-black"
              >
                Clear Search & Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSages.map((sage) => (
                <Link key={sage.id} href={`/sages/${sage.id}`} className="block">
                  <Card className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 h-[620px] flex flex-col cursor-pointer">
                    <img 
                      src={sage.image} 
                      alt={sage.name}
                      className="w-full h-48 object-cover flex-shrink-0"
                    />
                    <div className="p-5 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-1">{sage.name}</h3>
                        
                        {sage.location && (
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600 line-clamp-1">{sage.location}</span>
                          </div>
                        )}

                        <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-sm">
                          {sage.description}
                        </p>

                        <div className="space-y-2">
                          {sage.teachings && sage.teachings.length > 0 && (
                            <div>
                              <div className="flex items-center mb-1">
                                <Sparkles className="w-4 h-4 text-[hsl(75,64%,49%)] mr-2" />
                                <h4 className="font-semibold text-gray-700 text-xs">Core Teachings</h4>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {sage.teachings.slice(0, 2).map((teaching, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {teaching}
                                  </Badge>
                                ))}
                                {sage.teachings.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{sage.teachings.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {sage.books && sage.books.length > 0 && (
                            <div>
                              <div className="flex items-center mb-1">
                                <BookOpen className="w-4 h-4 text-[hsl(75,64%,49%)] mr-2" />
                                <h4 className="font-semibold text-gray-700 text-xs">Notable Work</h4>
                              </div>
                              <ul className="text-xs text-gray-600 space-y-0.5">
                                {sage.books.slice(0, 2).map((book, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="w-1 h-1 bg-[hsl(75,64%,49%)] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                    <span className="line-clamp-1">{book}</span>
                                  </li>
                                ))}
                                {sage.books.length > 2 && (
                                  <li className="text-[hsl(75,64%,49%)] text-xs">
                                    + {sage.books.length - 2} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 mt-3">
                        <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-2.5 text-sm rounded-lg font-semibold transition-all duration-300">
                          Read Full Biography
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Carry Their Light Forward</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The wisdom of these great souls transcends time and culture. Their teachings remain as relevant today 
            as they were centuries ago, offering guidance for our modern spiritual journey. By studying their lives 
            and integrating their wisdom, we honor their legacy and continue the eternal tradition of spiritual growth.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Study Their Teachings</h3>
              <p className="text-sm text-gray-600">Immerse yourself in their profound wisdom</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Practice with Devotion</h3>
              <p className="text-sm text-gray-600">Apply their guidance in daily life</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Share Their Light</h3>
              <p className="text-sm text-gray-600">Inspire others through their example</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
