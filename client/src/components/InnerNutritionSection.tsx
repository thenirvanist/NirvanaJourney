import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { useBlogPosts } from "@/hooks/useSupabaseQuery";

export default function InnerNutritionSection() {
  const { data: blogPosts, isLoading, error } = useBlogPosts();

  if (error) {
    console.error('Error loading blog posts:', error);
    return null;
  }

  // Show the 3 latest posts for homepage
  const latestPosts = blogPosts?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Insights</h2>
          <p className="text-xl text-gray-600 mb-12">
            Nourishment for your spiritual journey through mindful insights and transformative wisdom
          </p>
          <p className="text-gray-500">Coming soon - profound articles to nourish your inner being</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Insights</h2>
          <p className="text-xl text-gray-600 mb-8">
            Nourishment for your spiritual journey through mindful insights and transformative wisdom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post: BlogPost) => (
            <Link key={post.id} href={`/inner-nutrition/${post.slug}`}>
              <Card className="group bg-white hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 h-full flex flex-col">
                <div className="relative overflow-hidden flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[hsl(75,64%,49%)] transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[hsl(75,64%,49%)]/10 text-[hsl(75,64%,39%)] rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-[hsl(75,64%,49%)] font-medium group-hover:text-[hsl(75,64%,39%)] transition-colors duration-300 mt-auto">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/inner-nutrition" onClick={() => window.scrollTo(0, 0)}>
            <Button className="bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Explore All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}