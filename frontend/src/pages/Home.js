import React, { useState, useEffect } from 'react';
import { blogsAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    loadBlogs();
  }, [search, sortBy]);

  const loadBlogs = async () => {
    try {
      const response = await blogsAPI.getBlogs({ search, sort_by: sortBy, status: 'published' });
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="home-header">
        <h1>Discover Amazing Blogs</h1>
        <p>Explore AI-powered content from our community</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="created_at">Latest</option>
          <option value="views">Most Viewed</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="no-results">No blogs found</div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
