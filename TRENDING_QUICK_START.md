# Trending System - Quick Start Guide

## 🚀 What Was Built

A complete trending system with:
- **Trending Topics**: Top 10 tags based on recent blog activity
- **Recommended Authors**: Top 10 authors by engagement metrics
- **Trending Blogs**: Top 10 blogs from the last week with recency boost

## 📁 Files Created/Modified

### Backend (New)
- `backend/app/routes/trending.py` - All trending endpoints

### Backend (Modified)
- `backend/app/__init__.py` - Registered trending blueprint

### Frontend (Modified)
- `frontend_v2/client/src/services/api.ts` - Added trendingAPI
- `frontend_v2/client/src/pages/Home.tsx` - Integrated trending data

### Documentation (New)
- `TRENDING_SYSTEM_DOCS.md` - Complete system documentation
- `backend/test_trending.py` - API testing script

## 🎯 How to Use

### 1. Start Backend
```bash
cd backend
python run.py
```

Backend runs on: http://localhost:5000

### 2. Start Frontend
```bash
cd frontend_v2
npm run dev
```

Frontend runs on: http://localhost:3000

### 3. Test the System

#### Option A: Use the Test Script
```bash
cd backend
pip install requests  # if not installed
python test_trending.py
```

#### Option B: Manual API Testing
```bash
# Trending Topics
curl http://localhost:5000/api/trending/topics

# Recommended Authors
curl http://localhost:5000/api/trending/authors

# Trending Blogs
curl http://localhost:5000/api/trending/blogs

# All Trending Data (Optimized)
curl http://localhost:5000/api/trending/all
```

#### Option C: Frontend Testing
1. Open http://localhost:3000
2. Check the right sidebar for:
   - **Trending Topics** section (with flame icon)
   - **Recommended Authors** section (with users icon)
3. Click the **Trending** tab to see trending blogs

## 📊 API Endpoints

### GET /api/trending/topics
Returns top 10 trending topics from last 30 days

**Response:**
```json
{
  "topics": [
    {
      "tag": "React",
      "count": 15,
      "views": 1200,
      "likes": 85,
      "comments": 42,
      "score": 1234
    }
  ]
}
```

### GET /api/trending/authors
Returns top 10 recommended authors from last 60 days

**Response:**
```json
{
  "authors": [
    {
      "id": 1,
      "username": "john_doe",
      "avatar_url": "/uploads/avatars/...",
      "blog_count": 12,
      "total_views": 5000,
      "total_likes": 250,
      "followers_count": 45,
      "score": 2345
    }
  ]
}
```

### GET /api/trending/blogs
Returns top 10 trending blogs from last 7 days

**Response:**
```json
{
  "blogs": [
    {
      "id": 1,
      "title": "Blog Title",
      "content": "Excerpt...",
      "image_url": "/uploads/blogs/...",
      "tags": ["React", "TypeScript"],
      "views": 500,
      "likes_count": 45,
      "comments_count": 12,
      "created_at": "2024-01-15T10:30:00",
      "author": {
        "id": 1,
        "username": "john_doe",
        "avatar_url": "/uploads/avatars/..."
      },
      "trending_score": 567.89
    }
  ]
}
```

### GET /api/trending/all
Returns all trending data in one request (RECOMMENDED)

**Response:**
```json
{
  "topics": [...],
  "authors": [...],
  "blogs": [...]
}
```

## 🎨 Frontend Integration

The Home page now displays:

1. **Trending Topics** (Right Sidebar)
   - Clickable tag buttons
   - Shows blog count on hover
   - Loading skeleton while fetching

2. **Recommended Authors** (Right Sidebar)
   - Author avatar or initial
   - Username (clickable to profile)
   - Blog count and follower count
   - Loading skeleton while fetching

3. **Trending Blogs** (Main Content - Trending Tab)
   - Uses BlogCard component
   - Shows trending score
   - Sorted by engagement + recency

## 🔧 Scoring Algorithms

### Topics Score
```
score = (count × 10) + (views × 2) + (likes × 5) + (comments × 3)
```

### Authors Score
```
score = (blogs × 15) + (views × 1) + (likes × 8) + (comments × 5) + (followers × 20)
```

### Blogs Score
```
base_score = (views × 1) + (likes × 10) + (comments × 5)
recency_factor = (168 - age_hours) / 168
trending_score = base_score × recency_factor
```

## 📝 Notes

- No database migrations needed (uses existing tables)
- All endpoints are public (no auth required)
- Only published blogs and active users are included
- Results are limited to top 10 for performance
- Frontend uses single `/trending/all` call for efficiency

## 🐛 Troubleshooting

### Backend not starting?
- Check if MySQL is running
- Verify .env configuration
- Check port 5000 is available

### Frontend not showing data?
- Check backend is running on port 5000
- Open browser console for errors
- Verify API proxy in vite.config.ts

### No trending data showing?
- Make sure you have published blogs in the database
- Check blogs have tags set
- Verify blogs are within the time windows (7-60 days)

### Empty states showing?
This is normal if:
- Database is empty or has only old blogs
- No blogs have tags
- No user interactions (likes, comments)

## ✅ Success Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access http://localhost:3000
- [ ] Trending Topics section visible
- [ ] Recommended Authors section visible
- [ ] Trending tab works
- [ ] API endpoints return data
- [ ] No console errors

## 🎉 You're Done!

The trending system is now fully integrated and working. Users can:
- Discover popular topics
- Find active authors
- See what's trending right now

Enjoy your new trending features! 🚀
