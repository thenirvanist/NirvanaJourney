import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAllDailyWisdom } from "@/hooks/useSupabaseQuery";
import { BookmarkButton } from "@/components/BookmarkButton";

export default function DailyQuotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: quotes, isLoading, error } = useAllDailyWisdom();

  // Extract unique authors for filter buttons
  const filterOptions = useMemo(() => {
    if (!quotes) return ["All"];
    const authorSet = new Set(quotes.map(q => q.author).filter(Boolean));
    const authors = Array.from(authorSet);
    return ["All", ...authors.sort()];
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (!quotes) return [];
    
    let filtered = quotes.filter(quote => {
      const matchesSearch = 
        quote.quote_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeFilter === "All") return true;
      
      return quote.author === activeFilter;
    });
    
    return filtered;
  }, [quotes, searchTerm, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Daily Quotes...</h1>
              <p className="text-xl text-gray-600">Gathering spiritual insights for your journey</p>
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
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Daily Quotes</h1>
              <p className="text-xl text-gray-600">
                We're experiencing difficulties accessing the quotes. 
                Please try again later.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Daily Quotes</h1>
              <p className="text-xl text-gray-600">
                Daily wisdom quotes are being compiled. Please check back soon.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Daily Quotes</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover timeless wisdom from spiritual masters across traditions. Each quote offers 
            profound insights to illuminate your path and nourish your spiritual journey.
          </p>
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
                placeholder="Search by quote or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg rounded-lg border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] transition-colors"
                data-testid="input-search-quotes"
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
                data-testid={`button-filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing {filteredQuotes.length} {filteredQuotes.length === 1 ? 'quote' : 'quotes'}
              {activeFilter !== "All" && ` by ${activeFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Quotes Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No quotes found matching your search criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("All");
                }}
                className="mt-6 brand-primary text-white hover:brand-bright hover:text-black px-6 py-3"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQuotes.map((quote) => (
                <Card 
                  key={quote.id} 
                  className="group bg-white hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-0 cursor-pointer"
                  data-testid={`card-quote-${quote.id}`}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      {/* Image with premium zoom effect */}
                      <img
                        src={quote.image_url}
                        alt={`Quote by ${quote.author}`}
                        className="w-full h-auto object-cover will-change-transform group-hover:scale-150"
                        style={{
                          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                        }}
                      />
                      {/* Bookmark Button */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <BookmarkButton 
                          contentType="quote" 
                          contentId={quote.id} 
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                      <p className="font-semibold text-gray-900 text-center">
                        {quote.author}
                      </p>
                      {quote.display_date && (
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {new Date(quote.display_date + 'T00:00:00Z').toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
