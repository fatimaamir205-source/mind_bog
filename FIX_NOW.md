# 🚨 FIX IT NOW - 3 Steps

## Your error means: Database needs updating

## ✅ Fix in 3 Steps (1 Minute)

### Step 1: Open MySQL
```bash
mysql -u root -p
```
Enter your MySQL password when prompted.

### Step 2: Copy & Paste This
```sql
USE blog_platform;
ALTER TABLE blogs ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER status;
ALTER TABLE ai_analysis ADD COLUMN credibility_score INT AFTER readability_score;
ALTER TABLE ai_analysis ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER credibility_score;
ALTER TABLE ai_analysis ADD COLUMN fact_check_feedback TEXT AFTER is_fake_news;
```

### Step 3: Done!
Type `exit` to close MySQL, then try creating your blog again.

---

## Alternative: Use phpMyAdmin

1. Open phpMyAdmin in browser
2. Click on `blog_platform` database
3. Click "SQL" tab
4. Copy and paste the SQL from Step 2 above
5. Click "Go"
6. Done!

---

## Still Getting Error?

### Check if column already exists:
```sql
USE blog_platform;
SHOW COLUMNS FROM blogs LIKE 'is_fake_news';
```

If it shows a result, the column exists. The error is something else.

If it shows empty, run the ALTER TABLE commands again.

---

## Quick Test
After running the SQL:
1. Go to `/create` page
2. Write a blog post  
3. Click "Publish"
4. Should work! ✅

---

**That's it! Your database is now updated.** 🎉
