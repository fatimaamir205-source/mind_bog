import React, { useState, useEffect } from 'react';
import { blogsAPI, trendingAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [activeTab, setActiveTab] = useState('recent'); // 'recent' or 'trending'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  useEffect(() => {
    if (activeTab === 'recent') {
      loadBlogs();
    } else {
      loadTrendingBlogs();
    }
  }, [search, sortBy, activeTab, currentPage]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogs({ 
        search, 
        sort_by: sortBy, 
        status: 'published',
        page: currentPage,
        per_page: perPage
      });
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingBlogs = async () => {
    try {
      setLoading(true);
      const response = await trendingAPI.getTrendingBlogs({
        page: currentPage,
        per_page: perPage
      });
      setTrendingBlogs(response.data.blogs);
      setTotalPages(response.data.pages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error loading trending blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayBlogs = activeTab === 'recent' ? blogs : trendingBlogs;

  return (
    <div className="container">
      <div className="home-header">
        <h1>Discover Amazing Blogs</h1>
        <p>Explore AI-powered content from our community</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTabChange('recent')}
        >
          Recent Blogs
        </button>
        <button 
          className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => handleTabChange('trending')}
        >
          Trending Blogs
        </button>
      </div>

      {activeTab === 'recent' && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="search-input"
          />
          
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} className="sort-select">
            <option value="created_at">Latest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading blogs...</div>
      ) : displayBlogs.length === 0 ? (
        <div className="no-results">No blogs found</div>
      ) : (
        <>
          <div className="blog-grid">
            {displayBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages} ({total} total blogs)
              </div>
              
              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
