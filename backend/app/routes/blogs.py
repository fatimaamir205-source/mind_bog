from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Blog, Like, Bookmark
from sqlalchemy import or_, desc

blogs_bp = Blueprint('blogs', __name__)

@blogs_bp.route('', methods=['GET'])
def get_blogs():
    # Query parameters
    search = request.args.get('search', '')
    tags = request.args.get('tags', '')
    status = request.args.get('status', 'published')
    sort_by = request.args.get('sort_by', 'created_at')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    query = Blog.query
    
    # Filter by status
    if status:
        query = query.filter_by(status=status)
    
    # Search
    if search:
        query = query.filter(
            or_(
                Blog.title.contains(search),
                Blog.content.contains(search)
            )
        )
    
    # Filter by tags
    if tags:
        query = query.filter(Blog.tags.contains(tags))
    
    # Sort
    if sort_by == 'views':
        query = query.order_by(desc(Blog.views))
    elif sort_by == 'likes':
        query = query.outerjoin(Like).group_by(Blog.id).order_by(desc(db.func.count(Like.id)))
    else:
        query = query.order_by(desc(Blog.created_at))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'blogs': [blog.to_dict() for blog in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@blogs_bp.route('/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    blog = Blog.query.get(blog_id)
    
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    # Increment views
    blog.views += 1
    db.session.commit()
    
    blog_data = blog.to_dict()
    
    # Include AI analysis if exists
    if blog.ai_analysis:
        blog_data['ai_analysis'] = blog.ai_analysis.to_dict()
    
    return jsonify(blog_data), 200

@blogs_bp.route('', methods=['POST'])
@jwt_required()
def create_blog():
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        
        # Check if request has file upload
        if 'image' in request.files:
            from app.utils.file_upload import save_upload_file
            file = request.files['image']
            image_path = save_upload_file(file, folder='blogs')
            
            # Get other form data
            title = request.form.get('title')
            content = request.form.get('content')
            tags = request.form.get('tags', '')
            status = request.form.get('status', 'draft')
        else:
            # JSON request
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            title = data.get('title')
            content = data.get('content')
            image_path = data.get('image_url', '')
            tags = data.get('tags', '')
            status = data.get('status', 'draft')
        
        # Validate required fields
        if not title:
            return jsonify({'error': 'Title is required'}), 400
            
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        # Handle tags
        tags_value = ''
        if tags:
            if isinstance(tags, list):
                tags_value = ','.join(str(tag).strip() for tag in tags if tag)
            else:
                tags_value = str(tags)
        
        # Create blog
        blog = Blog(
            user_id=user_id,
            title=title,
            content=content,
            image_url=image_path or '',
            tags=tags_value,
            status=status
        )
        
        db.session.add(blog)
        db.session.commit()
        
        return jsonify({
            'message': 'Blog created successfully',
            'blog': blog.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating blog: {str(e)}")
        return jsonify({'error': f'Failed to create blog: {str(e)}'}), 500

@blogs_bp.route('/<int:blog_id>', methods=['PUT'])
@jwt_required()
def update_blog(blog_id):
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        blog = Blog.query.get(blog_id)
        
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404
        
        if blog.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Check if request has file upload
        if 'image' in request.files:
            from app.utils.file_upload import save_upload_file, delete_upload_file
            
            # Delete old image if exists
            if blog.image_url:
                delete_upload_file(blog.image_url)
            
            # Save new image
            file = request.files['image']
            image_path = save_upload_file(file, folder='blogs')
            if image_path:
                blog.image_url = image_path
            
            # Get other form data
            if request.form.get('title'):
                blog.title = request.form.get('title')
            if request.form.get('content'):
                blog.content = request.form.get('content')
            if request.form.get('tags'):
                blog.tags = request.form.get('tags')
            if request.form.get('status'):
                blog.status = request.form.get('status')
        else:
            # JSON request
            data = request.get_json()
            
            if 'title' in data:
                blog.title = data['title']
            if 'content' in data:
                blog.content = data['content']
            if 'image_url' in data:
                blog.image_url = data['image_url']
            if 'tags' in data:
                blog.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']
            if 'status' in data:
                blog.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Blog updated successfully',
            'blog': blog.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating blog: {str(e)}")
        return jsonify({'error': f'Failed to update blog: {str(e)}'}), 500

@blogs_bp.route('/<int:blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    try:
        user_id = int(get_jwt_identity())  # Convert string to int
        blog = Blog.query.get(blog_id)
        
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404
        
        if blog.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Delete associated image file
        if blog.image_url:
            from app.utils.file_upload import delete_upload_file
            delete_upload_file(blog.image_url)
        
        db.session.delete(blog)
        db.session.commit()
        
        return jsonify({'message': 'Blog deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting blog: {str(e)}")
        return jsonify({'error': f'Failed to delete blog: {str(e)}'}), 500

@blogs_bp.route('/<int:blog_id>/like', methods=['POST'])
@jwt_required()
def like_blog(blog_id):
    user_id = int(get_jwt_identity())  # Convert string to int
    blog = Blog.query.get(blog_id)
    
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    existing_like = Like.query.filter_by(user_id=user_id, blog_id=blog_id).first()
    
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Like removed'}), 200
    
    like = Like(user_id=user_id, blog_id=blog_id)
    db.session.add(like)
    db.session.commit()
    
    return jsonify({'message': 'Blog liked'}), 201

@blogs_bp.route('/<int:blog_id>/bookmark', methods=['POST'])
@jwt_required()
def bookmark_blog(blog_id):
    user_id = int(get_jwt_identity())  # Convert string to int
    blog = Blog.query.get(blog_id)
    
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    existing_bookmark = Bookmark.query.filter_by(user_id=user_id, blog_id=blog_id).first()
    
    if existing_bookmark:
        db.session.delete(existing_bookmark)
        db.session.commit()
        return jsonify({'message': 'Bookmark removed'}), 200
    
    bookmark = Bookmark(user_id=user_id, blog_id=blog_id)
    db.session.add(bookmark)
    db.session.commit()
    
    return jsonify({'message': 'Blog bookmarked'}), 201

@blogs_bp.route('/my-blogs', methods=['GET'])
@jwt_required()
def get_my_blogs():
    user_id = int(get_jwt_identity())  # Convert string to int
    blogs = Blog.query.filter_by(user_id=user_id).order_by(desc(Blog.created_at)).all()
    
    return jsonify({
        'blogs': [blog.to_dict() for blog in blogs]
    }), 200

@blogs_bp.route('/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    user_id = int(get_jwt_identity())  # Convert string to int
    bookmarks = Bookmark.query.filter_by(user_id=user_id).all()
    blogs = [bookmark.blog.to_dict() for bookmark in bookmarks]
    
    return jsonify({'blogs': blogs}), 200
