from flask import Blueprint, request, jsonify
from app.models import Blog, User
from sqlalchemy import or_

search_bp = Blueprint('search', __name__)

@search_bp.route('', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify({'blogs': [], 'users': []}), 200
    
    # Search blogs
    blogs = Blog.query.filter(
        Blog.status == 'published',
        or_(
            Blog.title.contains(query),
            Blog.content.contains(query),
            Blog.tags.contains(query)
        )
    ).limit(10).all()
    
    # Search users
    users = User.query.filter(
        User.is_active == True,
        or_(
            User.username.contains(query),
            User.email.contains(query)
        )
    ).limit(10).all()
    
    return jsonify({
        'blogs': [{
            'id': b.id,
            'title': b.title,
            'content': b.content[:150] + '...' if len(b.content) > 150 else b.content,
            'author_username': b.author.username,
            'image_url': b.image_url,
            'created_at': b.created_at.isoformat(),
        } for b in blogs],
        'users': [{
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'avatar_url': u.profile.avatar_url if u.profile else None,
        } for u in users]
    }), 200
