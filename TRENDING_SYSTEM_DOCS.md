# Trending System Implementation

## Overview
Complete trending system with backend API endpoints and frontend integration for displaying trending topics, recommended authors, and trending blogs.

## Backend Implementation

### New File: `backend/app/routes/trending.py`

#### Endpoints Created:

1. **GET /api/trending/topics**
   - Returns top 10 trending topics based on recent blog tags
   - Analyzes blogs from last 30 days
   - Scoring algorithm:
     - Tag count × 10
     - Total views × 2
     - Total likes × 5
     - Total comments × 3
   - Response format:
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

2. **GET /api/trending/authors**
   - Returns top 10 recommended authors based on engagement
   - Analyzes authors with published blogs in last 60 days
   - Scoring algorithm:
     - Blog count × 15
     - Total views × 1
     - Total likes × 8
     - Total comments × 5
     - Followers count × 20
   - Response format:
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
           "total_comments": 120,
           "followers_count": 45,
           "score": 2345
         }
       ]
     }
     ```

3. **GET /api/trending/blogs**
   - Returns top 10 trending blogs from last 7 days
   - Scoring algorithm with recency factor:
     - Base score = (views × 1) + (likes × 10) + (comments × 5)
     - Recency factor = (168 - age_in_hours) / 168
     - Final score = base_score × recency_factor
   - Response format:
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

4. **GET /api/trending/all**
   - Returns all trending data in one request (optimized for frontend)
   - Combines topics, authors, and blogs
   - Response format:
     ```json
     {
       "topics": [...],
       "authors": [...],
       "blogs": [...]
     }
     ```

### Algorithm Details

#### Trending Topics
- Time window: Last 30 days
- Filters: Only published blogs
- Metrics tracked: count, views, likes, comments
- Sorted by: Weighted score (descending)

#### Recommended Authors
- Time window: Last 60 days
- Filters: Active users with published blogs
- Metrics tracked: blog count, views, likes, comments, followers
- Sorted by: Weighted engagement score (descending)

#### Trending Blogs
- Time window: Last 7 days
- Filters: Published blogs only
- Recency boost: Newer blogs get higher scores
- Metrics tracked: views, likes, comments, age
- Sorted by: Trending score with recency factor (descending)

## Frontend Integration

### Updated Files:

1. **`frontend_v2/client/src/services/api.ts`**
   - Added `trendingAPI` object with 4 methods:
     - `getTrendingTopics()`
     - `getRecommendedAuthors()`
     - `getTrendingBlogs()`
     - `getAllTrending()`

2. **`frontend_v2/client/src/pages/Home.tsx`**
   - Integrated trending data fetching
   - Added state for trending topics and recommended authors
   - Updated UI to display:
     - Trending topics as clickable tags
     - Recommended authors with avatars, blog count, and follower count
     - Loading skeletons for better UX
     - Empty states when no data available
   - Uses `getAllTrending()` for optimized single API call

### UI Features:

#### Trending Topics Section
- Displays top 10 trending tags
- Shows tag name with hover effect
- Tooltip shows blog count
- Loading skeleton animation
- Empty state message

#### Recommended Authors Section
- Displays top 10 authors
- Shows avatar (or initial if no avatar)
- Username with link to profile
- Blog count and follower count
- Hover effect for better interaction
- Loading skeleton animation
- Empty state message

#### Trending Blogs Tab
- Uses real trending data from backend
- Displays blogs with trending score
- Sorted by engagement and recency
- Same BlogCard component for consistency

## Database Requirements

The system uses existing tables:
- `blogs` - Blog posts with tags, views, status
- `users` - User accounts
- `profiles` - User avatars
- `likes` - Blog likes
- `comments` - Blog comments
- `follows` - User follows

No new tables required!

## Performance Considerations

1. **Caching Recommendations**:
   - Consider caching trending data for 5-15 minutes
   - Reduces database load for high-traffic sites
   - Can be implemented with Redis or in-memory cache

2. **Query Optimization**:
   - Uses JOIN operations efficiently
   - Filters by date to limit dataset
   - Groups and aggregates in database
   - Limits results to top 10

3. **Frontend Optimization**:
   - Single API call with `/trending/all`
   - Reduces network requests
   - Faster page load

## Testing the System

### Backend Testing:
```bash
# Start backend
cd backend
python run.py

# Test endpoints
curl http://localhost:5000/api/trending/topics
curl http://localhost:5000/api/trending/authors
curl http://localhost:5000/api/trending/blogs
curl http://localhost:5000/api/trending/all
```

### Frontend Testing:
```bash
# Start frontend
cd frontend_v2
npm run dev

# Visit http://localhost:3000
# Check:
# - Trending Topics section (right sidebar)
# - Recommended Authors section (right sidebar)
# - Trending tab (main content area)
```

## Future Enhancements

1. **Personalization**:
   - Recommend topics based on user's reading history
   - Suggest authors based on followed users
   - Filter trending by user preferences

2. **Time Range Filters**:
   - Allow users to select time range (24h, 7d, 30d, all time)
   - Add query parameters for custom ranges

3. **Category-based Trending**:
   - Trending within specific categories
   - Technology, Business, Lifestyle, etc.

4. **Real-time Updates**:
   - WebSocket integration for live trending updates
   - Auto-refresh trending data

5. **Analytics Dashboard**:
   - Track trending history
   - Visualize trending patterns
   - Export trending reports

## API Response Times

Expected response times (without caching):
- `/trending/topics`: 50-150ms
- `/trending/authors`: 100-300ms
- `/trending/blogs`: 100-250ms
- `/trending/all`: 200-500ms

With caching: 5-20ms for all endpoints

## Error Handling

All endpoints include try-catch blocks:
- Returns 500 status on error
- Includes error message in response
- Frontend handles errors gracefully with empty states

## Security

- No authentication required (public data)
- Only published blogs included
- Only active users shown
- SQL injection prevented (SQLAlchemy ORM)
- No sensitive data exposed

## Deployment Notes

1. Ensure all dependencies are installed:
   ```bash
   pip install flask sqlalchemy flask-sqlalchemy
   ```

2. Blueprint is registered in `app/__init__.py`

3. No database migrations needed (uses existing tables)

4. Frontend API calls use proxy in development

5. Update CORS settings if needed for production

## Success Metrics

Track these metrics to measure success:
- Click-through rate on trending topics
- Author profile visits from recommendations
- Engagement on trending blogs
- Time spent on homepage
- User retention and return visits
