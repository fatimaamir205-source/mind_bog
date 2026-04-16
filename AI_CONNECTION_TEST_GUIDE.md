# 🧪 AI Connection Testing Guide

## 📋 Overview

This guide helps you test if your OpenAI API key is configured correctly and verify that all AI features are working.

## 🎯 What Gets Tested

1. **OpenAI API Connection** - Verifies API key is valid and working
2. **AI Content Analysis** - Tests quality, readability, grammar, SEO analysis
3. **AI Fact-Checking** - Tests fake news detection and credibility scoring

## 🚀 Three Ways to Test

### Method 1: HTML Test Page (Easiest) 🌐

**Best for:** Quick visual testing in browser

1. **Start the backend:**
   ```bash
   cd backend
   python run.py
   ```

2. **Open test page:**
   - Open `test_ai_connection.html` in your browser
   - Or navigate to: `file:///path/to/mind_bog/test_ai_connection.html`

3. **Run tests:**
   - Click "Test Connection" to check OpenAI API
   - Click "Test Analysis" to test content analysis
   - Click "Test Fact-Check" to test fact-checking
   - Or click "Run All Tests" to test everything

4. **Read results:**
   - ✅ Green = Success
   - ⚠️ Yellow = Mock mode (no API key)
   - ❌ Red = Error

### Method 2: Python Script (Detailed) 🐍

**Best for:** Detailed testing with full output

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Run test script:**
   ```bash
   python test_ai_connection.py
   ```

3. **View results:**
   - Detailed output for each test
   - Clear error messages
   - Recommendations for fixes

### Method 3: API Endpoints (Advanced) 🔌

**Best for:** Integration testing, automated testing

#### Test OpenAI Connection
```bash
curl http://localhost:5000/api/test/ai-connection
```

**Expected Response (No API Key):**
```json
{
  "status": "mock",
  "message": "No OpenAI API key configured. Using mock analysis.",
  "api_key_configured": false,
  "recommendation": "Add OPENAI_API_KEY to .env file"
}
```

**Expected Response (Valid API Key):**
```json
{
  "status": "success",
  "message": "OpenAI API connection successful!",
  "api_key_configured": true,
  "api_key_preview": "sk-proj...xyz",
  "model": "gpt-3.5-turbo",
  "test_response": "API connection successful",
  "tokens_used": 15
}
```

#### Test AI Analysis
```bash
curl http://localhost:5000/api/test/ai-analyze-test
```

#### Test Fact-Checking
```bash
curl http://localhost:5000/api/test/ai-factcheck-test
```

## 📊 Understanding Results

### OpenAI Connection Test

#### ✅ Success (API Key Working)
```
Status: success
Message: OpenAI API connection successful!
API Key: Configured and valid
Model: gpt-3.5-turbo
```
**What this means:**
- Your API key is valid
- AI features will use real OpenAI models
- Advanced analysis and fact-checking available

#### ⚠️ Mock Mode (No API Key)
```
Status: mock
Message: No OpenAI API key configured. Using mock analysis.
API Key: Not configured
```
**What this means:**
- No API key in .env file
- System uses rule-based mock analysis
- Features work but with limited accuracy

#### ❌ Error (Invalid API Key)
```
Status: error
Message: Invalid OpenAI API key
Error: Authentication failed
```
**What this means:**
- API key is incorrect or expired
- Check key at: https://platform.openai.com/api-keys
- Update .env file with correct key

### AI Analysis Test

#### ✅ Success
```json
{
  "status": "success",
  "using_mock": false,
  "analysis_result": {
    "quality_score": 85,
    "readability_score": 78,
    "grammar_feedback": "Well-structured content...",
    "seo_feedback": "Good keyword usage..."
  }
}
```

### Fact-Check Test

#### ✅ Success
```json
{
  "status": "success",
  "credible_content_test": {
    "result": {
      "credibility_score": 85,
      "is_fake_news": false
    }
  },
  "suspicious_content_test": {
    "result": {
      "credibility_score": 25,
      "is_fake_news": true,
      "flags_count": 3
    }
  }
}
```

## 🔧 Troubleshooting

### Issue: "Backend not running"
**Error:** Failed to connect to backend

**Solution:**
```bash
cd backend
python run.py
```
Backend should start on http://localhost:5000

### Issue: "No API key configured"
**Error:** Using mock analysis

**Solution:**
1. Get API key from: https://platform.openai.com/api-keys
2. Create/edit `backend/.env` file:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart backend server

