import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { useActiveQuotes } from "@/hooks/useSupabaseQuery";
import { BookmarkButton } from "./BookmarkButton";

export default function QuotesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);

  // Fetch active quotes from Supabase
  const { data: quotes = [], isLoading, isError } = useActiveQuotes();

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, quotes.length]);

  // Navigate to previous quote
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setIsPlaying(false);
  };

  // Navigate to next quote
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setIsPlaying(false);
  };

  // Navigate to specific quote
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  // Resume autoplay after interaction
  useEffect(() => {
    if (!isPlaying) {
      const timeout = setTimeout(() => setIsPlaying(true), 5000); // Resume after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [isPlaying]);

  // Format date for display (handles PostgreSQL date format)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date not available";
    
    try {
      // PostgreSQL date format is YYYY-MM-DD
      // Append time to force UTC interpretation and avoid timezone shift
      const date = new Date(dateString + 'T00:00:00Z');
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric',
        timeZone: 'UTC' // Force UTC to prevent timezone shifts
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Handle image loading errors
  const handleImageError = (quoteId: number) => {
    setImageError(prev => ({ ...prev, [quoteId]: true }));
  };

  if (isLoading) {
    return (
      <section className="bg-[#F7F2E8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Daily Quotes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspirational quotes from spiritual masters and mystics
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || quotes.length === 0) {
    return (
      <section className="bg-[#F7F2E8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Daily Quotes
            </h2>
            <p className="text-xl text-gray-600">
              Unable to load quotes at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <section className="bg-[#F7F2E8] py-16" data-testid="quotes-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Daily Quotes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inspirational quotes from spiritual masters and mystics around the world
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-xl mx-auto">
          {/* Main Quote Card with hover scale effect */}
          <div 
            className={`relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 ease-out ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {imageError[currentQuote.id] || !currentQuote.image_url ? (
              // Fallback for missing/broken images
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center relative">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentQuote.title}</h3>
                  <p className="text-lg text-gray-700 italic">"{currentQuote.quote_text}"</p>
                  <p className="text-md text-gray-600 mt-4">— {currentQuote.author}</p>
                </div>
                {/* Date Label */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full z-10">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(currentQuote.display_date)}
                  </span>
                </div>
                {/* Bookmark Button */}
                <div className="absolute top-4 right-16 z-10">
                  <BookmarkButton 
                    contentType="quote" 
                    contentId={currentQuote.id} 
                    size="md"
                  />
                </div>
              </div>
            ) : (
              <div 
                className="aspect-square bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentQuote.image_url})` }}
              >
                <img
                  src={currentQuote.image_url}
                  alt={currentQuote.title}
                  className="hidden"
                  onError={() => handleImageError(currentQuote.id)}
                />
                {/* Date Label */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full z-10">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(currentQuote.display_date)}
                  </span>
                </div>
                {/* Bookmark Button */}
                <div className="absolute top-4 right-16 z-10">
                  <BookmarkButton 
                    contentType="quote" 
                    contentId={currentQuote.id} 
                    size="md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg z-20"
            data-testid="button-previous-quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg z-20"
            data-testid="button-next-quote"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Autoplay Control */}
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 px-3 py-2 bg-white/90 hover:bg-white text-gray-900 text-xs rounded-full shadow-lg z-20"
            data-testid="button-toggle-autoplay"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center mt-8 space-x-3">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              data-testid={`dot-indicator-${index}`}
            />
          ))}
        </div>

        {/* Author Labels */}
        <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
          {quotes.map((quote, index) => (
            <button
              key={quote.id}
              onClick={() => goToIndex(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              data-testid={`author-label-${index}`}
            >
              {quote.author}
            </button>
          ))}
        </div>

        {/* Explore All Button */}
        <div className="text-center mt-8">
          <Link href="/daily-quotes">
            <Button className="bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Explore All Daily Quotes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
