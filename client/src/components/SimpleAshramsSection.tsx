import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookmarkButton } from "./BookmarkButton";
import { useAshrams } from "@/hooks/useSupabaseQuery";

export default function SimpleAshramsSection() {
  const { data: ashrams, isLoading, error } = useAshrams();

  if (isLoading) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(75,64%,49%)]"></div>
              <p className="text-lg text-gray-700">Loading sacred spaces...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Content unavailable</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!ashrams || ashrams.length === 0) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700">No ashram information available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover ancient ashrams where countless souls have found peace and enlightenment. 
            These sacred spaces have preserved spiritual wisdom for centuries.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ashrams.slice(0, 3).map((ashram) => (
            <Link 
              key={ashram.id} 
              href={`/ashrams/${ashram.id}`} 
              onClick={() => window.scrollTo(0, 0)}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                <div className="relative">
                  <img 
                    src={ashram.image} 
                    alt={ashram.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
                    <BookmarkButton 
                      contentType="ashram" 
                      contentId={ashram.id} 
                      size="sm"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{ashram.name}</h3>
                  <p className="text-gray-600 mb-3">{ashram.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{ashram.location}</p>
                  
                  {ashram.facilities && ashram.facilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Key Facilities:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {ashram.facilities.slice(0, 3).map((facility, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-[hsl(75,64%,49%)] rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span>{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                    Learn More
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/ashrams" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Explore All Ashrams
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}