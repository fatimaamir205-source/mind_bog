# Setup Database with phpMyAdmin (XAMPP/WAMP)

## Step 1: Start XAMPP/WAMP

1. Open XAMPP Control Panel or WAMP
2. Start **Apache** 
3. Start **MySQL**
4. Both should show green "Running" status

## Step 2: Create Database

1. Open browser and go to: `http://localhost/phpmyadmin`
2. Click on **"New"** in the left sidebar
3. Database name: `blog_platform`
4. Collation: `utf8mb4_general_ci`
5. Click **"Create"**

## Step 3: Import Schema

### Option A: Import SQL File
1. Click on `blog_platform` database in left sidebar
2. Click **"Import"** tab at the top
3. Click **"Choose File"**
4. Navigate to: `d:/ty_now/mind_bog/database/schema.sql`
5. Click **"Go"** at the bottom
6. You should see: "Import has been successfully finished"

### Option B: Run SQL Directly
1. Click on `blog_platform` database in left sidebar
2. Click **"SQL"** tab at the top
3. Open `d:/ty_now/mind_bog/database/schema.sql` in notepad
4. Copy ALL the SQL code
5. Paste into the SQL text area
6. Click **"Go"**

## Step 4: Verify Tables Created

1. Click on `blog_platform` in left sidebar
2. You should see 7 tables:
   - users
   - profiles
   - blogs
   - ai_analysis
   - comments
   - likes
   - bookmarks

3. Click on `users` table
4. Click **"Browse"** tab
5. You should see 2 users (admin and john_doe)

## Step 5: Run Backend

Now go back to your terminal and run:

```bash
cd d:/ty_now/mind_bog/backend
venv\Scripts\activate
python run.py
```

It should work now! ✅
