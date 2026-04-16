#!/usr/bin/env python3
"""
OpenAI API Connection Test Script
Tests if the OpenAI API key is configured correctly and working.
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test OpenAI API connection"""
    
    print("=" * 60)
    print("OpenAI API Connection Test")
    print("=" * 60)
    print()
    
    # Check if API key exists
    api_key = os.getenv('OPENAI_API_KEY', '')
    
    if not api_key or api_key == '':
        print("❌ RESULT: No API Key Configured")
        print()
        print("Status: Using MOCK analysis")
        print("API Key: Not found in .env file")
        print()
        print("📝 To use real OpenAI analysis:")
        print("1. Get API key from: https://platform.openai.com/api-keys")
        print("2. Add to backend/.env file:")
        print("   OPENAI_API_KEY=sk-your-key-here")
        print("3. Restart the backend server")
        print()
        return False
    
    print(f"✓ API Key Found: {api_key[:7]}...{api_key[-4:]}")
    print(f"✓ Key Length: {len(api_key)} characters")
    print()
    
    # Try to import openai
    try:
        import openai
        print("✓ OpenAI library installed")
    except ImportError:
        print("❌ RESULT: OpenAI library not installed")
        print()
        print("Error: 'openai' package not found")
        print()
        print("📝 To install:")
        print("   pip install openai")
        print()
        return False
    
    # Test API connection
    print()
    print("Testing API connection...")
    print("-" * 60)
    
    try:
        openai.api_key = api_key
        
        # Make a simple test request
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Connection successful' if you can read this."}
            ],
            max_tokens=20,
            temperature=0.5
        )
        
        print()
        print("✅ SUCCESS: OpenAI API Connection Working!")
        print()
        print(f"Model: {response.model}")
        print(f"Response: {response.choices[0].message.content}")
        print(f"Tokens Used: {response.usage.total_tokens}")
        print(f"  - Prompt: {response.usage.prompt_tokens}")
        print(f"  - Completion: {response.usage.completion_tokens}")
        print()
        print("✓ Your API key is valid and working")
        print("✓ AI analysis will use real OpenAI models")
        print("✓ Fact-checking will use advanced AI")
        print()
        return True
        
    except openai.error.AuthenticationError:
        print()
        print("❌ RESULT: Authentication Failed")
        print()
        print("Error: Invalid API key")
        print(f"Key: {api_key[:7]}...{api_key[-4:]}")
        print()
        print("📝 To fix:")
        print("1. Check your API key at: https://platform.openai.com/api-keys")
        print("2. Make sure it's copied correctly (no extra spaces)")
        print("3. Update backend/.env file with correct key")
        print("4. Restart the backend server")
        print()
        return False
        
    except openai.error.RateLimitError:
        print()
        print("⚠️  RESULT: Rate Limit Exceeded")
        print()
        print("Error: Too many requests")
        print()
        print("📝 To fix:")
        print("1. Wait a few minutes and try again")
        print("2. Check your usage at: https://platform.openai.com/usage")
        print("3. Upgrade your plan if needed")
        print()
        return False
        
    except openai.error.APIError as e:
        print()
        print("❌ RESULT: OpenAI API Error")
        print()
        print(f"Error: {str(e)}")
        print()
        print("📝 To fix:")
        print("1. Check OpenAI status: https://status.openai.com")
        print("2. Try again in a few minutes")
        print("3. If problem persists, contact OpenAI support")
        print()
        return False
        
    except Exception as e:
        print()
        print("❌ RESULT: Unexpected Error")
        print()
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print()
        return False

