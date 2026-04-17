import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogsAPI, commentsAPI, aiAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
    loadComments();
    loadAnalysis();
  }, [id]);

  const loadBlog = async () => {
    try {
      const response = await blogsAPI.getBlog(id);
      setBlog(response.data);
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentsAPI.getComments(id);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadAnalysis = async () => {
    try {
      const response = await aiAPI.getBlogAnalysis(id);
      setAnalysis(response.data.analysis);
    } catch (error) {
      // Analysis might not exist
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await blogsAPI.likeBlog(id);
      loadBlog();
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await blogsAPI.bookmarkBlog(id);
      alert('Bookmark toggled!');
    } catch (error) {
      console.error('Error bookmarking blog:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await commentsAPI.createComment({ blog_id: id, content: newComment });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!blog) return <div className="error">Blog not found</div>;

  return (
    <div className="container">
      <article className="blog-detail">
        <h1>{blog.title}</h1>
        
        <div className="blog-meta">
          <span>By {blog.author?.username}</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>

        {blog.image_url && (
          <img 
            src={getImageUrl(blog.image_url)} 
            alt={blog.title} 
            className="blog-detail-image" 
          />
        )}

        <div className="blog-content">
          {blog.content}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="blog-actions">
          <button onClick={handleLike} className="btn btn-secondary">
            ❤️ Like ({blog.likes_count})
          </button>
          <button onClick={handleBookmark} className="btn btn-secondary">
            🔖 Bookmark
          </button>
          <span>👁️ {blog.views} views</span>
        </div>

        {analysis && (
          <div className="ai-analysis">
            <h3>🤖 AI Content Analysis</h3>
            <div className="analysis-scores">
              <div className="score-item">
                <span>Quality Score:</span>
                <strong>{analysis.quality_score}/100</strong>
              </div>
              <div className="score-item">
                <span>Readability:</span>
                <strong>{analysis.readability_score}/100</strong>
              </div>
            </div>
            <div className="analysis-feedback">
              <h4>Grammar Feedback:</h4>
              <p>{analysis.grammar_feedback}</p>
              <h4>SEO Suggestions:</h4>
              <p>{analysis.seo_feedback}</p>
            </div>
          </div>
        )}

        <div className="comments-section">
          <h3>💬 Comments ({comments.length})</h3>
          
          {user && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                required
              />
              <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.username}</strong>
                <p>{comment.content}</p>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
