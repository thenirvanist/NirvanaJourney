import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Book, Mountain, Compass, User, Quote } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Sage, Ashram, BlogPost, Journey, DailyWisdom } from "@shared/schema";
import Navigation from "@/components/Navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface Bookmark {
  id: number;
  user_id: string;
  content_type: string;
  content_id: number;
  created_at: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading, session } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated (after loading is complete)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Fetch bookmarks directly from Supabase
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery<Bookmark[]>({
    queryKey: ["supabase", "bookmarks", user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return [];
      
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id && !!session && !!supabase,
    retry: false,
  });

  // Fetch content directly from Supabase
  const { data: sages = [] } = useQuery<Sage[]>({
    queryKey: ["supabase", "sages"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("sages").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && bookmarks.length > 0 && !!supabase,
  });

  const { data: ashrams = [] } = useQuery<Ashram[]>({
    queryKey: ["supabase", "ashrams"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("ashrams").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && bookmarks.length > 0 && !!supabase,
  });

  const { data: blogs = [] } = useQuery<BlogPost[]>({
    queryKey: ["supabase", "blog_posts"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("blog_posts").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && bookmarks.length > 0 && !!supabase,
  });

  const { data: journeys = [] } = useQuery<Journey[]>({
    queryKey: ["supabase", "journeys"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("journeys").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && bookmarks.length > 0 && !!supabase,
  });

  const { data: quotes = [] } = useQuery<DailyWisdom[]>({
    queryKey: ["supabase", "daily_wisdom"],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from("daily_wisdom").select("*");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && bookmarks.length > 0 && !!supabase,
  });

  if (authLoading || bookmarksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <Navigation />
        <div className="flex items-center justify-center pt-24 min-h-[calc(100vh-6rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">{t("pages.dashboard.loginRequired")}</h2>
              <p className="text-gray-600 mb-4">
                {t("pages.dashboard.loginMessage")}
              </p>
              <Link href="/login">
                <Button className="w-full" data-testid="button-login">
                  {t("pages.dashboard.loginButton")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get bookmarked content by type
  const getBookmarkedContent = (contentType: string, contentList: any[]) => {
    const bookmarkedIds = bookmarks
      .filter((bookmark: Bookmark) => bookmark.content_type === contentType)
      .map((bookmark: Bookmark) => bookmark.content_id);
    
    return contentList.filter((item: any) => bookmarkedIds.includes(item.id));
  };

  const bookmarkedSages = getBookmarkedContent("sage", sages);
  const bookmarkedAshrams = getBookmarkedContent("ashram", ashrams);
  const bookmarkedBlogs = getBookmarkedContent("blog", blogs);
  const bookmarkedJourneys = getBookmarkedContent("journey", journeys);
  const bookmarkedQuotes = getBookmarkedContent("quote", quotes);

  const totalBookmarks = bookmarks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-welcome">
              Welcome, {user.firstName || user.email}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your Personal Spiritual Collection
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg text-amber-700">
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
              <span className="font-semibold" data-testid="text-bookmark-count">
                {totalBookmarks} {totalBookmarks === 1 ? 'item' : 'items'} bookmarked
              </span>
            </div>
          </div>

          {/* Empty State */}
          {totalBookmarks === 0 && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">Start Your Collection</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your personal dashboard is ready! Start exploring and bookmarking spiritual content 
                  that resonates with you. Look for the heart icon on any sage, ashram, blog post, 
                  journey, or daily quote to save it here.
                </p>
                <div className="space-y-3">
                  <Link href="/sages">
                    <Button variant="outline" className="w-full sm:w-auto mr-0 sm:mr-3 mb-3 sm:mb-0" data-testid="button-explore-sages">
                      <Book className="h-4 w-4 mr-2" />
                      Explore Sages
                    </Button>
                  </Link>
                  <Link href="/ashrams">
                    <Button variant="outline" className="w-full sm:w-auto mr-0 sm:mr-3 mb-3 sm:mb-0" data-testid="button-explore-ashrams">
                      <Mountain className="h-4 w-4 mr-2" />
                      Visit Ashrams
                    </Button>
                  </Link>
                  <Link href="/inner-nutrition">
                    <Button variant="outline" className="w-full sm:w-auto" data-testid="button-explore-articles">
                      <Compass className="h-4 w-4 mr-2" />
                      Read Articles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookmarked Content Sections */}
          {totalBookmarks > 0 && (
            <div className="space-y-12">
              {/* Bookmarked Sages */}
              {bookmarkedSages.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Book className="h-6 w-6 mr-2 text-amber-600" />
                      Bookmarked Sages ({bookmarkedSages.length})
                    </h2>
                    <Link href="/sages">
                      <Button variant="outline" size="sm">
                        View All Sages
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedSages.map((sage) => (
                      <Link key={sage.id} href={`/sages/${sage.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" data-testid={`card-sage-${sage.id}`}>
                          <div className="relative overflow-hidden">
                            <img
                              src={sage.image || "/api/placeholder/400/250"}
                              alt={sage.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{sage.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{sage.location}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{sage.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Ashrams */}
              {bookmarkedAshrams.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Mountain className="h-6 w-6 mr-2 text-green-600" />
                      Bookmarked Ashrams ({bookmarkedAshrams.length})
                    </h2>
                    <Link href="/ashrams">
                      <Button variant="outline" size="sm">
                        View All Ashrams
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedAshrams.map((ashram) => (
                      <Link key={ashram.id} href={`/ashrams/${ashram.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" data-testid={`card-ashram-${ashram.id}`}>
                          <div className="relative overflow-hidden">
                            <img
                              src={ashram.image || "/api/placeholder/400/250"}
                              alt={ashram.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{ashram.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{ashram.location}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{ashram.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Blog Posts */}
              {bookmarkedBlogs.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-blue-600" />
                      Bookmarked Articles ({bookmarkedBlogs.length})
                    </h2>
                    <Link href="/inner-nutrition">
                      <Button variant="outline" size="sm">
                        View All Articles
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedBlogs.map((blog) => (
                      <Link key={blog.id} href={`/inner-nutrition/${blog.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" data-testid={`card-blog-${blog.id}`}>
                          <div className="relative overflow-hidden">
                            <img
                              src={blog.image || "/api/placeholder/400/250"}
                              alt={blog.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{blog.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{blog.author}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{blog.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Sacred Journeys */}
              {bookmarkedJourneys.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-purple-600" />
                      Bookmarked Journeys ({bookmarkedJourneys.length})
                    </h2>
                    <Link href="/sacred-journeys">
                      <Button variant="outline" size="sm">
                        View All Journeys
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedJourneys.map((journey) => (
                      <Link key={journey.id} href={`/sacred-journeys/${journey.id}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" data-testid={`card-journey-${journey.id}`}>
                          <div className="relative overflow-hidden">
                            <img
                              src={journey.image || "/api/placeholder/400/250"}
                              alt={journey.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{journey.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">{journey.location}</p>
                            <p className="text-sm text-gray-600 mb-2">{journey.duration} • {journey.price}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{journey.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Bookmarked Quotes */}
              {bookmarkedQuotes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Quote className="h-6 w-6 mr-2 text-orange-600" />
                      Bookmarked Quotes ({bookmarkedQuotes.length})
                    </h2>
                    <Link href="/daily-quotes">
                      <Button variant="outline" size="sm">
                        View All Quotes
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {bookmarkedQuotes.map((quote: DailyWisdom) => (
                      <Card key={quote.id} className="group hover:shadow-lg hover:scale-105 transition-all duration-300" data-testid={`card-quote-${quote.id}`}>
                        <div className="relative overflow-hidden">
                          <img
                            src={quote.image_url || "/api/placeholder/400/400"}
                            alt={`Quote by ${quote.author}`}
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <p className="font-semibold text-gray-900 text-center">{quote.author}</p>
                          {quote.display_date && (
                            <p className="text-xs text-gray-500 text-center mt-1">
                              {new Date(quote.display_date + 'T00:00:00Z').toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
