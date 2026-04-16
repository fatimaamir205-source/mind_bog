import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, Column, Action } from '@/components/DataTable';
import { BarChart3, FileText, Eye, Heart, MessageCircle, PenTool, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { blogAPI } from '@/services/api';

interface Blog {
  id: string;
  title: string;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    blogAPI.getMyBlogs()
      .then((res) => {
        const mapped: Blog[] = (res.data.blogs || []).map((b: any) => ({
          id: String(b.id),
          title: b.title,
          status: b.status === 'published' ? 'published' : 'draft',
          views: b.views ?? 0,
          likes: b.likes_count ?? 0,
          comments: b.comments_count ?? 0,
          createdAt: b.created_at,
        }));
        setBlogs(mapped);
      })
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBlogs =
    activeTab === 'all' ? blogs : blogs.filter((blog) => blog.status === activeTab);

  const handleDelete = async (blog: Blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await blogAPI.deleteBlog(blog.id);
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
        toast.success('Blog deleted successfully');
      } catch { toast.error('Failed to delete blog'); }
    }
  };

  const handlePublish = async (blog: Blog) => {
    if (blog.status === 'draft') {
      try {
        await blogAPI.updateBlog(blog.id, { status: 'published' });
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, status: 'published' } : b))
        );
        toast.success('Blog published successfully');
      } catch { toast.error('Failed to publish blog'); }
    }
  };

  const columns: Column<Blog>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (value, row) => (
        <div>
          <p className="font-medium truncate">{value}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
      width: '40%',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            value === 'published'
              ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
              : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'views',
      label: 'Views',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span>{value.toLocaleString()}</span>
        </div>
      ),
      width: '12%',
    },
    {
      key: 'likes',
      label: 'Likes',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-muted-foreground" />
          <span>{value.toLocaleString()}</span>
        </div>
      ),
      width: '12%',
    },
    {
      key: 'comments',
      label: 'Comments',
      render: (value) => (
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <span>{value.toLocaleString()}</span>
        </div>
      ),
      width: '12%',
    },
  ];

  const actions: Action<Blog>[] = [
    {
      label: 'Edit',
      onClick: (blog) => {
        navigate(`/edit/${blog.id}`);
      },
    },
    {
      label: 'Publish',
      onClick: handlePublish,
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'destructive',
    },
  ];

  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  const totalComments = blogs.reduce((sum, blog) => sum + blog.comments, 0);
  const publishedCount = blogs.filter((b) => b.status === 'published').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your blogs and track your performance
              </p>
            </div>
            <Link href="/create">
              <Button className="gap-2">
                <PenTool className="w-4 h-4" />
                Write New
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold mt-1">{publishedCount}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold mt-1">{totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                  <p className="text-3xl font-bold mt-1">{totalLikes.toLocaleString()}</p>
                </div>
                <Heart className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
                  <p className="text-3xl font-bold mt-1">{totalComments.toLocaleString()}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-primary opacity-50" />
              </div>
            </div>
          </div>

          {/* Blogs table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All ({blogs.length})
                </TabsTrigger>
                <TabsTrigger value="published">
                  Published ({blogs.filter((b) => b.status === 'published').length})
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Drafts ({blogs.filter((b) => b.status === 'draft').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <DataTable
                  columns={columns}
                  data={filteredBlogs}
                  actions={actions}
                  loading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
