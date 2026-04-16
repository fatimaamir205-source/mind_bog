from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Blog, AIAnalysis
from app.ai.analyzer import ai_service

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_content():
    data = request.get_json()
    
    if not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Title and content are required'}), 400
    
    # Perform AI analysis
    analysis_result = ai_service.analyze_content(data['title'], data['content'])
    
    # If blog_id is provided, save analysis to database
    if data.get('blog_id'):
        blog = Blog.query.get(data['blog_id'])
        
        if not blog:
            return jsonify({'error': 'Blog not found'}), 404
        
        # Check if analysis exists
        ai_analysis = AIAnalysis.query.filter_by(blog_id=blog.id).first()
        
        if not ai_analysis:
            ai_analysis = AIAnalysis(blog_id=blog.id)
            db.session.add(ai_analysis)
        
        # Update analysis
        ai_analysis.quality_score = analysis_result['quality_score']
        ai_analysis.readability_score = analysis_result['readability_score']
        ai_analysis.grammar_feedback = analysis_result['grammar_feedback']
        ai_analysis.seo_feedback = analysis_result['seo_feedback']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis saved successfully',
            'analysis': ai_analysis.to_dict()
        }), 200
    
    # Return analysis without saving
    return jsonify({
        'analysis': analysis_result
    }), 200

@ai_bp.route('/blog/<int:blog_id>/analysis', methods=['GET'])
def get_blog_analysis(blog_id):
    ai_analysis = AIAnalysis.query.filter_by(blog_id=blog_id).first()
    
    if not ai_analysis:
        return jsonify({'error': 'Analysis not found'}), 404
    
    return jsonify({
        'analysis': ai_analysis.to_dict()
    }), 200