### Issue: "Invalid API key"
**Error:** Authentication failed

**Solution:**
1. Check API key at: https://platform.openai.com/api-keys
2. Make sure key is copied correctly (no spaces)
3. Verify key hasn't expired
4. Update `backend/.env` with correct key
5. Restart backend

### Issue: "Rate limit exceeded"
**Error:** Too many requests

**Solution:**
1. Wait a few minutes
2. Check usage at: https://platform.openai.com/usage
3. Upgrade plan if needed

### Issue: "OpenAI library not installed"
**Error:** Module 'openai' not found

**Solution:**
```bash
cd backend
pip install openai
```

## 📝 API Endpoints Reference

### GET /api/test/ai-connection
Tests OpenAI API connection

**Response Fields:**
- `status`: "success", "mock", or "error"
- `message`: Human-readable status message
- `api_key_configured`: Boolean
- `api_key_preview`: Masked API key (if configured)
- `model`: OpenAI model used (if success)
- `test_response`: Response from OpenAI (if success)
- `tokens_used`: Number of tokens consumed (if success)
- `error`: Error message (if error)
- `recommendation`: Suggested fix (if error)

### GET /api/test/ai-analyze-test
Tests AI content analysis with sample data

**Response Fields:**
- `status`: "success" or "error"
- `using_mock`: Boolean (true if no API key)
- `test_input`: Sample data used
- `analysis_result`: Analysis scores and feedback

### GET /api/test/ai-factcheck-test
Tests AI fact-checking with credible and suspicious content

**Response Fields:**
- `status`: "success" or "error"
- `using_mock`: Boolean
- `credible_content_test`: Results for credible content
- `suspicious_content_test`: Results for suspicious content

## 🎓 Best Practices

### Before Deployment
1. ✅ Test connection with valid API key
2. ✅ Verify analysis returns reasonable scores
3. ✅ Confirm fact-checking detects fake news
4. ✅ Check token usage is acceptable

### During Development
1. ✅ Use mock mode to save API costs
2. ✅ Test with API key before major releases
3. ✅ Monitor token usage regularly
4. ✅ Set up error alerts

### In Production
1. ✅ Use valid API key with sufficient quota
2. ✅ Monitor API usage and costs
3. ✅ Set up fallback to mock if API fails
4. ✅ Log errors for debugging

## 💰 Cost Considerations

### Token Usage
- **Connection Test**: ~15 tokens (~$0.00002)
- **Content Analysis**: ~500 tokens (~$0.0007)
- **Fact-Check**: ~800 tokens (~$0.0012)

### Pricing (GPT-3.5-turbo)
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens

### Recommendations
- Use mock mode during development
- Enable OpenAI for production
- Monitor usage at: https://platform.openai.com/usage
- Set spending limits in OpenAI dashboard

## 🔐 Security

### API Key Safety
- ✅ Never commit .env file to git
- ✅ Use environment variables
- ✅ Rotate keys regularly
- ✅ Set usage limits
- ✅ Monitor for unauthorized use

### .gitignore Entry
```
.env
.env.local
.env.*.local
```

## 📚 Additional Resources

- **OpenAI API Keys**: https://platform.openai.com/api-keys
- **OpenAI Usage**: https://platform.openai.com/usage
- **OpenAI Status**: https://status.openai.com
- **OpenAI Pricing**: https://openai.com/pricing
- **OpenAI Docs**: https://platform.openai.com/docs

## ✅ Quick Checklist

Before going live, verify:

- [ ] Backend server starts without errors
- [ ] OpenAI API key is configured (if using real AI)
- [ ] Connection test passes
- [ ] Analysis test returns reasonable scores
- [ ] Fact-check test detects fake news
- [ ] Token usage is acceptable
- [ ] Error handling works (test with invalid key)
- [ ] Mock mode works (test without key)
- [ ] All endpoints respond correctly
- [ ] Documentation is up to date

## 🎉 Success Criteria

Your AI system is ready when:

✅ Connection test shows "success" status
✅ Analysis returns quality and readability scores
✅ Fact-check detects suspicious content
✅ Credible content passes fact-check
✅ Fake news is flagged correctly
✅ Token usage is within budget
✅ Error messages are clear and helpful

---

**Need Help?**
- Check error messages for specific guidance
- Review OpenAI dashboard for API issues
- Test with mock mode first
- Verify .env file configuration
