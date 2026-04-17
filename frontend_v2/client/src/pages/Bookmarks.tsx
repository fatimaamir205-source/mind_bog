import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { BlogListSkeleton } from '@/components/Loader';
import { Bookmark } from 'lucide-react';
import { blogAPI } from '@/services/api';
import { toast } from 'sonner';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    blogAPI.getBookmarks()
      .then((res) => {
        setBookmarks(res.data.blogs || []);
      })
      .catch(() => toast.error('Failed to load bookmarks'))
      .finally(() => setIsLoading(false));
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
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === Number(blogId)
            ? { ...b, likes_count: b.isLiked ? b.likes_count - 1 : b.likes_count + 1, isLiked: !b.isLiked }
            : b
        )
      );
    } catch {}
  };

  const handleBookmarkToggle = async (blogId: string) => {
    try {
      await blogAPI.toggleBookmark(blogId);
      setBookmarks((prev) => prev.filter((b) => b.id !== Number(blogId)));
      toast.success('Bookmark removed');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Bookmarks</h1>
                <p className="text-muted-foreground mt-1">
                  {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </div>

            {isLoading ? (
              <BlogListSkeleton count={3} />
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground">
                  Start bookmarking articles to read them later
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookmarks.map(mapBlog).map((blog) => (
                  <BlogCard
                    key={blog.id}
                    {...blog}
                    onLike={() => handleLikeBlog(blog.id)}
                    onBookmark={() => handleBookmarkToggle(blog.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
