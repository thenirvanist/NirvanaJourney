import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Heart, Leaf, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema, createPlaceSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAshram } from "@/hooks/useSupabaseQuery";
import { useTranslation } from "@/hooks/useTranslation";

export default function AshramDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const ashramId = parseInt(id || "0");

  const { data: ashram, isLoading, error } = useAshram(ashramId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">{t("pages.ashramDetail.loading")}</h1>
              <p className="text-xl text-gray-600">{t("pages.ashramDetail.loadingSubtitle")}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ashram) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">{t("pages.ashramDetail.notFound")}</h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("pages.ashramDetail.notFoundSubtitle")}
              </p>
              <Link href="/ashrams">
                <Button className="brand-primary hover:brand-bright text-white hover:text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("pages.ashramDetail.returnToAll")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ashramUrl = `https://www.thenirvanist.com/ashrams/${ashramId}`;
  
  const ashramBreadcrumb = createBreadcrumbSchema([
    { name: "Home", url: "https://www.thenirvanist.com" },
    { name: "Ashrams", url: "https://www.thenirvanist.com/ashrams" },
    { name: ashram.name }
  ]);
  
  const placeSchema = createPlaceSchema({
    name: ashram.name,
    description: ashram.description,
    image: ashram.image,
    location: ashram.location,
    telephone: ashram.contact || undefined,
    url: ashramUrl
  });

  return (
    <div className="min-h-screen">
      <Seo 
        title={`${ashram.name} - Ashram in ${ashram.location}`}
        description={ashram.description || `Visit ${ashram.name}, a sacred ashram in ${ashram.location}. Learn about facilities, spiritual programs, and how to plan your retreat.`}
        ogImage={ashram.image}
      />
      <SchemaOrg schema={[ashramBreadcrumb, placeSchema]} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/ashrams">
            <Button variant="ghost" className="mb-6 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Ashrams
            </Button>
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={ashram.image} 
                alt={`${ashram.name} ashram in ${ashram.location}`}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{ashram.name}</h1>
              
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700 text-lg">{ashram.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {ashram.region && (
                  <Badge variant="secondary" className="text-sm">
                    {ashram.region}
                  </Badge>
                )}
                {ashram.focus && (
                  <Badge variant="outline" className="text-sm">
                    {ashram.focus}
                  </Badge>
                )}
              </div>

              {ashram.founders && (
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-[hsl(75,64%,49%)] mr-2" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Founded by:</span> {ashram.founders}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Heart className="w-6 h-6 text-[hsl(75,64%,49%)] mr-3" />
                About This Sacred Space
              </h2>
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
                  {ashram.description}
                </Markdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Facilities & Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {ashram.facilities && ashram.facilities.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Leaf className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                    Facilities & Offerings
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {ashram.facilities.map((facility, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[hsl(75,64%,49%)] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Phone className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {ashram.contact && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{ashram.contact}</span>
                    </div>
                  )}
                  
                  {ashram.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-500 mr-3" />
                      <a 
                        href={`https://${ashram.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[hsl(75,64%,49%)] hover:underline"
                      >
                        {ashram.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{ashram.location}</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3">
                    Plan Your Visit
                  </Button>
                  <Button variant="outline" className="w-full border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white py-3">
                    Contact Ashram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Begin Your Sacred Journey</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {ashram.name} offers a unique opportunity for spiritual growth and inner transformation. 
            Connect with this sacred tradition and discover the peace that awaits within.
          </p>
          <Link href="/ashrams">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3">
              Explore More Ashrams
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}