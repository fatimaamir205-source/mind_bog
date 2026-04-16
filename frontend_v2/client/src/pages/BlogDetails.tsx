import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CommentSection } from '@/components/CommentSection';
import { BlogDetailSkeleton } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Heart, Share2, BookmarkPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI, commentAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export default function BlogDetails() {
  const [match, params] = useRoute('/blog/:id');
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const blogId = params?.id;

  useEffect(() => {
    if (!blogId) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [blogRes, commentsRes] = await Promise.all([
          blogAPI.getBlogById(blogId),
          commentAPI.getComments(blogId),
        ]);
        setBlog(blogRes.data);
        setComments(
          (commentsRes.data.comments || []).map((c: any) => ({
            id: String(c.id),
            author: {
              id: String(c.user_id),
              username: c.username || c.author_username || 'User',
              avatar: c.avatar_url || undefined,
            },
            content: c.content,
            likes: 0,
            isLiked: false,
            createdAt: c.created_at,
            canDelete: isAuthenticated && (String(c.user_id) === String(user?.id)),
          }))
        );
      } catch {
        toast.error('Failed to load blog');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [blogId]);

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12">
          <BlogDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  const tags = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string' && blog.tags
    ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : [];
  const wordCount = (blog.content || '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Please login to like'); return; }
    try {
      await blogAPI.toggleLike(blogId!);
      setBlog((prev: any) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes_count: prev.isLiked ? (prev.likes_count ?? 1) - 1 : (prev.likes_count ?? 0) + 1,
      }));
    } catch { toast.error('Failed to like blog'); }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to bookmark'); return; }
    try {
      await blogAPI.toggleBookmark(blogId!);
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch { toast.error('Failed to bookmark'); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleAddComment = async (content: string) => {
    if (!isAuthenticated) { toast.error('Please login to comment'); return; }
    try {
      const res = await commentAPI.createComment(blogId!, content);
      const c = res.data.comment;
      setComments((prev) => [{
        id: String(c.id),
        author: { id: String(c.user_id), username: user?.username || 'You', avatar: undefined },
        content: c.content,
        likes: 0,
        isLiked: false,
        createdAt: c.created_at,
        canDelete: true,
      }, ...prev]);
      toast.success('Comment posted!');
    } catch { toast.error('Failed to post comment'); }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) return;
    try {
      const res = await commentAPI.likeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: !c.isLiked, likes: res.data.likes_count ?? c.likes }
            : c
        )
      );
    } catch { /* ignore */ }
  };

  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const resolveImage = (path: string) =>
    path?.startsWith('http') ? path : path ? `http://localhost:5000${path}` : null;

  const coverImage = blog.image_url ? resolveImage(blog.image_url) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container pt-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <article className="container max-w-3xl py-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>

            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {(blog.author_username || blog.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{blog.author_username || blog.username || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate} · {readTime} min read
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cover image */}
          {coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <img src={coverImage} alt={blog.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <div className="whitespace-pre-wrap">{blog.content}</div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">#{tag}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-12 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <Button
                variant={blog.isLiked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className="w-4 h-4" fill={blog.isLiked ? 'currentColor' : 'none'} />
                <span>{blog.likes_count ?? 0}</span>
              </Button>
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                onClick={handleSave}
                className="gap-2"
              >
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onLikeComment={handleLikeComment}
            isAuthenticated={isAuthenticated}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