def test_ai_analysis():
    """Test AI content analysis"""
    
    print()
    print("=" * 60)
    print("AI Content Analysis Test")
    print("=" * 60)
    print()
    
    try:
        from app.ai.analyzer import ai_service
        
        test_title = "Understanding Artificial Intelligence"
        test_content = """Artificial intelligence (AI) is transforming how we interact with technology. 
        According to recent studies, AI applications are growing across various industries. 
        Machine learning algorithms can process vast amounts of data to identify patterns and make predictions."""
        
        print(f"Test Title: {test_title}")
        print(f"Content Length: {len(test_content)} characters")
        print(f"Using Mock: {ai_service.use_mock}")
        print()
        print("Running analysis...")
        print("-" * 60)
        
        result = ai_service.analyze_content(test_title, test_content)
        
        print()
        print("✅ Analysis Complete!")
        print()
        print(f"Quality Score: {result['quality_score']}/100")
        print(f"Readability Score: {result['readability_score']}/100")
        print()
        print("Grammar Feedback:")
        print(result['grammar_feedback'])
        print()
        print("SEO Feedback:")
        print(result['seo_feedback'])
        print()
        
        return True
        
    except Exception as e:
        print()
        print("❌ Analysis Test Failed")
        print()
        print(f"Error: {str(e)}")
        print()
        return False

def test_fact_checking():
    """Test AI fact-checking"""
    
    print()
    print("=" * 60)
    print("AI Fact-Checking Test")
    print("=" * 60)
    print()
    
    try:
        from app.ai.analyzer import ai_service
        
        # Test credible content
        print("Test 1: Credible Content")
        print("-" * 60)
        credible_title = "Climate Change Research Findings"
        credible_content = """According to a study published in Nature, global temperatures continue to rise. 
        Research from NASA shows consistent warming trends over the past decades."""
        
        print(f"Title: {credible_title}")
        print("Running fact-check...")
        
        result1 = ai_service.fact_check_content(credible_title, credible_content)
        
        print()
        print(f"Credibility Score: {result1['credibility_score']}/100")
        print(f"Is Fake News: {result1['is_fake_news']}")
        print(f"Red Flags: {result1['flags_count']}")
        print(f"Warnings: {result1['warnings_count']}")
        print()
        
        # Test suspicious content
        print()
        print("Test 2: Suspicious Content")
        print("-" * 60)
        suspicious_title = "SHOCKING MIRACLE CURE!!!"
        suspicious_content = """This one weird trick will cure everything! Doctors hate this! 
        100% guaranteed results for everyone!"""
        
        print(f"Title: {suspicious_title}")
        print("Running fact-check...")
        
        result2 = ai_service.fact_check_content(suspicious_title, suspicious_content)
        
        print()
        print(f"Credibility Score: {result2['credibility_score']}/100")
        print(f"Is Fake News: {result2['is_fake_news']}")
        print(f"Red Flags: {result2['flags_count']}")
        print(f"Warnings: {result2['warnings_count']}")
        print()
        print("Feedback:")
        print(result2['fact_check_feedback'])
        print()
        
        print("✅ Fact-Checking Test Complete!")
        print()
        
        return True
        
    except Exception as e:
        print()
        print("❌ Fact-Check Test Failed")
        print()
        print(f"Error: {str(e)}")
        print()
        return False

if __name__ == "__main__":
    print()
    print("🤖 AI System Test Suite")
    print()
    
    # Test 1: OpenAI Connection
    connection_ok = test_openai_connection()
    
    # Test 2: AI Analysis
    analysis_ok = test_ai_analysis()
    
    # Test 3: Fact-Checking
    factcheck_ok = test_fact_checking()
    
    # Summary
    print()
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    print()
    print(f"OpenAI Connection: {'✅ PASS' if connection_ok else '⚠️  MOCK MODE'}")
    print(f"AI Analysis: {'✅ PASS' if analysis_ok else '❌ FAIL'}")
    print(f"Fact-Checking: {'✅ PASS' if factcheck_ok else '❌ FAIL'}")
    print()
    
    if connection_ok:
        print("🎉 All systems operational with OpenAI!")
    elif analysis_ok and factcheck_ok:
        print("✓ Systems operational in MOCK mode")
        print("  (Add OpenAI API key for advanced features)")
    else:
        print("⚠️  Some tests failed - check errors above")
    
    print()
    print("=" * 60)
    print()
