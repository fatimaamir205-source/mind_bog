# 🚀 AI Testing - Quick Reference

## ⚡ Quick Test (30 seconds)

### Option 1: Browser Test (Easiest)
```bash
# 1. Start backend
cd backend && python run.py

# 2. Open in browser
test_ai_connection.html
```

### Option 2: Python Script
```bash
cd backend
python test_ai_connection.py
```

### Option 3: API Call
```bash
curl http://localhost:5000/api/test/ai-connection
```

## 📊 Quick Results Guide

### ✅ Working (With OpenAI)
```json
{
  "status": "success",
  "message": "OpenAI API connection successful!",
  "api_key_configured": true
}
```
**Meaning:** Real AI analysis active ✨

### ⚠️ Mock Mode (No API Key)
```json
{
  "status": "mock",
  "message": "No OpenAI API key configured",
  "api_key_configured": false
}
```
**Meaning:** Using rule-based analysis (still works!)

### ❌ Error (Invalid Key)
```json
{
  "status": "error",
  "message": "Invalid OpenAI API key",
  "error": "Authentication failed"
}
```
**Meaning:** Fix API key in .env file

## 🔧 Quick Fixes

### No API Key?
```bash
# 1. Get key from: https://platform.openai.com/api-keys
# 2. Add to backend/.env:
echo "OPENAI_API_KEY=sk-your-key-here" >> backend/.env
# 3. Restart backend
```

### Invalid Key?
```bash
# 1. Check key at: https://platform.openai.com/api-keys
# 2. Update backend/.env with correct key
# 3. Restart backend
```

### Backend Not Running?
```bash
cd backend
python run.py
```

## 🎯 Test Endpoints

| Endpoint | Purpose | Auth Required |
|----------|---------|---------------|
| `/api/test/ai-connection` | Test OpenAI API | No |
| `/api/test/ai-analyze-test` | Test content analysis | No |
| `/api/test/ai-factcheck-test` | Test fact-checking | No |
| `/api/test/ping` | Test backend | No |

## 📝 Files Created

| File | Purpose |
|------|---------|
| `test_ai_connection.html` | Browser-based testing |
| `backend/test_ai_connection.py` | Python test script |
| `backend/app/routes/test.py` | Test API endpoints |
| `AI_CONNECTION_TEST_GUIDE.md` | Full documentation |

## 💡 Pro Tips

1. **Development:** Use mock mode (no API key) to save costs
2. **Testing:** Use real API key to verify accuracy
3. **Production:** Use real API key for best results
4. **Monitoring:** Check usage at https://platform.openai.com/usage

## 🎓 Common Scenarios

### Scenario 1: First Time Setup
```bash
# No API key yet - system uses mock mode
Status: ⚠️ Mock
Action: Optional - add API key for advanced features
```

### Scenario 2: Adding API Key
```bash
# Get key → Add to .env → Restart → Test
Status: ✅ Success
Action: None - you're good to go!
```

### Scenario 3: API Key Expired
```bash
# Key no longer works
Status: ❌ Error
Action: Generate new key → Update .env → Restart
```

## 🔍 Quick Diagnostics

### Test 1: Backend Running?
```bash
curl http://localhost:5000/api/test/ping
# Expected: {"message": "pong", "status": "ok"}
```

### Test 2: API Key Configured?
```bash
curl http://localhost:5000/api/test/ai-connection
# Check: "api_key_configured": true/false
```

### Test 3: Analysis Working?
```bash
curl http://localhost:5000/api/test/ai-analyze-test
# Check: "status": "success"
```

### Test 4: Fact-Check Working?
```bash
curl http://localhost:5000/api/test/ai-factcheck-test
# Check: "status": "success"
```

## 📊 Status Meanings

| Status | Icon | Meaning | Action |
|--------|------|---------|--------|
| success | ✅ | OpenAI working | None |
| mock | ⚠️ | Using fallback | Optional: Add API key |
| error | ❌ | Something wrong | Check error message |

## 🎯 Success Checklist

- [ ] Backend starts without errors
- [ ] Test endpoint responds
- [ ] Connection test completes
- [ ] Analysis test works
- [ ] Fact-check test works
- [ ] Results make sense

## 🆘 Need Help?

1. **Check error message** - Usually tells you what's wrong
2. **Verify backend running** - Should be on port 5000
3. **Check .env file** - API key format: `OPENAI_API_KEY=sk-...`
4. **Restart backend** - After changing .env
5. **Check OpenAI status** - https://status.openai.com

## 💰 Cost Reference

| Operation | Tokens | Cost (approx) |
|-----------|--------|---------------|
| Connection test | ~15 | $0.00002 |
| Content analysis | ~500 | $0.0007 |
| Fact-check | ~800 | $0.0012 |

**Note:** Mock mode = FREE (no API calls)

## 🔐 Security Reminder

- ✅ Never commit .env file
- ✅ Keep API key secret
- ✅ Rotate keys regularly
- ✅ Monitor usage
- ✅ Set spending limits

---

## 🎉 Quick Start

```bash
# 1. Start backend
cd backend && python run.py

# 2. Test (choose one):
# - Browser: Open test_ai_connection.html
# - Python: python test_ai_connection.py
# - API: curl http://localhost:5000/api/test/ai-connection

# 3. Check result:
# - ✅ Success = Ready to go!
# - ⚠️ Mock = Works, but add API key for advanced features
# - ❌ Error = Fix issue and retry
```

**That's it! You're ready to test your AI system! 🚀**
