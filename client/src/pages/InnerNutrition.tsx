import { useState } from "react";
import { Link } from "wouter";
import { Search, Clock, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Seo from "@/components/Seo";
import SchemaOrg, { createBreadcrumbSchema } from "@/components/SchemaOrg";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { BlogPost } from "@shared/schema";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useBlogPosts } from "@/hooks/useSupabaseQuery";

const blogBreadcrumb = createBreadcrumbSchema([
  { name: "Home", url: "https://www.thenirvanist.com" },
  { name: "Inner Nutrition" }
]);

export default function InnerNutrition() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: blogPosts = [], isLoading, error } = useBlogPosts();

  // Filter blog posts based on search term and category
  const filteredPosts = blogPosts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === "All" || 
                           post.category === selectedCategory ||
                           (post.tags?.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from all posts
  const categories = ["All", ...blogPosts.reduce((cats: string[], post: BlogPost) => {
    if (!cats.includes(post.category)) cats.push(post.category);
    post.tags?.forEach((tag: string) => {
      if (!cats.includes(tag)) cats.push(tag);
    });
    return cats;
  }, [])];

  if (error) {
    console.error('Error loading blog posts:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Inner Nutrition</h1>
            <p className="text-xl text-red-600">Failed to load articles. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo 
        title="Inner Nutrition - Spiritual Articles & Mindfulness Wisdom"
        description="Explore profound insights and transformative wisdom to nourish your spiritual journey. Articles on mindfulness, meditation, consciousness, and the path to inner awakening."
      />
      <SchemaOrg schema={blogBreadcrumb} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[hsl(38,42%,96%)] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Inner Nutrition</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover profound insights and transformative wisdom to nourish your spiritual journey. 
              Explore articles on mindfulness, consciousness, and the path to inner awakening.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 border-2 border-gray-200 focus:border-[hsl(75,64%,49%)] rounded-lg"
                />
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[hsl(75,64%,49%)] text-white hover:bg-[hsl(75,64%,59%)]"
                      : "border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
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
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filter criteria."
                  : "New articles are being prepared to nourish your spiritual journey."
                }
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  variant="outline"
                  className="border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: BlogPost) => (
                <Link key={post.id} href={`/inner-nutrition/${post.slug}`}>
                  <Card className="group bg-white hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 h-full">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3">
                        <BookmarkButton 
                          contentType="blog" 
                          contentId={post.id} 
                          size="sm"
                        />
                      </div>
                    </div>
                    
                    <CardContent className="p-6 flex flex-col h-full">
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
                          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[hsl(75,64%,49%)] transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[hsl(75,64%,49%)]/10 text-[hsl(75,64%,39%)] rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center text-[hsl(75,64%,49%)] font-medium group-hover:text-[hsl(75,64%,39%)] transition-colors duration-300">
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Results Counter */}
          {!isLoading && filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-600">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}