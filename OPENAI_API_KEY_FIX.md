# 🔧 OpenAI API Key Troubleshooting Guide

## ❌ Error: "Invalid OpenAI API key"

You're seeing this error because your API key is not valid. Here's how to fix it:

## 🎯 Quick Fix (5 Steps)

### Step 1: Get a Valid API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click **"Create new secret key"**
4. Give it a name (e.g., "Blog Platform")
5. **Copy the key immediately** (you won't see it again!)

### Step 2: Update Your .env File
1. Open `backend/.env` file
2. Find the line: `OPENAI_API_KEY=...`
3. Replace with your new key:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
4. Save the file

### Step 3: Verify the Key Format
Your API key should look like:
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Common mistakes:**
- ❌ Extra spaces before/after the key
- ❌ Quotes around the key
- ❌ Incomplete key (missing characters)
- ❌ Old key format (expired)

**Correct format:**
```
OPENAI_API_KEY=sk-proj-abc123...xyz789
```

### Step 4: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Then restart:
cd backend
python run.py
```

### Step 5: Test Again
```bash
# Open test_ai_connection.html in browser
# Or run:
curl http://localhost:5000/api/test/ai-connection
```

## 🔍 Understanding Your Error

Your error message shows:
```
"Incorrect API key provided: sk-abcd1*******************************1234"
```

This means:
- ✅ API key is configured in .env
- ❌ But the key is invalid/incorrect
- 🔧 You need to replace it with a valid key

## 📝 Common Issues & Solutions

### Issue 1: Using a Fake/Test Key
**Problem:** You have `sk-abcd1234...` or similar test key

**Solution:** 
- This is not a real OpenAI API key
- Get a real key from https://platform.openai.com/api-keys
- Replace the test key with your real key

### Issue 2: Key Has Expired
**Problem:** Key worked before but doesn't now

**Solution:**
- OpenAI keys can be revoked or expire
- Create a new key
- Update .env file
- Restart backend

### Issue 3: Wrong Account
**Problem:** Using key from different account

**Solution:**
- Make sure you're logged into the correct OpenAI account
- Verify the key belongs to your account
- Check at: https://platform.openai.com/api-keys

### Issue 4: Copy/Paste Error
**Problem:** Key was copied incorrectly

**Solution:**
- Delete the current key from .env
- Go back to OpenAI dashboard
- Create a NEW key (can't view old ones)
- Copy carefully (no extra spaces)
- Paste into .env

### Issue 5: Environment Variable Not Loading
**Problem:** .env file not being read

**Solution:**
```bash
# Check if .env file exists
ls backend/.env

# Check if key is in file
cat backend/.env | grep OPENAI_API_KEY

# Make sure no extra quotes
# Wrong: OPENAI_API_KEY="sk-proj-..."
# Right: OPENAI_API_KEY=sk-proj-...
```

## 🎓 Step-by-Step: Getting Your First API Key

### 1. Create OpenAI Account
- Go to: https://platform.openai.com/signup
- Sign up with email or Google/Microsoft account
- Verify your email

### 2. Add Payment Method (Required)
- Go to: https://platform.openai.com/account/billing
- Add a credit card
- Set spending limits (recommended: $5-10/month)

### 3. Create API Key
- Go to: https://platform.openai.com/api-keys
- Click **"Create new secret key"**
- Name it: "Blog Platform Dev"
- Click **"Create secret key"**
- **COPY THE KEY NOW** (you can't see it again!)

### 4. Save to .env File
```bash
# Navigate to backend folder
cd backend

# Edit .env file (or create if doesn't exist)
nano .env
# or
notepad .env

# Add this line:
OPENAI_API_KEY=sk-proj-your-copied-key-here

# Save and exit
```

### 5. Verify It Works
```bash
# Restart backend
python run.py

# In another terminal, test:
curl http://localhost:5000/api/test/ai-connection

# Should see: "status": "success"
```

## 💰 Cost Information

### Free Trial
- New accounts get $5 free credit
- Expires after 3 months
- Good for testing

### Pricing (GPT-3.5-turbo)
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens
- ~$0.001 per blog analysis
- ~$0.0012 per fact-check

### Recommended Budget
- **Development:** $5/month (plenty for testing)
- **Production:** $10-50/month (depends on traffic)

### Set Spending Limits
1. Go to: https://platform.openai.com/account/limits
2. Set hard limit (e.g., $10/month)
3. Set soft limit (e.g., $8/month for alerts)

## 🔐 Security Best Practices

### DO ✅
- Keep API key secret
- Add .env to .gitignore
- Rotate keys regularly (every 3-6 months)
- Set spending limits
- Monitor usage

### DON'T ❌
- Commit .env to git
- Share keys publicly
- Use same key everywhere
- Leave unlimited spending
- Ignore usage alerts

## 🧪 Testing Without API Key

If you don't want to use OpenAI yet:

### Option 1: Use Mock Mode
```bash
# Remove or comment out API key in .env
# OPENAI_API_KEY=

# System will use rule-based analysis
# Features still work, just less advanced
```

### Option 2: Test with Fake Key First
```bash
# Use a test key to verify setup
OPENAI_API_KEY=sk-test-key-for-testing

# Should see "invalid key" error
# This confirms system is reading .env correctly
```

## 📊 Verification Checklist

Before testing, verify:

- [ ] OpenAI account created
- [ ] Payment method added
- [ ] API key created
- [ ] Key copied correctly (no spaces)
- [ ] .env file exists in backend folder
- [ ] Key added to .env: `OPENAI_API_KEY=sk-proj-...`
- [ ] No quotes around the key
- [ ] No extra spaces
- [ ] Backend restarted after changes
- [ ] Test endpoint returns success

## 🆘 Still Not Working?

### Check 1: Is Backend Reading .env?
```python
# Add this to backend/test_ai_connection.py temporarily
import os
from dotenv import load_dotenv
load_dotenv()
print("API Key:", os.getenv('OPENAI_API_KEY', 'NOT FOUND'))
```

### Check 2: Is Key Format Correct?
```bash
# Should start with sk-proj- or sk-
# Should be ~50+ characters long
# Should have no spaces or quotes
```

### Check 3: Is OpenAI Service Up?
- Check: https://status.openai.com
- If down, wait and try again

### Check 4: Is Account Active?
- Login to: https://platform.openai.com
- Check billing status
- Verify account not suspended

## 📞 Getting Help

### OpenAI Support
- Help Center: https://help.openai.com
- Community: https://community.openai.com
- Status: https://status.openai.com

### Check These Resources
1. **API Keys Dashboard**: https://platform.openai.com/api-keys
2. **Usage Dashboard**: https://platform.openai.com/usage
3. **Billing**: https://platform.openai.com/account/billing
4. **Documentation**: https://platform.openai.com/docs

## ✅ Success Indicators

You'll know it's working when:

✅ Test returns: `"status": "success"`
✅ Message says: "OpenAI API connection successful!"
✅ You see: `"tokens_used": 15` (or similar)
✅ No error messages
✅ AI analysis uses real OpenAI models

## 🎉 Next Steps After Success

Once your API key works:

1. ✅ Test content analysis
2. ✅ Test fact-checking
3. ✅ Set spending limits
4. ✅ Monitor usage
5. ✅ Document key location for team
6. ✅ Set up key rotation schedule

---

## 🚀 Quick Command Reference

```bash
# Get your current key (check if set)
cd backend
cat .env | grep OPENAI_API_KEY

# Test connection
curl http://localhost:5000/api/test/ai-connection

# View backend logs
cd backend
python run.py
# Watch for any .env loading errors

# Restart backend (after changing .env)
# Press Ctrl+C to stop
python run.py
```

---

**Remember:** Your API key is like a password. Keep it secret, keep it safe! 🔐
