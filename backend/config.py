import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file - override system variables
load_dotenv(override=True)

class Config:
    # Database - Force MySQL connection
    # Use BLOG_DATABASE_URL from .env to avoid conflicts with system DATABASE_URL
    db_url = os.getenv('BLOG_DATABASE_URL') or os.getenv('DATABASE_URL')
    
    # If still getting postgres, force MySQL
    if not db_url or 'postgresql' in db_url:
        db_url = 'mysql+pymysql://root:@localhost/blog_platform'
    
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'dev-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    
    # Flask
    SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'dev-secret-key'
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
