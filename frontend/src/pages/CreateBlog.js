import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogsAPI, aiAPI, uploadAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateBlog = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (id) {
      loadBlog();
    }
  }, [id, user]);

  const loadBlog = async () => {
    try {
      const response = await blogsAPI.getBlog(id);
      const blog = response.data;
      setTitle(blog.title);
      setContent(blog.content);
      setImageUrl(blog.image_url || '');
      setImagePreview(blog.image_url ? `http://localhost:5000${blog.image_url}` : '');
      setTags(blog.tags.join(', '));
      setStatus(blog.status);
    } catch (error) {
      console.error('Error loading blog:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(imageFile, 'blogs');
      setImageUrl(response.data.file_path);
      alert('Image uploaded successfully!');
      return response.data.file_path;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!title || !content) {
      alert('Please enter title and content first');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await aiAPI.analyzeContent({ title, content });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing content:', error);
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;
      
      // If user selected a file, upload it first
      if (imageFile) {
        try {
          setUploading(true);
          const uploadResponse = await uploadAPI.uploadImage(imageFile, 'blogs');
          finalImageUrl = uploadResponse.data.file_path;
          console.log('Image uploaded:', finalImageUrl);
          setUploading(false);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setUploading(false);
          alert('Image upload failed. Continue without image?');
          // Continue without image
        }
      }

      const blogData = {
        title,
        content,
        image_url: finalImageUrl || '',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        status
      };

      let response;
      if (id) {
        response = await blogsAPI.updateBlog(id, blogData);
      } else {
        response = await blogsAPI.createBlog(blogData);
      }

      const blogId = response.data.blog.id;

      // Save AI analysis if available
      if (analysis) {
        try {
          await aiAPI.analyzeContent({ ...blogData, blog_id: blogId });
        } catch (aiError) {
          console.error('AI analysis save failed:', aiError);
        }
      }

      alert(id ? 'Blog updated successfully!' : 'Blog created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save blog';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="create-blog">
        <h2>{id ? 'Edit Blog' : 'Create New Blog'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter blog title"
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="15"
              placeholder="Write your blog content..."
            />
          </div>

          <div className="form-group">
            <label>Upload Image from Device</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="btn btn-sm btn-danger"
                  style={{marginTop: '0.5rem'}}
                >
                  Remove Image
                </button>
              </div>
            )}
            {uploading && <p style={{color: '#4f46e5'}}>Uploading image...</p>}
          </div>

          <div className="form-group">
            <label>Or paste Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={imageFile !== null}
            />
            <small style={{color: '#6b7280'}}>Upload a file above OR paste a URL here</small>
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="python, tutorial, web-development"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleAnalyze} className="btn btn-secondary" disabled={analyzing}>
              {analyzing ? 'Analyzing...' : '🤖 Analyze with AI'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (id ? 'Update Blog' : 'Create Blog')}
            </button>
          </div>
        </form>

        {analysis && (
          <div className="ai-analysis">
            <h3>🤖 AI Analysis Results</h3>
            <div className="analysis-scores">
              <div className="score-item">
                <span>Quality Score:</span>
                <strong className={analysis.quality_score >= 70 ? 'good' : 'warning'}>
                  {analysis.quality_score}/100
                </strong>
              </div>
              <div className="score-item">
                <span>Readability:</span>
                <strong className={analysis.readability_score >= 70 ? 'good' : 'warning'}>
                  {analysis.readability_score}/100
                </strong>
              </div>
            </div>
            <div className="analysis-feedback">
              <h4>📝 Grammar Feedback:</h4>
              <p>{analysis.grammar_feedback}</p>
              <h4>🔍 SEO Suggestions:</h4>
              <p>{analysis.seo_feedback}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
