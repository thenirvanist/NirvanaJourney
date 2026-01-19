import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookmarkButton } from "./BookmarkButton";
import { useJourneys } from "@/hooks/useSupabaseQuery";

export default function SimpleTourCarousel() {
  const { data: journeys, isLoading, error } = useJourneys();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(75,64%,49%)]"></div>
              <p className="text-xl text-gray-600">Loading transformative retreats...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Content unavailable</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!journeys || journeys.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <p className="text-xl text-gray-600">No journeys available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
          <p className="text-xl text-gray-600">Transformative retreats designed for your spiritual growth</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journeys.slice(0, 3).map((journey) => (
            <div key={journey.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={journey.image} 
                  alt={journey.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <BookmarkButton 
                    contentType="journey" 
                    contentId={journey.id} 
                    size="sm"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{journey.title}</h3>
                <p className="text-gray-600 mb-4">{journey.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">Location:</span>
                    <span className="text-gray-700">{journey.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">Duration:</span>
                    <span className="text-gray-700">{journey.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">Investment:</span>
                    <span className="font-semibold text-[hsl(75,64%,49%)]">{journey.price}</span>
                  </div>
                </div>

                <Link href={`/journeys/${journey.id}`} onClick={() => window.scrollTo(0, 0)}>
                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                    Begin Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/journeys" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Visit All Journeys
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}