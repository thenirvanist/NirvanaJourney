import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MapPin, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema, createPersonSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSage } from "@/hooks/useSupabaseQuery";

export default function SageDetail() {
  const { id } = useParams<{ id: string }>();
  const sageId = parseInt(id || "0");

  const { data: sage, isLoading, error } = useSage(sageId);


  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Sacred Biography...</h1>
              <p className="text-xl text-gray-600">Gathering the life story of this spiritual master</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !sage) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">Biography Not Found</h1>
              <p className="text-xl text-gray-600 mb-8">
                We couldn't find the biography you're looking for.
              </p>
              <Link href="/sages">
                <Button className="brand-primary hover:brand-bright text-white hover:text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to All Sages
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sageUrl = `https://www.thenirvanist.com/sages/${sageId}`;
  
  const sageBreadcrumb = createBreadcrumbSchema([
    { name: "Home", url: "https://www.thenirvanist.com" },
    { name: "Sages", url: "https://www.thenirvanist.com/sages" },
    { name: sage.name }
  ]);
  
  const personSchema = createPersonSchema({
    name: sage.name,
    description: sage.description,
    image: sage.image,
    birthPlace: sage.location || undefined,
    teachings: sage.teachings || undefined,
    url: sageUrl
  });

  return (
    <div className="min-h-screen">
      <Seo 
        title={`${sage.name} - Biography & Teachings`}
        description={sage.description || `Learn about ${sage.name}, their life story, spiritual teachings, and profound wisdom that continues to guide seekers on their spiritual journey.`}
        ogImage={sage.image}
        ogType="profile"
      />
      <SchemaOrg schema={[sageBreadcrumb, personSchema]} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/sages">
            <Button variant="ghost" className="mb-6 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Sages
            </Button>
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={sage.image} 
                alt={`Portrait of ${sage.name}, spiritual teacher`}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{sage.name}</h1>
              <p className="text-xl text-[hsl(75,64%,49%)] font-medium mb-4">{sage.description}</p>
              
              {sage.location && (
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{sage.location}</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {sage.category && (
                  <Badge variant="secondary" className="text-sm">
                    {sage.category}
                  </Badge>
                )}
                {sage.era && (
                  <Badge variant="outline" className="text-sm">
                    {sage.era}
                  </Badge>
                )}
                {sage.status && (
                  <Badge variant={sage.status === 'Living' ? 'default' : 'secondary'} className="text-sm">
                    {sage.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Heart className="w-6 h-6 text-[hsl(75,64%,49%)] mr-3" />
                Life & Teachings
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
                  {sage.biography}
                </Markdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Teachings & Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {sage.teachings && sage.teachings.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Sparkles className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                    Core Teachings
                  </h3>
                  <div className="space-y-3">
                    {sage.teachings.map((teaching, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[hsl(75,64%,49%)] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 font-medium">{teaching}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {sage.books && sage.books.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                    Notable Works
                  </h3>
                  <div className="space-y-3">
                    {sage.books.map((book, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[hsl(75,64%,49%)] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 font-medium">{book}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Carry Their Light Forward</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The wisdom of {sage.name} continues to inspire spiritual seekers across the world. 
            Their teachings offer timeless guidance for our own journey of self-discovery and enlightenment.
          </p>
          <Link href="/sages">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3">
              Explore More Sages
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}