from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models import User, Profile, Blog, Follow, Like
from sqlalchemy import desc, func

users_bp = Blueprint('users', __name__)

def _get_optional_user_id():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None

@users_bp.route('/<int:target_id>', methods=['GET'])
def get_user_profile(target_id):
    user = User.query.get(target_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    profile = Profile.query.filter_by(user_id=target_id).first()
    current_user_id = _get_optional_user_id()

    is_following = False
    if current_user_id:
        is_following = Follow.query.filter_by(
            follower_id=current_user_id, following_id=target_id
        ).first() is not None

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'bio': profile.bio if profile else None,
        'avatar_url': profile.avatar_url if profile else None,
        'followers_count': len(user.followers),
        'following_count': len(user.following),
        'blogs_count': Blog.query.filter_by(user_id=target_id, status='published').count(),
        'is_following': is_following,
        'created_at': user.created_at.isoformat()
    }), 200

@users_bp.route('/<int:target_id>/blogs', methods=['GET'])
def get_user_blogs(target_id):
    user = User.query.get(target_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    blogs = Blog.query.filter_by(user_id=target_id, status='published')\
        .order_by(desc(Blog.created_at)).all()

    return jsonify({'blogs': [b.to_dict() for b in blogs]}), 200

@users_bp.route('/<int:target_id>/follow', methods=['POST'])
@jwt_required()
def follow_user(target_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id == target_id:
        return jsonify({'error': 'Cannot follow yourself'}), 400

    if not User.query.get(target_id):
        return jsonify({'error': 'User not found'}), 404

    existing = Follow.query.filter_by(follower_id=current_user_id, following_id=target_id).first()
    if existing:
        return jsonify({'message': 'Already following'}), 200

    follow = Follow(follower_id=current_user_id, following_id=target_id)
    db.session.add(follow)
    db.session.commit()
    return jsonify({'message': 'Followed successfully'}), 201

@users_bp.route('/<int:target_id>/follow', methods=['DELETE'])
@jwt_required()
def unfollow_user(target_id):
    current_user_id = int(get_jwt_identity())

    follow = Follow.query.filter_by(follower_id=current_user_id, following_id=target_id).first()
    if not follow:
        return jsonify({'error': 'Not following this user'}), 404

    db.session.delete(follow)
    db.session.commit()
    return jsonify({'message': 'Unfollowed successfully'}), 200

@users_bp.route('/following/blogs', methods=['GET'])
@jwt_required()
def get_following_blogs():
    current_user_id = int(get_jwt_identity())
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    following_ids = [f.following_id for f in Follow.query.filter_by(follower_id=current_user_id).all()]

    if not following_ids:
        return jsonify({'blogs': [], 'total': 0, 'pages': 0, 'current_page': page}), 200

    pagination = Blog.query.filter(
        Blog.user_id.in_(following_ids),
        Blog.status == 'published'
    ).order_by(desc(Blog.created_at)).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'blogs': [b.to_dict() for b in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

@users_bp.route('/trending', methods=['GET'])
def get_trending_authors():
    # Top 10 authors by total likes on their published blogs
    results = db.session.query(
        User.id,
        User.username,
        Profile.avatar_url,
        func.count(Like.id).label('total_likes'),
        func.count(func.distinct(Blog.id)).label('blog_count')
    ).join(Blog, Blog.user_id == User.id)\
     .outerjoin(Like, Like.blog_id == Blog.id)\
     .outerjoin(Profile, Profile.user_id == User.id)\
     .filter(Blog.status == 'published')\
     .group_by(User.id, User.username, Profile.avatar_url)\
     .order_by(desc('total_likes'))\
     .limit(10).all()

    return jsonify({
        'authors': [{
            'id': r.id,
            'username': r.username,
            'avatar_url': r.avatar_url,
            'total_likes': r.total_likes,
            'blog_count': r.blog_count
        } for r in results]
    }), 200
