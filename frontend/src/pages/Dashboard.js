import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('my-blogs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'my-blogs') {
        const response = await blogsAPI.getMyBlogs();
        setMyBlogs(response.data.blogs);
      } else {
        const response = await blogsAPI.getBookmarks();
        setBookmarks(response.data.blogs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await blogsAPI.deleteBlog(id);
      loadData();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const blogs = activeTab === 'my-blogs' ? myBlogs : bookmarks;

  return (
    <div className="container">
      <div className="dashboard">
        <h2>My Dashboard</h2>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'my-blogs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('my-blogs')}
          >
            My Blogs ({myBlogs.length})
          </button>
          <button
            className={activeTab === 'bookmarks' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="no-results">
            {activeTab === 'my-blogs' ? (
              <>
                <p>You haven't created any blogs yet.</p>
                <Link to="/create" className="btn btn-primary">Create Your First Blog</Link>
              </>
            ) : (
              <p>No bookmarks yet.</p>
            )}
          </div>
        ) : (
          <div className="blog-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-item">
                <div className="blog-item-content">
                  <h3>
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h3>
                  <p>{blog.content.substring(0, 100)}...</p>
                  <div className="blog-item-meta">
                    <span className={`status ${blog.status}`}>{blog.status}</span>
                    <span>👁️ {blog.views}</span>
                    <span>❤️ {blog.likes_count}</span>
                    <span>💬 {blog.comments_count}</span>
                  </div>
                </div>
                {activeTab === 'my-blogs' && (
                  <div className="blog-item-actions">
                    <Link to={`/edit/${blog.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(blog.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
