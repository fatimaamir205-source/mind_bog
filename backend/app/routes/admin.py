from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Blog, Comment, Like, Report, PlatformSetting
from sqlalchemy import func
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

def require_admin():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return None, jsonify({'error': 'Admin access required'}), 403
    return user_id, None, None

# ── Stats ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    total_users = User.query.count()
    total_blogs = Blog.query.count()
    total_comments = Comment.query.count()
    total_likes = Like.query.count()

    active_users = db.session.query(
        User.username,
        func.count(Blog.id).label('blog_count')
    ).join(Blog).group_by(User.id).order_by(func.count(Blog.id).desc()).limit(5).all()

    popular_blogs = db.session.query(
        Blog.title, Blog.id,
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

# ── Users ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    search = request.args.get('search', '')
    query = User.query
    if search:
        query = query.filter(
            (User.username.contains(search)) | (User.email.contains(search))
        )
    users = query.order_by(User.created_at.desc()).all()
    return jsonify({'users': [u.to_dict() for u in users]}), 200

@admin_bp.route('/users/<int:target_id>/toggle-active', methods=['PUT'])
@jwt_required()
def toggle_user_active(target_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    user = User.query.get(target_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({
        'message': f'User {"activated" if user.is_active else "deactivated"}',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/users/<int:target_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(target_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    user = User.query.get(target_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    role = data.get('role')
    if role not in ('user', 'admin'):
        return jsonify({'error': 'Role must be "user" or "admin"'}), 400

    user.role = role
    db.session.commit()
    return jsonify({'message': f'Role updated to {role}', 'user': user.to_dict()}), 200

@admin_bp.route('/users/<int:target_id>', methods=['DELETE'])
@jwt_required()
def delete_user(target_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    if target_id == user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400

    user = User.query.get(target_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

# ── Blogs ──────────────────────────────────────────────────────────────────────

@admin_bp.route('/blogs', methods=['GET'])
@jwt_required()
def get_all_blogs():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    status = request.args.get('status')
    query = Blog.query
    if status:
        query = query.filter_by(status=status)
    blogs = query.order_by(Blog.created_at.desc()).all()
    return jsonify({'blogs': [b.to_dict() for b in blogs]}), 200

@admin_bp.route('/blogs/<int:blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404

    db.session.delete(blog)
    db.session.commit()
    return jsonify({'message': 'Blog deleted successfully'}), 200

@admin_bp.route('/blogs/<int:blog_id>/approve', methods=['POST'])
@jwt_required()
def approve_blog(blog_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404

    blog.status = 'published'
    db.session.commit()
    return jsonify({'message': 'Blog approved', 'blog': blog.to_dict()}), 200

@admin_bp.route('/blogs/<int:blog_id>/reject', methods=['POST'])
@jwt_required()
def reject_blog(blog_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404

    blog.status = 'rejected'
    db.session.commit()
    return jsonify({'message': 'Blog rejected', 'blog': blog.to_dict()}), 200

# ── Reports ────────────────────────────────────────────────────────────────────

@admin_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify({'reports': [r.to_dict() for r in reports]}), 200

@admin_bp.route('/reports/<int:report_id>/resolve', methods=['POST'])
@jwt_required()
def resolve_report(report_id):
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404

    data = request.get_json()
    action = data.get('action', 'resolved')  # 'resolved' or 'dismissed'

    if action not in ('resolved', 'dismissed'):
        return jsonify({'error': 'Action must be "resolved" or "dismissed"'}), 400

    report.status = action
    report.resolved_by = user_id
    report.resolved_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': f'Report {action}', 'report': report.to_dict()}), 200

# ── Settings ───────────────────────────────────────────────────────────────────

@admin_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    rows = PlatformSetting.query.all()
    settings = {r.setting_key: r.setting_value for r in rows}
    return jsonify({'settings': settings}), 200

@admin_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    user_id = int(get_jwt_identity())
    if not is_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()
    for key, value in data.items():
        row = PlatformSetting.query.filter_by(setting_key=key).first()
        if row:
            row.setting_value = str(value)
        else:
            db.session.add(PlatformSetting(setting_key=key, setting_value=str(value)))

    db.session.commit()
    rows = PlatformSetting.query.all()
    return jsonify({'settings': {r.setting_key: r.setting_value for r in rows}}), 200
