import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-card">
      {blog.image_url && (
        <img 
          src={getImageUrl(blog.image_url)} 
          alt={blog.title} 
          className="blog-card-image" 
        />
      )}
      <div className="blog-card-content">
        <h3 className="blog-card-title">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </h3>
        <p className="blog-card-excerpt">
          {blog.content.substring(0, 150)}...
        </p>
        <div className="blog-card-meta">
          <span className="blog-author">By {blog.author?.username}</span>
          <span className="blog-date">{formatDate(blog.created_at)}</span>
        </div>
        <div className="blog-card-stats">
          <span>👁️ {blog.views}</span>
          <span>❤️ {blog.likes_count}</span>
          <span>💬 {blog.comments_count}</span>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
