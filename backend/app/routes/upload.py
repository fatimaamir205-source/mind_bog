from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.file_upload import save_upload_file, allowed_file
import os

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload blog image or avatar"""
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400
        
        # Get upload type (blog or avatar)
        upload_type = request.form.get('type', 'blogs')
        
        if upload_type not in ['blogs', 'avatars']:
            upload_type = 'blogs'
        
        # Save file
        file_path = save_upload_file(file, folder=upload_type)
        
        if not file_path:
            return jsonify({'error': 'Failed to save file'}), 500
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file_path': file_path,
            'url': f"http://localhost:5000{file_path}"
        }), 201
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500
