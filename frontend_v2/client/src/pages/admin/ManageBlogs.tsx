import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { DataTable, Column, Action } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

interface Blog {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'pending' | 'rejected';
  views: number;
  createdAt: string;
}

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getBlogs()
      .then((res) => {
        const mapped: Blog[] = (res.data.blogs || []).map((b: any) => ({
          id: String(b.id),
          title: b.title,
          author: b.author_username || b.username || 'Unknown',
          status: b.status === 'published' ? 'published' : 'pending',
          views: b.views ?? 0,
          createdAt: b.created_at,
        }));
        setBlogs(mapped);
      })
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (blog: Blog) => {
    try {
      await adminAPI.approveBlog(blog.id);
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? { ...b, status: 'published' } : b));
      toast.success(`"${blog.title}" has been approved`);
    } catch { toast.error('Failed to approve blog'); }
  };

  const handleReject = async (blog: Blog) => {
    try {
      await adminAPI.rejectBlog(blog.id);
      setBlogs((prev) => prev.map((b) => b.id === blog.id ? { ...b, status: 'rejected' } : b));
      toast.success(`"${blog.title}" has been rejected`);
    } catch { toast.error('Failed to reject blog'); }
  };

  const handleDelete = async (blog: Blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await adminAPI.deleteBlogAsAdmin(blog.id);
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
        toast.success(`"${blog.title}" has been deleted`);
      } catch { toast.error('Failed to delete blog'); }
    }
  };

  const columns: Column<Blog>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (value, row) => (
        <div>
          <p className="font-medium truncate">{value}</p>
          <p className="text-xs text-muted-foreground">by {row.author}</p>
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
              : value === 'pending'
              ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
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
      render: (value) => <span>{value.toLocaleString()}</span>,
      width: '12%',
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
      width: '15%',
    },
  ];

  const actions: Action<Blog>[] = [
    {
      label: 'Approve',
      onClick: handleApprove,
    },
    {
      label: 'Reject',
      onClick: handleReject,
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      variant: 'destructive',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Manage Blogs</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage all platform blogs
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg p-6">
            <DataTable
              columns={columns}
              data={filteredBlogs}
              actions={actions}
              loading={isLoading}
              pagination={{
                page: currentPage,
                total: filteredBlogs.length,
                pageSize: 10,
                onPageChange: setCurrentPage,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
