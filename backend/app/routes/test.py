from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

test_bp = Blueprint('test', __name__)

@test_bp.route('/ping', methods=['GET'])
def ping():
    """Test endpoint - no auth required"""
    return jsonify({'message': 'pong', 'status': 'ok'}), 200

@test_bp.route('/auth-test', methods=['GET'])
@jwt_required()
def auth_test():
    """Test endpoint - auth required"""
    user_id = get_jwt_identity()
    return jsonify({'message': 'authenticated', 'user_id': user_id}), 200
