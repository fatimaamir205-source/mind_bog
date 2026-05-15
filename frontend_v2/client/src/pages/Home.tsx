import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { BlogListSkeleton } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, TrendingUp, Users, Search } from 'lucide-react';
import { blogAPI, trendingAPI } from '@/services/api';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [recommendedAuthors, setRecommendedAuthors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [recentRes, trendingData] = await Promise.all([
          blogAPI.getBlogs({ sort_by: 'created_at' }),
          trendingAPI.getAllTrending(),
        ]);
        setBlogs(recentRes.data.blogs || []);
        setTrendingBlogs(trendingData.data.blogs || []);
        setTrendingTopics(trendingData.data.topics || []);
        setRecommendedAuthors(trendingData.data.authors || []);
      } catch {
        setBlogs([]);
        setTrendingBlogs([]);
        setTrendingTopics([]);
        setRecommendedAuthors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapBlog = (blog: any) => ({
    id: String(blog.id),
    title: blog.title,
    excerpt: blog.content?.substring(0, 150) + '...' || '',
    author: {
      id: String(blog.author?.id || blog.user_id),
      username: blog.author?.username || blog.author_username || blog.username || 'Unknown',
      avatar: blog.author?.avatar_url || blog.author_avatar || undefined,
    },
    date: blog.created_at,
    likes: blog.likes_count ?? 0,
    comments: blog.comments_count ?? 0,
    tags: Array.isArray(blog.tags)
      ? blog.tags
      : typeof blog.tags === 'string' && blog.tags
      ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [],
    isLiked: false,
    image_url: blog.image_url || undefined,
  });

  const handleLikeBlog = async (blogId: string) => {
    try {
      await blogAPI.toggleLike(blogId);
      const update = (list: any[]) =>
        list.map((b) =>
          b.id === blogId
            ? { ...b, isLiked: !b.isLiked, likes: b.isLiked ? b.likes - 1 : b.likes + 1 }
            : b
        );
      setBlogs(update);
      setTrendingBlogs(update);
    } catch {
      // not logged in — ignore
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />

      <main className="flex-1 md:ml-20 pt-16 md:pt-0">
        {/* Search Bar */}
        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="container py-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 h-12 text-base"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
          <div className="container py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {t('home.heroDescription')}
              </p>
              {isAuthenticated ? (
                <Link href="/create">
                  <Button size="lg" className="gap-2">{t('home.startWriting')}</Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="gap-2">{t('home.getStarted')}</Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Blog feed - Masonry Grid */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="recent" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('home.recent')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="gap-2">
                    <Flame className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('home.trending')}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent">
                  {isLoading ? (
                    <BlogListSkeleton count={3} />
                  ) : blogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">{t('home.noBlogs')}</p>
                  ) : (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
                      {blogs.map(mapBlog).map((blog) => (
                        <div key={blog.id} className="break-inside-avoid mb-4">
                          <BlogCard
                            {...blog}
                            onLike={() => handleLikeBlog(blog.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trending">
                  {isLoading ? (
                    <BlogListSkeleton count={3} />
                  ) : trendingBlogs.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">{t('home.noTrending')}</p>
                  ) : (
                    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
                      {trendingBlogs.map(mapBlog).map((blog) => (
                        <div key={blog.id} className="break-inside-avoid mb-4">
                          <BlogCard
                            {...blog}
                            onLike={() => handleLikeBlog(blog.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - 35% */}
            <div className="space-y-6">
              {/* Trending topics */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  {t('home.trendingTopics')}
                </h3>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : trendingTopics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No trending topics yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic) => (
                      <button
                        key={topic.tag}
                        className="px-3 py-1 bg-muted hover:bg-primary hover:text-primary-foreground text-xs rounded-full transition-colors"
                        title={`${topic.count} blogs`}
                      >
                        {topic.tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended authors */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  {t('home.recommendedAuthors')}
                </h3>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recommendedAuthors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No authors to recommend yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recommendedAuthors.map((author) => (
                      <Link key={author.id} href={`/profile/${author.id}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {author.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{author.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {author.blog_count} {t('home.blogs')} · {author.followers_count} {t('home.followers')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
