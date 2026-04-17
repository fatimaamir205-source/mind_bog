import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatsCard } from '@/components/StatsCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { adminAPI } from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 520 },
    { month: 'Mar', users: 680 },
    { month: 'Apr', users: 890 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1450 },
  ];

  const blogActivityData = [
    { week: 'Week 1', blogs: 45, comments: 120 },
    { week: 'Week 2', blogs: 52, comments: 145 },
    { week: 'Week 3', blogs: 48, comments: 138 },
    { week: 'Week 4', blogs: 61, comments: 165 },
  ];
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and key metrics
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Users"
              value={stats ? String(stats.total_users) : '...'}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              description="Active users"
            />
            <StatsCard
              title="Total Blogs"
              value={stats ? String(stats.total_blogs) : '...'}
              icon={FileText}
              trend={{ value: 8, isPositive: true }}
              description="Published blogs"
            />
            <StatsCard
              title="Total Comments"
              value={stats ? String(stats.total_comments) : '...'}
              icon={MessageCircle}
              trend={{ value: 5, isPositive: true }}
              description="Community engagement"
            />
            <StatsCard
              title="Total Likes"
              value={stats ? String(stats.total_likes) : '...'}
              icon={TrendingUp}
              trend={{ value: 3, isPositive: true }}
              description="All time likes"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User growth */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Blog activity */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Blog Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blogActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="blogs" fill="var(--primary)" />
                  <Bar dataKey="comments" fill="var(--secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent users */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Recent Users</h3>
              <div className="space-y-3">
                {[
                  { username: 'john_doe', email: 'john@example.com', joined: '2 hours ago' },
                  { username: 'jane_smith', email: 'jane@example.com', joined: '5 hours ago' },
                  { username: 'alex_tech', email: 'alex@example.com', joined: '1 day ago' },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-muted rounded">
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.joined}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent blogs */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Recent Blogs</h3>
              <div className="space-y-3">
                {[
                  { title: 'Getting Started with AI', author: 'alex_tech', status: 'published' },
                  { title: 'Web Development Trends', author: 'jane_smith', status: 'published' },
                  { title: 'Machine Learning Basics', author: 'john_doe', status: 'pending' },
                ].map((blog, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-muted rounded">
                    <div>
                      <p className="font-medium text-sm truncate">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">by {blog.author}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        blog.status === 'published'
                          ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
