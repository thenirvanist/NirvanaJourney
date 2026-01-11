import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { useActiveQuotes } from "@/hooks/useSupabaseQuery";
import type { DailyWisdom } from "@shared/schema";
import { BookmarkButton } from "./BookmarkButton";
import html2canvas from "html2canvas";

export default function QuotesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  // Fetch active quotes from Supabase
  const { data, isLoading, isError } = useActiveQuotes();
  const quotes: DailyWisdom[] = data || [];

  // Handle download quote as image
  const handleDownloadQuote = async (author: string) => {
    if (!quoteRef.current) return;

    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false
      });

      const link = document.createElement("a");
      link.download = `Nirvanist-Quote-${author.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download quote:", error);
    } finally {
      setIsDownloading(false);
    }
  };

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
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Daily Quotes
            </h2>
            <p className="text-xl text-gray-600 whitespace-nowrap">
              Inspirational quotes from spiritual masters and mystics
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 max-w-lg aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
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
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Daily Quotes
          </h2>
          <p className="text-xl text-gray-600 whitespace-nowrap">
            Inspirational quotes from spiritual masters and mystics
          </p>
        </div>

        {/* Carousel Container with arrows outside */}
        <div className="relative max-w-2xl mx-auto flex items-center justify-center gap-4">
          {/* Left Navigation Arrow - Outside quote box */}
          <Button
            onClick={goToPrevious}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
            data-testid="button-previous-quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Main Quote Card - Clean without superimposed elements */}
          <div 
            className="flex-1 max-w-lg overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {imageError[currentQuote.id] || !currentQuote.image_url ? (
              // Fallback for missing/broken images
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentQuote.title}</h3>
                  <p className="text-lg text-gray-700 italic">"{currentQuote.quote_text}"</p>
                  <p className="text-md text-gray-600 mt-4">— {currentQuote.author}</p>
                </div>
              </div>
            ) : (
              <div 
                ref={quoteRef}
                className="aspect-square relative overflow-hidden"
              >
                {/* Image with premium zoom effect */}
                <div 
                  className="absolute inset-0 bg-cover bg-center will-change-transform"
                  style={{ 
                    backgroundImage: `url(${currentQuote.image_url})`,
                    transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                />
                <img
                  src={currentQuote.image_url}
                  alt={currentQuote.title}
                  className="hidden"
                  onError={() => handleImageError(currentQuote.id)}
                />
              </div>
            )}
          </div>

          {/* Right Navigation Arrow - Outside quote box */}
          <Button
            onClick={goToNext}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
            data-testid="button-next-quote"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Date and Action Buttons - Below quote box in black */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <span className="text-sm font-medium text-black">
            {formatDate(currentQuote.display_date)}
          </span>
          <div className="flex gap-2">
            {/* Download Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownloadQuote(currentQuote.author || 'Unknown');
              }}
              disabled={isDownloading}
              className="p-2 rounded-full bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm"
              title="Download Quote"
              data-testid="button-download-carousel-quote"
            >
              {isDownloading ? (
                <Loader2 className="h-5 w-5 text-black animate-spin" />
              ) : (
                <Download className="h-5 w-5 text-black hover:text-[#70c92e]" />
              )}
            </Button>
            {/* Bookmark Button */}
            <BookmarkButton 
              contentType="quote" 
              contentId={currentQuote.id} 
              size="md"
            />
          </div>
        </div>

        {/* Dot Indicators - Brand green */}
        <div className="flex justify-center items-center mt-6 space-x-3">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#70c92e] scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              data-testid={`dot-indicator-${index}`}
            />
          ))}
        </div>

        {/* Author Labels - Brand green */}
        <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
          {quotes.map((quote, index) => (
            <button
              key={quote.id}
              onClick={() => goToIndex(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                index === currentIndex
                  ? "bg-[#70c92e] text-white"
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
