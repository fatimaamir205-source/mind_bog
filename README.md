# Smart AI-Powered Blog Platform

A complete full-stack blog platform with AI content analysis, built with React, Flask, and MySQL.

## 🚀 Features

- **Authentication System**: JWT-based auth with signup/login
- **Blog Management**: Create, edit, delete, publish/draft blogs
- **AI Content Analysis**: Automatic quality, grammar, SEO, and readability scoring
- **Interaction System**: Comments, likes, and bookmarks
- **Search & Filter**: Search blogs by title/content, filter by tags, sort by date/popularity
- **Admin Dashboard**: User management, blog moderation, platform statistics
- **Analytics**: View counts, likes tracking, user activity stats
- **Responsive Design**: Mobile-first, modern UI

## 🛠️ Tech Stack

### Backend
- Python 3.8+
- Flask (REST API)
- SQLAlchemy (ORM)
- MySQL
- JWT Authentication
- Bcrypt (Password hashing)
- OpenAI API (with mock fallback)

### Frontend
- React 18
- React Router
- Axios
- Context API (State management)
- CSS3 (Responsive design)

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- MySQL 5.7 or higher
- npm or yarn

## 🔧 Installation & Setup

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/schema.sql

# Or manually create database
CREATE DATABASE blog_platform;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env file with your settings:
# - DATABASE_URL (MySQL connection string)
# - JWT_SECRET_KEY (random secret key)
# - OPENAI_API_KEY (optional, uses mock if empty)

# Run the application
python run.py
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 🔑 Demo Credentials

### Admin Account
- Email: `admin@blog.com`
- Password: `admin123`

### Regular User
- Email: `john@example.com`
- Password: `user123`

## 📁 Project Structure

```
mind_bog/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   │   ├── user.py
│   │   │   ├── blog.py
│   │   │   └── interaction.py
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── blogs.py
│   │   │   ├── comments.py
│   │   │   ├── admin.py
│   │   │   └── ai.py
│   │   ├── ai/              # AI analysis service
│   │   │   └── analyzer.py
│   │   └── __init__.py
│   ├── config.py
│   ├── run.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.js
│   │   │   └── BlogCard.js
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── BlogDetail.js
│   │   │   ├── CreateBlog.js
│   │   │   ├── Dashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/         # State management
│   │   │   └── AuthContext.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── database/
    └── schema.sql           # Database schema with sample data
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Blogs
- `GET /api/blogs` - Get all blogs (with search, filter, sort)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)
- `POST /api/blogs/:id/like` - Like/unlike blog (protected)
- `POST /api/blogs/:id/bookmark` - Bookmark/unbookmark (protected)
- `GET /api/blogs/my-blogs` - Get user's blogs (protected)
- `GET /api/blogs/bookmarks` - Get bookmarked blogs (protected)

### Comments
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments/blog/:id` - Get blog comments
- `DELETE /api/comments/:id` - Delete comment (protected)

### AI Analysis
- `POST /api/ai/analyze` - Analyze content
- `GET /api/ai/blog/:id/analysis` - Get blog analysis

### Admin
- `GET /api/admin/stats` - Get platform statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id/toggle-active` - Activate/deactivate user (admin)
- `GET /api/admin/blogs` - Get all blogs (admin)
- `DELETE /api/admin/blogs/:id` - Delete any blog (admin)

## 🤖 AI Content Analysis

The platform includes AI-powered content analysis that provides:

- **Quality Score** (0-100): Overall content quality assessment
- **Readability Score** (0-100): How easy the content is to read
- **Grammar Feedback**: Suggestions for grammar improvements
- **SEO Suggestions**: Tips to optimize content for search engines

The system uses OpenAI API when available, or falls back to a mock analyzer with rule-based scoring.

## 🗄️ Database Schema

### Tables
- `users` - User accounts and authentication
- `profiles` - User profile information
- `blogs` - Blog posts
- `ai_analysis` - AI analysis results for blogs
- `comments` - Blog comments
- `likes` - Blog likes
- `bookmarks` - User bookmarks

## 🎨 Features Walkthrough

### For Users
1. **Register/Login** - Create account or login
2. **Browse Blogs** - View all published blogs with search and filters
3. **Read Blogs** - View full blog with comments and AI analysis
4. **Create Blogs** - Write new blogs with AI analysis
5. **Manage Blogs** - Edit, delete, publish/draft your blogs
6. **Interact** - Like, comment, and bookmark blogs
7. **Dashboard** - View your blogs and bookmarks

### For Admins
1. **View Statistics** - Platform metrics and analytics
2. **Manage Users** - Activate/deactivate user accounts
3. **Moderate Blogs** - Delete inappropriate content
4. **Monitor Activity** - Track most active users and popular blogs

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration
- Input validation

## 🚀 Deployment Tips

### Backend
- Set strong JWT_SECRET_KEY in production
- Use production database credentials
- Enable HTTPS
- Set FLASK_ENV=production
- Use gunicorn or uwsgi for production server

### Frontend
- Run `npm run build` for production build
- Serve static files with nginx or similar
- Update API_URL to production backend URL

### Database
- Regular backups
- Enable SSL connections
- Optimize indexes for performance
- Monitor query performance

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://user:password@localhost/blog_platform
JWT_SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key-or-leave-empty
FLASK_ENV=development
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### CORS Error
- Backend must be running on port 5000
- Frontend must be running on port 3000
- Check Flask-CORS configuration

### JWT Token Error
- Clear localStorage in browser
- Re-login to get new token

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built as a complete full-stack demonstration project.

## 🙏 Acknowledgments

- Flask documentation
- React documentation
- OpenAI API
- MySQL documentation
