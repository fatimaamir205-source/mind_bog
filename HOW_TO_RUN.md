# 🚀 HOW TO RUN THE PROJECT

Complete step-by-step guide to run the Smart AI-Powered Blog Platform on your machine.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have installed:

- [ ] **Python 3.8+** - [Download](https://www.python.org/downloads/)
- [ ] **Node.js 14+** - [Download](https://nodejs.org/)
- [ ] **MySQL 5.7+** - [Download](https://dev.mysql.com/downloads/mysql/)
- [ ] **Git** (optional) - [Download](https://git-scm.com/)

### Verify Installations

Open terminal/command prompt and run:

```bash
python --version
# Should show: Python 3.8.x or higher

node --version
# Should show: v14.x.x or higher

npm --version
# Should show: 6.x.x or higher

mysql --version
# Should show: mysql Ver 5.7.x or higher
```

---

## 🗄️ STEP 1: Setup Database (5 minutes)

### Option A: Using MySQL Command Line

```bash
# 1. Open MySQL command line
mysql -u root -p

# 2. Enter your MySQL root password

# 3. Run the schema file
source d:/ty_now/mind_bog/database/schema.sql

# 4. Verify database was created
SHOW DATABASES;
# You should see 'blog_platform' in the list

# 5. Verify tables were created
USE blog_platform;
SHOW TABLES;
# You should see 7 tables

# 6. Exit MySQL
exit;
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click **File** → **Open SQL Script**
4. Navigate to `d:/ty_now/mind_bog/database/schema.sql`
5. Click **Execute** (lightning bolt icon)
6. Refresh the schemas panel - you should see `blog_platform`

### Verify Sample Data

```sql
USE blog_platform;

-- Check users (should have 2 users)
SELECT * FROM users;

-- Check blogs (should have 2 blogs)
SELECT * FROM blogs;
```

**✅ Database Setup Complete!**

---

## 🐍 STEP 2: Setup Backend (5 minutes)

### 1. Navigate to Backend Directory

```bash
cd d:/ty_now/mind_bog/backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

You should see `(venv)` at the beginning of your command prompt.

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Flask-Bcrypt
- PyMySQL
- python-dotenv
- openai
- cryptography

### 5. Configure Environment Variables

Open `backend/.env` file and update if needed:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost/blog_platform
JWT_SECRET_KEY=your-secret-key-change-this-in-production
OPENAI_API_KEY=
FLASK_ENV=development
```

**Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### 6. Run the Backend Server

```bash
python run.py
```

**Expected Output:**
```
Database tables created successfully!
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://0.0.0.0:5000
Press CTRL+C to quit
```

### 7. Test Backend API

Open browser and visit: `http://localhost:5000/api/blogs`

You should see JSON response with blog data.

**✅ Backend Setup Complete!**

**Keep this terminal running!**

---

## ⚛️ STEP 3: Setup Frontend (5 minutes)

### 1. Open NEW Terminal

**Important:** Don't close the backend terminal. Open a new one.

### 2. Navigate to Frontend Directory

```bash
cd d:/ty_now/mind_bog/frontend
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- React
- React Router
- Axios
- React Scripts

**Note:** This may take 2-3 minutes.

### 4. Start Development Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view blog-platform-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### 5. Browser Opens Automatically

The app should open automatically at `http://localhost:3000`

If not, manually open: `http://localhost:3000`

**✅ Frontend Setup Complete!**

---

## 🎯 STEP 4: Test the Application

### Test 1: View Homepage

- You should see "Discover Amazing Blogs"
- 2 sample blogs should be displayed
- Search bar and sort dropdown should be visible

### Test 2: Login as Admin

1. Click **Login** in navbar
2. Enter credentials:
   - Email: `admin@blog.com`
   - Password: `admin123`
3. Click **Login**
4. You should be redirected to homepage
5. Navbar should show: **Create Blog**, **Dashboard**, **Admin**, **👤 admin**

### Test 3: Access Admin Dashboard

1. Click **Admin** in navbar
2. You should see:
   - Statistics (Total Users, Blogs, Comments, Likes)
   - Most Active Users
   - Most Popular Blogs
3. Click **Users** tab - see all users
4. Click **Blogs** tab - see all blogs

### Test 4: Create a Blog

1. Click **Create Blog** in navbar
2. Fill in:
   - Title: "My First Blog Post"
   - Content: "This is my first blog post with AI analysis. It's amazing!"
   - Tags: "test, demo"
   - Status: Published
3. Click **🤖 Analyze with AI**
4. Wait 2 seconds - AI analysis should appear
5. Click **Create Blog**
6. You should see success message

### Test 5: View Blog Detail

1. Go to homepage
2. Click on any blog card
3. You should see:
   - Full blog content
   - Like button
   - Bookmark button
   - View count
   - AI Analysis section
   - Comments section
4. Try liking the blog
5. Add a comment

### Test 6: User Dashboard

1. Click **Dashboard** in navbar
2. You should see:
   - **My Blogs** tab - your created blogs
   - **Bookmarks** tab - bookmarked blogs
3. Try editing or deleting a blog

### Test 7: Logout and Login as Regular User

1. Click **Logout**
2. Click **Login**
3. Enter credentials:
   - Email: `john@example.com`
   - Password: `user123`
4. Notice: No **Admin** link in navbar (regular users can't access admin panel)

### Test 8: Register New User

1. Click **Logout**
2. Click **Sign Up**
3. Fill in:
   - Username: "testuser"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm Password: "test123"
4. Click **Sign Up**
5. You should see success message
6. Login with new credentials

**✅ All Tests Passed!**

---

## 🛠️ Troubleshooting

### Problem: "Can't connect to MySQL server"

**Solution:**
```bash
# Check if MySQL is running
# Windows: Open Services and look for MySQL
# Or restart MySQL:
net stop MySQL80
net start MySQL80
```

### Problem: "Access denied for user 'root'@'localhost'"

**Solution:**
- Check your MySQL password
- Update `backend/.env` with correct password:
```env
DATABASE_URL=mysql+pymysql://root:CORRECT_PASSWORD@localhost/blog_platform
```

### Problem: "Database 'blog_platform' doesn't exist"

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE blog_platform;
source d:/ty_now/mind_bog/database/schema.sql
```

### Problem: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
# Make sure virtual environment is activated
cd backend
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Problem: "Port 5000 is already in use"

**Solution:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Or change port in `backend/run.py`:**
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

Then update `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5001/api';
```

### Problem: "npm: command not found"

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version`

### Problem: "CORS policy error in browser console"

**Solution:**
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check Flask-CORS is installed: `pip list | grep Flask-CORS`

### Problem: "Cannot read property 'user' of undefined"

**Solution:**
- Clear browser localStorage
- Logout and login again
- Or open browser console and run: `localStorage.clear()`

### Problem: Frontend shows blank page

**Solution:**
```bash
# Check browser console for errors (F12)
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📱 Running on Mobile/Other Devices

### 1. Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
# Look for IPv4 Address under your network adapter
# Example: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
# Look for inet under your network interface
```

### 2. Update Frontend API URL

Edit `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://192.168.1.100:5000/api';
```

### 3. Restart Frontend

```bash
# Stop frontend (Ctrl+C)
npm start
```

### 4. Access from Mobile

Open browser on your phone and visit:
```
http://192.168.1.100:3000
```

**Note:** Make sure your phone and computer are on the same WiFi network.

---

## 🔄 Restarting the Application

### To Stop:
- Backend: Press `Ctrl+C` in backend terminal
- Frontend: Press `Ctrl+C` in frontend terminal

### To Start Again:

**Backend:**
```bash
cd d:/ty_now/mind_bog/backend
venv\Scripts\activate
python run.py
```

**Frontend:**
```bash
cd d:/ty_now/mind_bog/frontend
npm start
```

---

## 🧹 Clean Restart (If Something Goes Wrong)

### 1. Reset Database
```bash
mysql -u root -p
DROP DATABASE blog_platform;
source d:/ty_now/mind_bog/database/schema.sql
exit;
```

### 2. Clean Backend
```bash
cd backend
# Delete virtual environment
rm -rf venv
# Recreate
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Clean Frontend
```bash
cd frontend
# Delete node_modules
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### 4. Restart Everything
Follow STEP 2 and STEP 3 again.

---

## 📊 Monitoring & Logs

### Backend Logs
- All requests are logged in the backend terminal
- Check for errors in red text
- 200 = Success, 400 = Bad Request, 401 = Unauthorized, 500 = Server Error

### Frontend Logs
- Open browser DevTools (F12)
- Go to Console tab
- Check for errors or warnings

### Database Logs
```bash
mysql -u root -p
USE blog_platform;

-- View recent blogs
SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5;

-- View recent users
SELECT * FROM users ORDER BY created_at DESC;

-- View blog statistics
SELECT 
    b.title, 
    u.username, 
    b.views, 
    COUNT(DISTINCT l.id) as likes,
    COUNT(DISTINCT c.id) as comments
FROM blogs b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN likes l ON b.id = l.blog_id
LEFT JOIN comments c ON b.id = c.blog_id
GROUP BY b.id;
```

---

## 🎓 Understanding the Flow

### User Registration Flow:
1. User fills form → Frontend sends POST to `/api/auth/register`
2. Backend validates data → Hashes password with bcrypt
3. Creates user in database → Creates profile
4. Returns success message

### Blog Creation Flow:
1. User writes blog → Clicks "Analyze with AI"
2. Frontend sends POST to `/api/ai/analyze`
3. Backend analyzes content → Returns scores
4. User clicks "Create Blog"
5. Frontend sends POST to `/api/blogs`
6. Backend saves blog → Saves AI analysis
7. Redirects to dashboard

### Authentication Flow:
1. User logs in → Frontend sends POST to `/api/auth/login`
2. Backend verifies credentials → Generates JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include token in Authorization header
5. Backend validates token for protected routes

---

## 🚀 Next Steps

Now that everything is running:

1. **Explore the Code:**
   - Backend: `backend/app/routes/` - API endpoints
   - Frontend: `frontend/src/pages/` - React pages
   - Database: `database/schema.sql` - Database structure

2. **Customize:**
   - Change colors in `frontend/src/styles/App.css`
   - Add features in backend routes
   - Modify database schema

3. **Deploy:**
   - Backend: Heroku, AWS, DigitalOcean
   - Frontend: Netlify, Vercel, GitHub Pages
   - Database: AWS RDS, DigitalOcean Managed Database

4. **Enhance:**
   - Add image upload functionality
   - Implement email notifications
   - Add rich text editor
   - Enable social sharing

---

## ✅ Quick Reference

### Start Backend:
```bash
cd backend
venv\Scripts\activate
python run.py
```

### Start Frontend:
```bash
cd frontend
npm start
```

### Access Application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin: admin@blog.com / admin123
- User: john@example.com / user123

---

## 🆘 Still Having Issues?

1. Check all prerequisites are installed
2. Verify MySQL is running
3. Check .env file has correct database password
4. Make sure both terminals are running
5. Clear browser cache and localStorage
6. Try clean restart (see section above)

---

## 🎉 Success!

If you can see the homepage with blogs and login successfully, **congratulations!** 

The Smart AI-Powered Blog Platform is now running on your machine! 🚀

**Happy Coding!** 💻✨
