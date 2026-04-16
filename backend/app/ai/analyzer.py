import os
import re

class AIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY', '')
        self.use_mock = not self.api_key or self.api_key == ''
    
    def analyze_content(self, title, content):
        """Analyze blog content for quality, grammar, SEO, and readability"""
        
        if self.use_mock:
            return self._mock_analysis(title, content)
        else:
            return self._openai_analysis(title, content)
    
    def _mock_analysis(self, title, content):
        """Mock AI analysis when OpenAI API is not available"""
        
        # Calculate basic metrics
        word_count = len(content.split())
        sentence_count = len(re.split(r'[.!?]+', content))
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Quality score based on length and structure
        quality_score = min(100, 50 + (word_count // 10))
        
        # Readability score (Flesch-like approximation)
        readability_score = max(0, min(100, 100 - int(avg_sentence_length * 2)))
        
        # Grammar feedback
        grammar_issues = []
        if word_count < 100:
            grammar_issues.append("Content is too short. Aim for at least 300 words.")
        if avg_sentence_length > 25:
            grammar_issues.append("Some sentences are too long. Consider breaking them up.")
        if not any(char.isupper() for char in content[:50]):
            grammar_issues.append("Check capitalization at the beginning of sentences.")
        
        grammar_feedback = "\n".join(grammar_issues) if grammar_issues else "No major grammar issues detected."
        
        # SEO feedback
        seo_tips = []
        if len(title) < 30:
            seo_tips.append("Title is short. Consider a more descriptive title (50-60 characters).")
        if word_count < 300:
            seo_tips.append("Content length is below recommended 300+ words for SEO.")
        if not any(keyword in content.lower() for keyword in title.lower().split()):
            seo_tips.append("Include title keywords in the content for better SEO.")
        
        seo_feedback = "\n".join(seo_tips) if seo_tips else "Good SEO practices detected."
        
        return {
            'quality_score': quality_score,
            'readability_score': readability_score,
            'grammar_feedback': grammar_feedback,
            'seo_feedback': seo_feedback
        }
    
    def _openai_analysis(self, title, content):
        """Real OpenAI analysis"""
        try:
            import openai
            openai.api_key = self.api_key
            
            prompt = f"""Analyze this blog post and provide:
1. Quality score (0-100)
2. Readability score (0-100)
3. Grammar suggestions
4. SEO recommendations

Title: {title}
Content: {content[:1000]}

Respond in JSON format with keys: quality_score, readability_score, grammar_feedback, seo_feedback"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a content analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback to mock if OpenAI fails
            return self._mock_analysis(title, content)

ai_service = AIService()
