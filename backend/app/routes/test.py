from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ai.analyzer import ai_service
import os

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

@test_bp.route('/ai-connection', methods=['GET'])
def test_ai_connection():
    """Test OpenAI API connection"""
    api_key = os.getenv('OPENAI_API_KEY', '')
    
    # Check if API key exists
    if not api_key or api_key == '':
        return jsonify({
            'status': 'mock',
            'message': 'No OpenAI API key configured. Using mock analysis.',
            'api_key_configured': False,
            'api_key_length': 0,
            'recommendation': 'Add OPENAI_API_KEY to .env file for real AI analysis'
        }), 200
    
    # API key exists, test it
    try:
        # Try to import openai
        import openai
        openai.api_key = api_key
        
        # Test with a simple completion
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'API connection successful' if you can read this."}
            ],
            max_tokens=20,
            temperature=0.5
        )
        
        return jsonify({
            'status': 'success',
            'message': 'OpenAI API connection successful!',
            'api_key_configured': True,
            'api_key_length': len(api_key),
            'api_key_preview': api_key[:7] + '...' + api_key[-4:] if len(api_key) > 11 else 'sk-....',
            'model': 'gpt-3.5-turbo',
            'test_response': response.choices[0].message.content,
            'tokens_used': response.usage.total_tokens
        }), 200
        
    except ImportError:
        return jsonify({
            'status': 'error',
            'message': 'OpenAI library not installed',
            'api_key_configured': True,
            'error': 'Please install: pip install openai',
            'recommendation': 'Run: pip install openai'
        }), 500
        
    except openai.error.AuthenticationError:
        return jsonify({
            'status': 'error',
            'message': 'Invalid OpenAI API key',
            'api_key_configured': True,
            'api_key_length': len(api_key),
            'api_key_preview': api_key[:7] + '...' + api_key[-4:] if len(api_key) > 11 else 'sk-....',
            'error': 'Authentication failed',
            'recommendation': 'Check your API key at https://platform.openai.com/api-keys'
        }), 401
        
    except openai.error.RateLimitError:
        return jsonify({
            'status': 'error',
            'message': 'OpenAI API rate limit exceeded',
            'api_key_configured': True,
            'error': 'Rate limit reached',
            'recommendation': 'Wait a moment and try again, or check your OpenAI usage limits'
        }), 429
        
    except openai.error.APIError as e:
        return jsonify({
            'status': 'error',
            'message': 'OpenAI API error',
            'api_key_configured': True,
            'error': str(e),
            'recommendation': 'Check OpenAI service status at https://status.openai.com'
        }), 500
        
    except Exception as e:
        error_str = str(e)
        
        # Check if it's an authentication error in the exception message
        if 'invalid_api_key' in error_str.lower() or 'incorrect api key' in error_str.lower():
            return jsonify({
                'status': 'error',
                'message': 'Invalid OpenAI API key',
                'api_key_configured': True,
                'api_key_length': len(api_key),
                'api_key_preview': api_key[:7] + '...' + api_key[-4:] if len(api_key) > 11 else 'invalid',
                'error': 'Authentication failed - API key is incorrect',
                'recommendation': 'Get a valid API key from https://platform.openai.com/api-keys and update your .env file',
                'steps': [
                    '1. Go to https://platform.openai.com/api-keys',
                    '2. Create a new API key (or copy existing one)',
                    '3. Update backend/.env file: OPENAI_API_KEY=sk-your-real-key',
                    '4. Restart the backend server',
                    '5. Test again'
                ]
            }), 401
        
        return jsonify({
            'status': 'error',
            'message': 'Unexpected error testing OpenAI connection',
            'api_key_configured': True,
            'error': str(e),
            'error_type': type(e).__name__
        }), 500

@test_bp.route('/ai-analyze-test', methods=['GET'])
def test_ai_analyze():
    """Test AI content analysis with sample data"""
    test_title = "Understanding Artificial Intelligence"
    test_content = """Artificial intelligence (AI) is transforming how we interact with technology. 
    According to recent studies, AI applications are growing across various industries. 
    Machine learning algorithms can process vast amounts of data to identify patterns and make predictions."""
    
    try:
        # Test content analysis
        analysis_result = ai_service.analyze_content(test_title, test_content)
        
        return jsonify({
            'status': 'success',
            'message': 'AI analysis test completed',
            'using_mock': ai_service.use_mock,
            'test_input': {
                'title': test_title,
                'content_length': len(test_content)
            },
            'analysis_result': analysis_result
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'AI analysis test failed',
            'error': str(e),
            'error_type': type(e).__name__
        }), 500

@test_bp.route('/ai-factcheck-test', methods=['GET'])
def test_ai_factcheck():
    """Test AI fact-checking with sample data"""
    
    # Test with credible content
    credible_title = "Climate Change Research Findings"
    credible_content = """According to a study published in Nature, global temperatures continue to rise. 
    Research from NASA shows consistent warming trends over the past decades. 
    Scientists recommend immediate action based on peer-reviewed evidence."""
    
    # Test with suspicious content
    suspicious_title = "SHOCKING MIRACLE CURE Doctors Don't Want You to Know!!!"
    suspicious_content = """This one weird trick will cure everything! Big pharma is hiding this secret! 
    Everyone who tries this gets 100% guaranteed results! Doctors hate this!"""
    
    try:
        # Test credible content
        credible_result = ai_service.fact_check_content(credible_title, credible_content)
        
        # Test suspicious content
        suspicious_result = ai_service.fact_check_content(suspicious_title, suspicious_content)
        
        return jsonify({
            'status': 'success',
            'message': 'AI fact-check test completed',
            'using_mock': ai_service.use_mock,
            'credible_content_test': {
                'title': credible_title,
                'result': credible_result
            },
            'suspicious_content_test': {
                'title': suspicious_title,
                'result': suspicious_result
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'AI fact-check test failed',
            'error': str(e),
            'error_type': type(e).__name__
        }), 500
