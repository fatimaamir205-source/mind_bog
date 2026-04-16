from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Comment, Blog, CommentLike

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('', methods=['POST'])
@jwt_required()
def create_comment():
    user_id = int(get_jwt_identity())  # Convert string to int
    data = request.get_json()
    
    if not data.get('blog_id') or not data.get('content'):
        return jsonify({'error': 'Blog ID and content are required'}), 400
    
    blog = Blog.query.get(data['blog_id'])
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    comment = Comment(
        user_id=user_id,
        blog_id=data['blog_id'],
        content=data['content']
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        'message': 'Comment created successfully',
        'comment': comment.to_dict()
    }), 201

@comments_bp.route('/blog/<int:blog_id>', methods=['GET'])
def get_comments(blog_id):
    comments = Comment.query.filter_by(blog_id=blog_id).order_by(Comment.created_at.desc()).all()
    
    return jsonify({
        'comments': [comment.to_dict() for comment in comments]
    }), 200

@comments_bp.route('/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    user_id = int(get_jwt_identity())
    comment = Comment.query.get(comment_id)
    
    if not comment:
        return jsonify({'error': 'Comment not found'}), 404
    
    if comment.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment deleted successfully'}), 200

@comments_bp.route('/<int:comment_id>/like', methods=['POST'])
@jwt_required()
def toggle_comment_like(comment_id):
    user_id = int(get_jwt_identity())
    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({'error': 'Comment not found'}), 404

    existing = CommentLike.query.filter_by(user_id=user_id, comment_id=comment_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'message': 'Like removed', 'likes_count': len(comment.likes) - 1}), 200

    like = CommentLike(user_id=user_id, comment_id=comment_id)
    db.session.add(like)
    db.session.commit()
    return jsonify({'message': 'Comment liked', 'likes_count': len(comment.likes)}), 201
