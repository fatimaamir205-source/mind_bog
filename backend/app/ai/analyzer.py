import os
import re

class AIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY', '')
        self.image_api_key = os.getenv('IMAGE_API_KEY', '')  # For image generation (e.g., DALL-E, Stability AI)
        self.use_mock = not self.api_key or self.api_key == ''
        self.use_mock_image = not self.image_api_key or self.image_api_key == ''
        
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
    
    def generate_content(self, prompt):
        """Generate blog content based on user prompt"""
        
        if self.use_mock:
            return self._mock_generate(prompt)
        else:
            return self._openai_generate(prompt)
    
    def generate_image(self, prompt):
        """Generate image based on user prompt"""
        
        if self.use_mock_image:
            return self._mock_generate_image(prompt)
        else:
            return self._openai_generate_image(prompt)
    
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
    
    def _openai_fact_check(self, title, content):
        """Real OpenAI fact-checking"""
        try:
            import openai
            openai.api_key = self.api_key
            
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
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a fact-checking expert who identifies misinformation and fake news."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback to mock if OpenAI fails
            return self._mock_fact_check(title, content)
    
    def _mock_generate(self, prompt):
        """Mock content generation when OpenAI API is not available"""
        
        # Extract topic from prompt
        topic = prompt[:100] if len(prompt) > 100 else prompt
        
        # Generate title
        title = f"Understanding {topic.title()}: A Comprehensive Guide"
        
        # Generate excerpt
        excerpt = f"Explore the essential aspects of {topic.lower()} and discover how it impacts our world today. Learn about key principles, practical applications, and future trends."
        
        # Generate solid, informative content
        content = f"""In this comprehensive exploration of {topic.lower()}, we delve into the fundamental aspects that make this subject both relevant and impactful in today's world.

Understanding the core principles is essential before we can fully appreciate the broader implications. The foundational concepts provide a framework for analyzing how this topic influences various aspects of our lives and work. By examining these fundamentals, we gain insight into the mechanisms that drive change and innovation in this field.

The current landscape is characterized by rapid evolution and continuous development. Recent trends indicate a growing interest and investment in this area, with experts and practitioners alike recognizing its significance. Industry leaders are implementing new strategies and approaches that leverage the latest insights and technologies. This dynamic environment creates both opportunities and challenges for those seeking to stay informed and competitive.

Practical applications demonstrate the real-world value of understanding this subject. Organizations across various sectors are finding innovative ways to implement these concepts, resulting in measurable improvements in efficiency, effectiveness, and outcomes. Case studies reveal that successful implementation requires careful planning, adequate resources, and a commitment to ongoing learning and adaptation.

The benefits of engaging with this topic are substantial and multifaceted. Individuals and organizations that invest time in developing expertise gain competitive advantages, enhanced decision-making capabilities, and improved problem-solving skills. The knowledge acquired enables more strategic thinking and better anticipation of future trends and developments.

However, it's important to acknowledge the challenges that come with this territory. The complexity of the subject matter can present a steep learning curve for newcomers. Resource requirements, both in terms of time and investment, must be carefully considered. Implementation often requires organizational change and stakeholder buy-in, which can be difficult to achieve. Ongoing maintenance and updates are necessary to ensure continued relevance and effectiveness.

Looking toward the future, the trajectory suggests continued growth and evolution. Emerging technologies and methodologies promise to expand possibilities and create new opportunities. Staying informed about these developments is crucial for anyone seeking to remain at the forefront of this field.

In conclusion, {topic.lower()} represents a critical area of focus that warrants serious attention and study. By developing a deep understanding of the principles, staying current with trends, and applying knowledge practically, individuals and organizations can position themselves for success. The journey requires dedication and continuous learning, but the rewards make the effort worthwhile. As we move forward, maintaining curiosity and adaptability will be key to navigating the evolving landscape and maximizing the benefits this subject has to offer."""
        
        return {
            'title': title,
            'excerpt': excerpt,
            'content': content
        }
    
    def _openai_generate(self, prompt):
        """Real OpenAI content generation"""
        try:
            import openai
            openai.api_key = self.api_key
            
            system_prompt = """You are a professional blog writer who creates engaging, informative, and well-structured content. 
You must respond with a JSON object containing three fields:
1. "title": A compelling blog post title (50-70 characters)
2. "excerpt": A brief summary/description (120-160 characters)
3. "content": The full blog post content in solid paragraphs of flowing text

For the content:
- Write in a clear, accessible style with solid paragraphs of flowing text
- DO NOT use markdown headers, bullet points, or numbered lists
- Write in continuous prose with well-developed paragraphs
- Include an introduction, develop the main ideas in body paragraphs, and provide a conclusion
- Make the content informative, accurate, and engaging for readers with smooth transitions between ideas

Respond ONLY with valid JSON in this exact format:
{"title": "...", "excerpt": "...", "content": "..."}"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Write a comprehensive blog post about: {prompt}. Return as JSON with title, excerpt, and content fields."}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback to mock if OpenAI fails
            return self._mock_generate(prompt)
    
    def _mock_generate_image(self, prompt):
        """Mock image generation - returns a placeholder"""
        # Return a placeholder image URL (you can use a service like placeholder.com or unsplash)
        return {
            'image_url': f'https://via.placeholder.com/800x400/6366f1/ffffff?text={prompt[:50].replace(" ", "+")}',
            'message': 'Mock image generated. Configure IMAGE_API_KEY in .env for real AI image generation.'
        }
    
    def _openai_generate_image(self, prompt):
        """Real AI image generation using DALL-E or other service"""
        try:
            import openai
            openai.api_key = self.image_api_key or self.api_key
            
            # Using DALL-E 3 for image generation
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="1024x1024",
                model="dall-e-3"
            )
            
            image_url = response.data[0].url
            
            return {
                'image_url': image_url,
                'message': 'Image generated successfully'
            }
            
        except Exception as e:
            # Fallback to mock if generation fails
            return self._mock_generate_image(prompt)

ai_service = AIService()