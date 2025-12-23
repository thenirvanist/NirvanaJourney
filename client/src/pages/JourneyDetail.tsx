import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, DollarSign, Users, Calendar, Star } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema, createTripSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useJourney } from "@/hooks/useSupabaseQuery";

export default function JourneyDetail() {
  const [, params] = useRoute("/journeys/:id");
  const journeyId = params?.id ? parseInt(params.id) : 0;

  const { data: journey, isLoading, error } = useJourney(journeyId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Journey Details...</h1>
              <p className="text-xl text-gray-600">Preparing your spiritual adventure</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">Journey Not Found</h1>
              <p className="text-xl text-gray-600">
                We couldn't find the spiritual journey you're looking for. Please check the URL or explore our other transformative experiences.
              </p>
              <Button className="mt-6 brand-primary hover:brand-bright text-white hover:text-black">
                <a href="/journeys">View All Journeys</a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const journeyUrl = `https://www.thenirvanist.com/journeys/${journeyId}`;
  
  const journeyBreadcrumb = createBreadcrumbSchema([
    { name: "Home", url: "https://www.thenirvanist.com" },
    { name: "Sacred Journeys", url: "https://www.thenirvanist.com/journeys" },
    { name: journey.title }
  ]);
  
  const tripSchema = createTripSchema({
    name: journey.title,
    description: journey.description,
    image: journey.heroImage || journey.image,
    price: journey.price,
    duration: journey.duration,
    location: journey.location,
    available: journey.available ?? undefined,
    url: journeyUrl
  });

  return (
    <div className="min-h-screen">
      <Seo 
        title={`${journey.title} - Spiritual Journey to ${journey.location}`}
        description={journey.description || `Experience a transformative spiritual journey: ${journey.title}. ${journey.duration} retreat in ${journey.location}. Book your sacred experience today.`}
        ogImage={journey.heroImage || journey.image}
      />
      <SchemaOrg schema={[journeyBreadcrumb, tripSchema]} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: `url('${journey.heroImage || journey.image}')`}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <Badge className="mb-4 bg-[hsl(75,64%,49%)] text-black text-lg px-6 py-2">
            {journey.available ? "Available Now" : "Fully Booked"}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{journey.title}</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            {journey.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-lg">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {journey.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {journey.duration}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              {journey.price}
            </div>
          </div>
          
          <Button 
            className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300"
            disabled={!journey.available}
          >
            {journey.available ? "Book This Journey" : "Join Waitlist"}
          </Button>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="overview" className="text-lg py-4">Overview</TabsTrigger>
              <TabsTrigger value="description" className="text-lg py-4">Description</TabsTrigger>
              <TabsTrigger value="itinerary" className="text-lg py-4">Itinerary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Journey Overview</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {journey.overview || journey.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-lg">
                      <MapPin className="w-6 h-6 mr-3 text-[hsl(75,64%,49%)]" />
                      <span className="font-medium mr-2">Location:</span>
                      <span>{journey.location}</span>
                    </div>
                    <div className="flex items-center text-lg">
                      <Clock className="w-6 h-6 mr-3 text-[hsl(75,64%,49%)]" />
                      <span className="font-medium mr-2">Duration:</span>
                      <span>{journey.duration}</span>
                    </div>
                    <div className="flex items-center text-lg">
                      <DollarSign className="w-6 h-6 mr-3 text-[hsl(75,64%,49%)]" />
                      <span className="font-medium mr-2">Investment:</span>
                      <span className="text-[hsl(75,64%,49%)] font-semibold">{journey.price}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <img 
                    src={journey.image} 
                    alt={journey.title}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>
              
              {journey.inclusions && journey.inclusions.length > 0 && (
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6">What's Included</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {journey.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-center">
                          <Star className="w-5 h-5 mr-3 text-[hsl(75,64%,49%)]" />
                          <span>{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="description" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Full Journey Description</h2>
                <div className="prose prose-lg max-w-none break-words">
                  <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({node, ...props}) => (
                        <img 
                          {...props} 
                          className="rounded-lg shadow-md my-6 max-w-full h-auto" 
                          loading="lazy"
                        />
                      ),
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4 break-words" {...props} />,
                      a: ({node, ...props}) => <a className="text-[hsl(75,64%,49%)] hover:underline break-all" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-[hsl(75,64%,49%)] pl-4 italic my-4 text-gray-600" {...props} />
                      ),
                    }}
                  >
                    {journey.fullDescription || journey.description}
                  </Markdown>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Journey Itinerary</h2>
                <Card>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none break-words">
                      <Markdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          img: ({node, ...props}) => (
                            <img 
                              {...props} 
                              className="rounded-lg shadow-md my-6 max-w-full h-auto" 
                              loading="lazy"
                            />
                          ),
                          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4 break-words" {...props} />,
                          a: ({node, ...props}) => <a className="text-[hsl(75,64%,49%)] hover:underline break-all" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-[hsl(75,64%,49%)] pl-4 italic my-4 text-gray-600" {...props} />
                          ),
                        }}
                      >
                        {journey.itinerary || "Detailed itinerary will be provided upon booking. Our carefully crafted journey includes daily activities, spiritual practices, cultural experiences, and moments for reflection and growth."}
                      </Markdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Transformation?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join us on this sacred journey and discover the profound peace and wisdom that awaits you.
          </p>
          <Button 
            className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300"
            disabled={!journey.available}
          >
            {journey.available ? "Book Your Journey Now" : "Join Our Waitlist"}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}