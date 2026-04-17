import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'stats') {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        setUsers(response.data.users);
      } else if (activeTab === 'blogs') {
        const response = await adminAPI.getAllBlogs();
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await adminAPI.toggleUserActive(userId);
      loadData();
    } catch (error) {
      console.error('Error toggling user:', error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await adminAPI.deleteBlog(blogId);
      loadData();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="container">
      <div className="admin-dashboard">
        <h2>🛡️ Admin Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'stats' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={activeTab === 'users' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'blogs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('blogs')}
          >
            Blogs
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.total_users}</h3>
                  <p>Total Users</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.total_blogs}</h3>
                  <p>Total Blogs</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.total_comments}</h3>
                  <p>Total Comments</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.total_likes}</h3>
                  <p>Total Likes</p>
                </div>

                <div className="stat-section">
                  <h3>Most Active Users</h3>
                  <ul>
                    {stats.most_active_users.map((user, index) => (
                      <li key={index}>
                        {user.username} - {user.blog_count} blogs
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="stat-section">
                  <h3>Most Popular Blogs</h3>
                  <ul>
                    {stats.most_popular_blogs.map((blog, index) => (
                      <li key={index}>
                        {blog.title} - {blog.likes} likes
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleUser(user.id)}
                            className="btn btn-sm btn-secondary"
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td>{blog.id}</td>
                        <td>{blog.title}</td>
                        <td>{blog.author?.username}</td>
                        <td>{blog.status}</td>
                        <td>{blog.views}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
