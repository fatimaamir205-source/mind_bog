from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Blog, Comment, Like, Bookmark, Follow
from sqlalchemy import func, desc
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

@analytics_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_analytics():
    user_id = int(get_jwt_identity())

    blogs = Blog.query.filter_by(user_id=user_id).all()
    published = [b for b in blogs if b.status == 'published']

    total_views = sum(b.views for b in published)
    total_likes = sum(len(b.likes) for b in published)
    total_comments = sum(len(b.comments) for b in published)
    followers_count = Follow.query.filter_by(following_id=user_id).count()

    # Top 5 blogs by views
    top_blogs = sorted(published, key=lambda b: b.views, reverse=True)[:5]

    return jsonify({
        'total_blogs': len(blogs),
        'published_blogs': len(published),
        'draft_blogs': len(blogs) - len(published),
        'total_views': total_views,
        'total_likes': total_likes,
        'total_comments': total_comments,
        'followers_count': followers_count,
        'top_blogs': [{
            'id': b.id,
            'title': b.title,
            'views': b.views,
            'likes': len(b.likes),
            'comments': len(b.comments)
        } for b in top_blogs]
    }), 200

@analytics_bp.route('/blogs/<int:blog_id>', methods=['GET'])
@jwt_required()
def get_blog_analytics(blog_id):
    user_id = int(get_jwt_identity())
    blog = Blog.query.get(blog_id)

    if not blog:
        return jsonify({'error': 'Blog not found'}), 404

    if blog.user_id != user_id and not is_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    word_count = len(blog.content.split()) if blog.content else 0

    return jsonify({
        'id': blog.id,
        'title': blog.title,
        'views': blog.views,
        'likes': len(blog.likes),
        'comments': len(blog.comments),
        'bookmarks': len(blog.bookmarks),
        'word_count': word_count,
        'read_time': max(1, word_count // 200),
        'created_at': blog.created_at.isoformat(),
        'updated_at': blog.updated_at.isoformat()
    }), 200

@analytics_bp.route('/admin', methods=['GET'])
@jwt_required()
def get_admin_analytics():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    period = request.args.get('period', '30d')
    days = int(period.replace('d', '')) if period.endswith('d') else 30
    since = datetime.utcnow() - timedelta(days=days)

    # New users per day (last N days)
    new_users = db.session.query(
        func.date(User.created_at).label('date'),
        func.count(User.id).label('count')
    ).filter(User.created_at >= since)\
     .group_by(func.date(User.created_at))\
     .order_by('date').all()

    # New blogs per day
    new_blogs = db.session.query(
        func.date(Blog.created_at).label('date'),
        func.count(Blog.id).label('count')
    ).filter(Blog.created_at >= since)\
     .group_by(func.date(Blog.created_at))\
     .order_by('date').all()

    # New comments per day
    new_comments = db.session.query(
        func.date(Comment.created_at).label('date'),
        func.count(Comment.id).label('count')
    ).filter(Comment.created_at >= since)\
     .group_by(func.date(Comment.created_at))\
     .order_by('date').all()

    return jsonify({
        'period': period,
        'new_users': [{'date': str(r.date), 'count': r.count} for r in new_users],
        'new_blogs': [{'date': str(r.date), 'count': r.count} for r in new_blogs],
        'new_comments': [{'date': str(r.date), 'count': r.count} for r in new_comments],
        'totals': {
            'users': User.query.count(),
            'blogs': Blog.query.count(),
            'comments': Comment.query.count(),
            'likes': Like.query.count()
        }
    }), 200
