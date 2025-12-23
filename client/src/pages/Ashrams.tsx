import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Globe, Star, Heart, Leaf, Search, User } from "lucide-react";
import { Link } from "wouter";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAshrams } from "@/hooks/useSupabaseQuery";

const ashramsBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Ashrams" }
]);

export default function Ashrams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: ashrams, isLoading, error } = useAshrams();

  const filterOptions = [
    "All",
    "North India",
    "South India", 
    "West India",
    "East India",
    "Central India"
  ];

  const filteredAshrams = useMemo(() => {
    if (!ashrams) return [];
    
    let filtered = ashrams.filter(ashram => {
      const matchesSearch = ashram.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ashram.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ashram.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ashram.focus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ashram.founders?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ashram.facilities?.some(facility => facility.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (activeFilter === "All") return true;
      
      return ashram.region === activeFilter;
    });
    
    return filtered;
  }, [ashrams, searchTerm, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Sacred Ashrams...</h1>
              <p className="text-xl text-gray-600">Discovering peaceful sanctuaries for spiritual growth</p>
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
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Sacred Spaces</h1>
              <p className="text-xl text-gray-600">
                We're experiencing difficulties connecting to our ashram network. 
                Please try again later or contact our support team.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ashrams || ashrams.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Sacred Ashrams</h1>
              <p className="text-xl text-gray-600">
                Our network of sacred ashrams is being carefully curated. Please check back soon 
                as we continue to connect with spiritual centers worldwide.
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
        title="Sacred Ashrams in India - Spiritual Retreats & Meditation Centers"
        description="Discover authentic ashrams across India for spiritual retreats, meditation, yoga, and self-discovery. Find sacred spaces with detailed information on facilities, teachings, and how to visit."
      />
      <SchemaOrg schema={ashramsBreadcrumb} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6">Sacred Ashrams</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Discover ancient ashrams where countless souls have found peace and enlightenment. 
            These sacred spaces have preserved spiritual wisdom for centuries, offering refuge 
            and guidance to seekers from all walks of life.
          </p>
          <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
            Explore Sacred Spaces
          </Button>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl font-light italic leading-relaxed">
            "In the silence of sacred spaces, the soul finds its true home."
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
                placeholder="Search ashrams by name, location, or focus..."
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
              Showing {filteredAshrams.length} {filteredAshrams.length === 1 ? 'ashram' : 'ashrams'}
              {activeFilter !== "All" && ` in ${activeFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Ashrams Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {filteredAshrams.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No ashrams found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find the sacred space you seek.
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
              {filteredAshrams.map((ashram) => (
                <Card key={ashram.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 h-[620px] flex flex-col">
                  <img 
                    src={ashram.image} 
                    alt={ashram.name}
                    className="w-full h-48 object-cover flex-shrink-0"
                  />
                  <div className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">{ashram.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600 line-clamp-1">{ashram.location}</span>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-sm">
                        {ashram.description}
                      </p>

                      <div className="space-y-2">
                        {ashram.focus && (
                          <div>
                            <div className="flex items-center mb-1">
                              <Star className="w-4 h-4 text-[hsl(75,64%,49%)] mr-2" />
                              <h4 className="font-semibold text-gray-700 text-xs">Focus</h4>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {ashram.focus}
                            </Badge>
                          </div>
                        )}

                        {ashram.founders && (
                          <div>
                            <div className="flex items-center mb-1">
                              <User className="w-4 h-4 text-[hsl(75,64%,49%)] mr-2" />
                              <h4 className="font-semibold text-gray-700 text-xs">Founder</h4>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1">{ashram.founders}</p>
                          </div>
                        )}

                        {ashram.facilities && ashram.facilities.length > 0 && (
                          <div>
                            <div className="flex items-center mb-1">
                              <Leaf className="w-4 h-4 text-[hsl(75,64%,49%)] mr-2" />
                              <h4 className="font-semibold text-gray-700 text-xs">Key Facilities</h4>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-0.5">
                              {ashram.facilities.slice(0, 2).map((facility, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1 h-1 bg-[hsl(75,64%,49%)] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                                  <span className="line-clamp-1">{facility}</span>
                                </li>
                              ))}
                              {ashram.facilities.length > 2 && (
                                <li className="text-[hsl(75,64%,49%)] text-xs">
                                  + {ashram.facilities.length - 2} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 mt-3">
                      <Link href={`/ashrams/${ashram.id}`}>
                        <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-2.5 text-sm rounded-lg font-semibold transition-all duration-300">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Makes These Ashrams Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Authentic Traditions</h3>
              <p className="text-gray-600">
                Experience genuine spiritual practices passed down through generations of masters
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Natural Harmony</h3>
              <p className="text-gray-600">
                Peaceful environments that foster deep connection with nature and inner self
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Guided Growth</h3>
              <p className="text-gray-600">
                Experienced teachers and practitioners to support your spiritual journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Ashram Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with these sacred spaces and discover the path that resonates with your soul
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 text-lg font-semibold"
            >
              Plan Your Visit
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[hsl(84,42%,18%)] px-8 py-3 text-lg font-semibold"
            >
              Contact Our Guides
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
