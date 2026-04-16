# 🚀 Fact-Check Feature - Quick Setup Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Run Database Migration
```bash
# Login to MySQL
mysql -u root -p

# Run migration
source database/migration_fact_check.sql

# Or manually:
mysql -u root -p blog_platform < database/migration_fact_check.sql
```

### Step 2: Start Backend
```bash
cd backend
python run.py
```

### Step 3: Start Frontend
```bash
cd frontend_v2
npm run dev
```

## ✅ Verify Installation

1. Navigate to `http://localhost:3000/create`
2. Login if needed
3. Look for **two sections** in the sidebar:
   - ✨ AI Content Review (purple)
   - 🛡️ Fact-Check (green/red)

## 🧪 Test It Out

### Test 1: Normal Content (Should Pass ✅)
```
Title: Understanding Web Development
Content: Web development involves creating websites using HTML, CSS, and JavaScript. According to industry standards, responsive design is essential for modern websites.
```
**Expected:** Credibility Score 80+, Can Publish ✅

### Test 2: Fake News (Should Block ❌)
```
Title: SHOCKING MIRACLE CURE Doctors Don't Want You to Know!!!
Content: This one weird trick will cure everything! Big pharma is hiding this secret from you! Everyone who tries this gets 100% guaranteed results!
```
**Expected:** Credibility Score <40, CANNOT PUBLISH ❌

## 📊 What You'll See

### High Credibility (80-100)
```
🛡️ Fact-Check                    [Check]

Credibility Score              85/100
[████████████████████░░░░░░░░░░]

✓ Content appears credible

Red Flags: 0    Warnings: 0
```

### Fake News Detected (<40)
```
🛡️ Fact-Check                    [Check]

Credibility Score              25/100
[█████░░░░░░░░░░░░░░░░░░░░░░░░]

⚠️ FAKE NEWS DETECTED - CANNOT PUBLISH

RED FLAGS:
• Suspicious keywords detected
• Sensational language detected
• Excessive exclamation marks

Red Flags: 3    Warnings: 2
```

## 🎯 Key Features

### 1. Automatic Detection
- Scans for fake news keywords
- Detects sensational language
- Identifies clickbait patterns

### 2. Publication Blocking
- Content with score <40 = BLOCKED
- User must edit and re-check
- Protects platform from misinformation

### 3. Visual Feedback
- 🟢 Green: High credibility (80-100)
- 🟡 Yellow: Medium credibility (60-79)
- 🔴 Red: Fake news (<40)

## 🔍 Detection Examples

### ❌ Triggers Fake News Flag
- "miracle cure"
- "doctors hate this"
- "one weird trick"
- "they don't want you to know"
- "BREAKING!!!" (excessive caps + exclamation)
- "100% guaranteed cure"
- Multiple exclamation marks (!!!!)

### ✅ Passes Credibility Check
- Citing sources ("according to study...")
- Balanced language
- Proper capitalization
- Evidence-based claims
- References to research

## 🛠️ Troubleshooting

### Database Migration Error
```bash
# Check if columns exist
mysql -u root -p
USE blog_platform;
DESCRIBE blogs;
DESCRIBE ai_analysis;

# If columns exist, skip migration
```

### Fact-Check Button Not Showing
- Clear browser cache
- Restart frontend dev server
- Check browser console for errors

### "Cannot Publish" Error
- Review fact-check feedback
- Remove sensational keywords
- Add credible sources
- Re-check content

## 📝 Files Modified

### Backend (3 files)
1. `backend/app/ai/analyzer.py` - Added fact-checking logic
2. `backend/app/routes/ai.py` - Added `/fact-check` endpoint
3. `backend/app/models/blog.py` - Added `is_fake_news` fields

### Frontend (2 files)
1. `frontend_v2/client/src/pages/CreateBlog.tsx` - Added UI
2. `frontend_v2/client/src/services/api.ts` - Added API method

### Database (1 file)
1. `database/migration_fact_check.sql` - Migration script

## 🎓 How to Use

1. **Write your blog** in the Create page
2. **Click "Check"** in the Fact-Check section
3. **Review the score** and feedback
4. **Edit if needed** based on suggestions
5. **Re-check** until credibility is acceptable
6. **Publish** (only if not flagged as fake news)

## 🔐 Security

- ✅ Blocks fake news from publishing
- ✅ Flags suspicious content in database
- ✅ Provides educational feedback
- ✅ Protects platform reputation

## 📚 Documentation

- `FACT_CHECK_FEATURE.md` - Complete documentation
- `AI_REVIEW_COMPLETE.md` - AI review feature docs
- `README.md` - Project overview

## 🎉 You're Ready!

The fact-checking system is now active and protecting your platform from misinformation. Try creating a blog post and test it out!

**Need Help?**
- Check `FACT_CHECK_FEATURE.md` for detailed docs
- Review browser console for errors
- Check backend logs for API issues

---

**Pro Tip:** Use the fact-checker during content creation to improve quality and credibility before publishing! 🛡️
