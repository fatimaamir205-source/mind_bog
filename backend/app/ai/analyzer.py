import os
import re
import requests
import json

class AIService:
    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY', '')
        self.use_mock = not self.api_key or self.api_key == ''
        self.api_base = "https://api.deepseek.com/v1"
        
        # Fake news indicators (keywords and patterns)
        self.fake_news_keywords = [
            'miracle cure', 'doctors hate', 'one weird trick', 'they don\'t want you to know',
            'secret revealed', 'shocking truth', 'big pharma', 'government hiding',
            'scientists baffled', 'you won\'t believe', 'click here now', 'limited time',
            'cure cancer overnight', 'lose 50 pounds', 'get rich quick', 'make money fast',
            'illuminati', 'new world order conspiracy', 'fake moon landing', 'flat earth proof'
        ]
        
        self.sensational_patterns = [
            r'\b(BREAKING|URGENT|ALERT|WARNING)\b.*!{2,}',
            r'\b(100%|guaranteed|proven|definitely|absolutely)\b.*\b(cure|fix|solve)\b',
            r'\b(never|always|everyone|nobody)\b.*\b(knows|believes|says)\b'
        ]
    
    def analyze_content(self, title, content):
        """Analyze blog content for quality, grammar, SEO, and readability"""
        
        if self.use_mock:
            return self._mock_analysis(title, content)
        else:
            return self._openai_analysis(title, content)
    
    def fact_check_content(self, title, content):
        """Fact-check content for misinformation and fake news"""
        
        if self.use_mock:
            return self._mock_fact_check(title, content)
        else:
            return self._openai_fact_check(title, content)
    
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
    
    def _mock_fact_check(self, title, content):
        """Mock fact-checking when OpenAI API is not available"""
        
        combined_text = (title + ' ' + content).lower()
        credibility_score = 100
        flags = []
        warnings = []
        is_fake_news = False
        
        # Check for fake news keywords
        found_keywords = []
        for keyword in self.fake_news_keywords:
            if keyword.lower() in combined_text:
                found_keywords.append(keyword)
                credibility_score -= 15
        
        if found_keywords:
            flags.append(f"Suspicious keywords detected: {', '.join(found_keywords[:3])}")
        
        # Check for sensational patterns
        sensational_count = 0
        for pattern in self.sensational_patterns:
            matches = re.findall(pattern, title + ' ' + content, re.IGNORECASE)
            sensational_count += len(matches)
        
        if sensational_count > 0:
            credibility_score -= sensational_count * 10
            flags.append(f"Sensational language detected ({sensational_count} instances)")
        
        # Check for excessive capitalization
        caps_ratio = sum(1 for c in title if c.isupper()) / max(len(title), 1)
        if caps_ratio > 0.5:
            credibility_score -= 20
            flags.append("Excessive capitalization in title (common in fake news)")
        
        # Check for excessive exclamation marks
        exclamation_count = combined_text.count('!')
        if exclamation_count > 5:
            credibility_score -= 15
            flags.append(f"Excessive exclamation marks ({exclamation_count} found)")
        
        # Check for lack of sources
        has_sources = any(word in combined_text for word in ['study', 'research', 'according to', 'source', 'report', 'published'])
        if not has_sources and len(content.split()) > 200:
            credibility_score -= 10
            warnings.append("No sources or references cited")
        
        # Check for absolute claims without evidence
        absolute_claims = re.findall(r'\b(always|never|all|none|every|no one)\b', content, re.IGNORECASE)
        if len(absolute_claims) > 5:
            credibility_score -= 10
            warnings.append("Multiple absolute claims without evidence")
        
        # Ensure score doesn't go below 0
        credibility_score = max(0, credibility_score)
        
        # Determine if it's fake news (threshold: 40)
        if credibility_score < 40:
            is_fake_news = True
            flags.insert(0, "⚠️ HIGH RISK: Content flagged as potential fake news")
        elif credibility_score < 60:
            warnings.insert(0, "⚠️ MEDIUM RISK: Content contains suspicious elements")
        
        # Generate feedback
        feedback_parts = []
        if flags:
            feedback_parts.append("RED FLAGS:\n" + "\n".join(f"• {flag}" for flag in flags))
        if warnings:
            feedback_parts.append("WARNINGS:\n" + "\n".join(f"• {warning}" for warning in warnings))
        
        if credibility_score >= 80:
            feedback_parts.append("✓ Content appears credible with no major concerns")
        
        fact_check_feedback = "\n\n".join(feedback_parts) if feedback_parts else "Content appears credible."
        
        return {
            'credibility_score': credibility_score,
            'is_fake_news': is_fake_news,
            'fact_check_feedback': fact_check_feedback,
            'flags_count': len(flags),
            'warnings_count': len(warnings)
        }
    
    def _openai_analysis(self, title, content):
        """DeepSeek API analysis"""
        try:
            prompt = f"""Analyze this blog post and provide:
1. Quality score (0-100)
2. Readability score (0-100)
3. Grammar suggestions
4. SEO recommendations

Title: {title}
Content: {content[:1000]}

Respond in JSON format with keys: quality_score, readability_score, grammar_feedback, seo_feedback"""
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are a content analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }
            
            response = requests.post(
                f"{self.api_base}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            result_text = response.json()["choices"][0]["message"]["content"]
            result = json.loads(result_text)
            return result
            
        except Exception as e:
            # Fallback to mock if DeepSeek fails
            return self._mock_analysis(title, content)
    
    def _openai_fact_check(self, title, content):
        """DeepSeek API fact-checking"""
        try:
            prompt = f"""Analyze this blog post for misinformation, fake news, and credibility.

Title: {title}
Content: {content[:2000]}

Provide:
1. credibility_score (0-100): How credible is this content?
2. is_fake_news (true/false): Is this likely fake news or misinformation?
3. fact_check_feedback: Detailed explanation of concerns or validation
4. flags_count: Number of serious red flags
5. warnings_count: Number of minor warnings

Look for:
- Unverified claims presented as facts
- Sensational or clickbait language
- Lack of credible sources
- Conspiracy theories
- Medical/health misinformation
- Political propaganda
- Manipulated statistics

Respond in JSON format with keys: credibility_score, is_fake_news, fact_check_feedback, flags_count, warnings_count"""
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are a fact-checking expert who identifies misinformation and fake news."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 800
            }
            
            response = requests.post(
                f"{self.api_base}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            
            result_text = response.json()["choices"][0]["message"]["content"]
            result = json.loads(result_text)
            return result
            
        except Exception as e:
            # Fallback to mock if DeepSeek fails
            return self._mock_fact_check(title, content)

ai_service = AIService()
