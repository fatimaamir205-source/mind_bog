import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MapPin, Link as LinkIcon, FileText, Heart, Loader2 } from 'lucide-react';
import { userAPI, blogAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const resolveImage = (path?: string) =>
  !path ? null : path.startsWith('http') ? path : `http://localhost:5000${path}`;

export default function Profile() {
  const [match, params] = useRoute('/profile/:id');
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const userId = params?.id;

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    Promise.all([
      userAPI.getUserProfile(userId),
      userAPI.getUserBlogs(userId),
    ])
      .then(([profileRes, blogsRes]) => {
        setProfile(profileRes.data);
        setIsFollowing(profileRes.data.is_following || false);
        setBlogs(blogsRes.data.blogs || []);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const handleFollow = async () => {
    if (!isAuthenticated) { toast.error('Please login to follow'); return; }
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await userAPI.unfollowUser(userId!);
        setIsFollowing(false);
        setProfile((p: any) => ({ ...p, followers_count: p.followers_count - 1 }));
      } else {
        await userAPI.followUser(userId!);
        setIsFollowing(true);
        setProfile((p: any) => ({ ...p, followers_count: p.followers_count + 1 }));
      }
    } catch { toast.error('Failed to update follow'); }
    finally { setFollowLoading(false); }
  };

  const handleLikeBlog = async (blogId: string) => {
    try {
      await blogAPI.toggleLike(blogId);
      setBlogs((prev) =>
        prev.map((b) =>
          String(b.id) === blogId
            ? { ...b, isLiked: !b.isLiked, likes_count: b.isLiked ? b.likes_count - 1 : b.likes_count + 1 }
            : b
        )
      );
    } catch { /* not logged in */ }
  };

  const mapBlog = (b: any) => ({
    id: String(b.id),
    title: b.title,
    excerpt: b.content?.substring(0, 150) + '...' || '',
    author: {
      id: String(b.user_id),
      username: b.author?.username || profile.username,
      avatar: resolveImage(b.author?.avatar_url) || undefined,
    },
    date: b.created_at,
    likes: b.likes_count ?? 0,
    comments: b.comments_count ?? 0,
    tags: Array.isArray(b.tags) ? b.tags : (b.tags ? b.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
    isLiked: false,
    image_url: b.image_url || undefined,
  });

  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });

  const avatarUrl = resolveImage(profile.avatar_url);
  const isOwnProfile = currentUser && String(currentUser.id) === String(userId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border" />

        <div className="container -mt-16 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4 overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      profile.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  {profile.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-lg font-bold">{profile.followers_count ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{profile.following_count ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{profile.blogs_count ?? blogs.length}</p>
                    <p className="text-xs text-muted-foreground">Stories</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">Joined {joinedDate}</p>

                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? 'default' : 'outline'}
                    className="w-full"
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="stories" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stories" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Stories</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="gap-2">
                    <span>About</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stories" className="space-y-4 mt-6">
                  {blogs.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No stories yet</p>
                    </div>
                  ) : (
                    blogs.map((blog) => (
                      <BlogCard
                        key={blog.id}
                        {...mapBlog(blog)}
                        onLike={() => handleLikeBlog(String(blog.id))}
                      />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="font-bold mb-2">About</h3>
                      <p className="text-sm text-muted-foreground">{profile.bio || 'No bio yet.'}</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Stats</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Published blogs:</span>
                          <span className="font-medium">{profile.blogs_count ?? blogs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Followers:</span>
                          <span className="font-medium">{profile.followers_count ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Following:</span>
                          <span className="font-medium">{profile.following_count ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
