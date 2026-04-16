import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_upload_file(file, folder='blogs'):
    """
    Save uploaded file and return the file path
    
    Args:
        file: FileStorage object from request.files
        folder: Subfolder name ('blogs' or 'avatars')
    
    Returns:
        str: Relative path to saved file or None if error
    """
    if not file or file.filename == '':
        return None
    
    if not allowed_file(file.filename):
        return None
    
    # Generate unique filename
    original_filename = secure_filename(file.filename)
    file_extension = original_filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join('uploads', folder)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_dir, unique_filename)
    file.save(file_path)
    
    # Return relative path for database storage
    return f"/uploads/{folder}/{unique_filename}"

def delete_upload_file(file_path):
    """
    Delete uploaded file from storage
    
    Args:
        file_path: Relative path to file (e.g., /uploads/blogs/abc123.jpg)
    """
    if not file_path:
        return
    
    try:
        # Remove leading slash and construct full path
        relative_path = file_path.lstrip('/')
        full_path = os.path.join(os.getcwd(), relative_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
    except Exception as e:
        print(f"Error deleting file {file_path}: {str(e)}")
