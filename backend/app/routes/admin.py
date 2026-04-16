from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Blog, Comment, Like
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())  # Convert string to int
    
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    # Statistics
    total_users = User.query.count()
    total_blogs = Blog.query.count()
    total_comments = Comment.query.count()
    total_likes = Like.query.count()
    
    # Most active users (by blog count)
    active_users = db.session.query(
        User.username,
        func.count(Blog.id).label('blog_count')
    ).join(Blog).group_by(User.id).order_by(func.count(Blog.id).desc()).limit(5).all()
    
    # Most popular blogs (by likes)
    popular_blogs = db.session.query(
        Blog.title,
        Blog.id,
        func.count(Like.id).label('likes_count')
    ).outerjoin(Like).group_by(Blog.id).order_by(func.count(Like.id).desc()).limit(5).all()
    
    return jsonify({
        'total_users': total_users,
        'total_blogs': total_blogs,
        'total_comments': total_comments,
        'total_likes': total_likes,
        'most_active_users': [{'username': u[0], 'blog_count': u[1]} for u in active_users],
        'most_popular_blogs': [{'id': b[1], 'title': b[0], 'likes': b[2]} for b in popular_blogs]
    }), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = int(get_jwt_identity())  # Convert string to int
    
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@admin_bp.route('/users/<int:target_user_id>/toggle-active', methods=['PUT'])
@jwt_required()
def toggle_user_active(target_user_id):
    user_id = int(get_jwt_identity())  # Convert string to int
    
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    user = User.query.get(target_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.is_active = not user.is_active
    db.session.commit()
    
    return jsonify({
        'message': f'User {"activated" if user.is_active else "deactivated"}',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/blogs/<int:blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    user_id = int(get_jwt_identity())  # Convert string to int
    
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    blog = Blog.query.get(blog_id)
    
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    db.session.delete(blog)
    db.session.commit()
    
    return jsonify({'message': 'Blog deleted successfully'}), 200

@admin_bp.route('/blogs', methods=['GET'])
@jwt_required()
def get_all_blogs():
    user_id = int(get_jwt_identity())  # Convert string to int
    
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    blogs = Blog.query.order_by(Blog.created_at.desc()).all()
    
    return jsonify({
        'blogs': [blog.to_dict() for blog in blogs]
    }), 200
