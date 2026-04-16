import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { DataTable, Column, Action } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'banned';
  joinedDate: string;
  blogs: number;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then((res) => {
        const mapped: User[] = (res.data.users || []).map((u: any) => ({
          id: String(u.id),
          username: u.username,
          email: u.email,
          role: u.role,
          status: u.is_active ? 'active' : 'banned',
          joinedDate: u.created_at,
          blogs: u.blog_count ?? 0,
        }));
        setUsers(mapped);
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBanUser = async (user: User) => {
    try {
      await adminAPI.toggleUserActive(user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u
        )
      );
      toast.success(user.status === 'banned' ? `${user.username} has been unbanned` : `${user.username} has been banned`);
    } catch { toast.error('Failed to update user'); }
  };

  const handlePromoteAdmin = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await adminAPI.updateUserRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u)
      );
      toast.success(`${user.username} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`);
    } catch { toast.error('Failed to update role'); }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.username}?`)) {
      try {
        await adminAPI.deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success(`${user.username} has been deleted`);
      } catch { toast.error('Failed to delete user'); }
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'username',
      label: 'Username',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
      width: '30%',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            value === 'admin'
              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            value === 'active'
              ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      width: '15%',
    },
    {
      key: 'blogs',
      label: 'Blogs',
      render: (value) => <span>{value}</span>,
      width: '10%',
    },
    {
      key: 'joinedDate',
      label: 'Joined',
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

  const actions: Action<User>[] = [
    {
      label: 'Ban/Unban',
      onClick: handleBanUser,
    },
    {
      label: 'Toggle Admin',
      onClick: handlePromoteAdmin,
    },
    {
      label: 'Delete',
      onClick: handleDeleteUser,
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
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all platform users
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
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
              data={filteredUsers}
              actions={actions}
              loading={isLoading}
              pagination={{
                page: currentPage,
                total: filteredUsers.length,
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
