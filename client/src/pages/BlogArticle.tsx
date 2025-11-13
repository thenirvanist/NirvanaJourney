import { useParams, Link } from "wouter";
import { Clock, Calendar, User, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { BlogPost } from "@shared/schema";
import { useBlogPost, useBlogPosts } from "@/hooks/useSupabaseQuery";

// Social sharing component
function SocialShare({ post, url }: { post: BlogPost; url: string }) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <Card className="bg-white shadow-lg border-0 sticky top-24">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="w-5 h-5 text-[hsl(75,64%,49%)]" />
          <h3 className="font-semibold text-gray-900">Share Article</h3>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => handleShare(twitterUrl)}
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
          >
            <Twitter className="w-4 h-4" />
            Share on Twitter
          </Button>
          
          <Button
            onClick={() => handleShare(facebookUrl)}
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-blue-50 hover:border-blue-800 hover:text-blue-800"
          >
            <Facebook className="w-4 h-4" />
            Share on Facebook
          </Button>
          
          <Button
            onClick={() => handleShare(linkedinUrl)}
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </Button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Help spread this wisdom to those who need it most
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogArticle() {
  const params = useParams();
  const slug = params.slug as string;
  const currentUrl = `${window.location.origin}/inner-nutrition/${slug}`;

  const { data: post, isLoading, error } = useBlogPost(slug);

  // Get related articles from the same category
  const { data: allPosts } = useBlogPosts();
  const relatedPosts = allPosts
    ?.filter((p: BlogPost) => p.id !== post?.id && (p.category === post?.category || 
      post?.tags?.some((tag: string) => p.tags?.includes(tag))))
    ?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24">
          <div className="max-w-4xl mx-auto px-6">
            {/* Hero skeleton */}
            <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse mb-8"></div>
            <div className="space-y-4 mb-8">
              <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link href="/inner-nutrition">
              <Button className="bg-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,59%)] text-white px-6 py-3 rounded-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Inner Nutrition
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Article Header */}
      <article className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <Link href="/inner-nutrition">
              <Button variant="ghost" className="hover:bg-gray-100 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Inner Nutrition
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Hero Image */}
              {(post.bannerImage || post.image) && (
                <div className="w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                  <img
                    src={post.bannerImage || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Meta */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[hsl(75,64%,49%)]/10 text-[hsl(75,64%,39%)] rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Excerpt */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[hsl(75,64%,49%)] mb-8">
                  <p className="text-lg text-gray-700 font-medium italic leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="prose prose-lg max-w-none">
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
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-[hsl(75,64%,49%)] pl-4 italic my-4 text-gray-600" {...props} />
                      ),
                      a: ({node, ...props}) => (
                        <a className="text-[hsl(75,64%,49%)] hover:underline" {...props} />
                      ),
                      strong: ({node, ...props}) => <strong className="text-gray-900 font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="text-gray-600" {...props} />,
                    }}
                  >
                    {post.content}
                  </Markdown>
                </div>
              </div>

              {/* Related Articles */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/inner-nutrition/${relatedPost.slug}`}>
                        <Card className="group bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 h-full">
                          <div className="relative overflow-hidden">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[hsl(75,64%,49%)] transition-colors duration-300 line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {relatedPost.excerpt}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SocialShare post={post} url={currentUrl} />
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}