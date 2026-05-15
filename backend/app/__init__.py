from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import Config
import os

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Create upload directories
    upload_dir = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(os.path.join(upload_dir, 'blogs'), exist_ok=True)
    os.makedirs(os.path.join(upload_dir, 'avatars'), exist_ok=True)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)
    
    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token', 'message': str(error)}), 422
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({'error': 'Missing authorization header', 'message': str(error)}), 401
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        from app.models import TokenBlacklist
        jti = jwt_payload['jti']
        return TokenBlacklist.query.filter_by(jti=jti).first() is not None
    
    # Serve uploaded files
    @app.route('/uploads/<folder>/<filename>')
    def serve_upload(folder, filename):
        """Serve uploaded images"""
        try:
            upload_dir = os.path.join(os.getcwd(), 'uploads', folder)
            return send_from_directory(upload_dir, filename)
        except Exception as e:
            return jsonify({'error': 'File not found'}), 404
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.blogs import blogs_bp
    from app.routes.comments import comments_bp
    from app.routes.admin import admin_bp
    from app.routes.ai import ai_bp
    from app.routes.upload import upload_bp
    from app.routes.test import test_bp
    from app.routes.users import users_bp
    from app.routes.analytics import analytics_bp
    from app.routes.trending import trending_bp
    from app.routes.search import search_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(blogs_bp, url_prefix='/api/blogs')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(test_bp, url_prefix='/api/test')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(trending_bp, url_prefix='/api/trending')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    
    return app
