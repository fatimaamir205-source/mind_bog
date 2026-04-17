# Trending System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:3000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      Home Page                           │   │
│  │                                                           │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐    │   │
│  │  │   Main Content   │  │      Right Sidebar       │    │   │
│  │  │                  │  │                          │    │   │
│  │  │  ┌────────────┐ │  │  ┌──────────────────┐   │    │   │
│  │  │  │ Recent Tab │ │  │  │ Trending Topics  │   │    │   │
│  │  │  └────────────┘ │  │  │  🔥 React        │   │    │   │
│  │  │  ┌────────────┐ │  │  │  🔥 TypeScript   │   │    │   │
│  │  │  │Trending Tab│ │  │  │  🔥 AI           │   │    │   │
│  │  │  │            │ │  │  └──────────────────┘   │    │   │
│  │  │  │ [Blogs]    │ │  │                          │    │   │
│  │  │  │ [Blogs]    │ │  │  ┌──────────────────┐   │    │   │
│  │  │  │ [Blogs]    │ │  │  │ Recommended      │   │    │   │
│  │  │  └────────────┘ │  │  │ Authors          │   │    │   │
│  │  │                  │  │  │  👤 john_doe     │   │    │   │
│  │  └──────────────────┘  │  │  👤 jane_smith   │   │    │   │
│  │                         │  │  👤 bob_wilson   │   │    │   │
│  └─────────────────────────┴──┴──────────────────┘───────┘   │
│                                                                   │
│  API Service (api.ts)                                            │
│  └─> trendingAPI.getAllTrending()                               │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ GET /api/trending/all
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Flask)                             │
│                    http://localhost:5000                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Blueprint: trending_bp (/api/trending/*)                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GET /api/trending/topics                              │    │
│  │  ├─> Query blogs from last 30 days                     │    │
│  │  ├─> Extract and count tags                            │    │
│  │  ├─> Calculate scores                                  │    │
│  │  └─> Return top 10                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GET /api/trending/authors                             │    │
│  │  ├─> Query authors with blogs from last 60 days       │    │
│  │  ├─> Join with likes, comments, follows               │    │
│  │  ├─> Calculate engagement scores                       │    │
│  │  └─> Return top 10                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GET /api/trending/blogs                               │    │
│  │  ├─> Query blogs from last 7 days                      │    │
│  │  ├─> Join with likes and comments                      │    │
│  │  ├─> Calculate trending score with recency factor      │    │
│  │  └─> Return top 10                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  GET /api/trending/all (OPTIMIZED)                     │    │
│  │  ├─> Combines all three queries                        │    │
│  │  ├─> Returns topics, authors, and blogs                │    │
│  │  └─> Single API call for frontend                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
│                      blog_platform                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tables Used:                                                    │
│  ├─ blogs (id, title, content, tags, views, status, ...)       │
│  ├─ users (id, username, email, is_active, ...)                │
│  ├─ profiles (user_id, bio, avatar_url)                         │
│  ├─ likes (user_id, blog_id)                                    │
│  ├─ comments (user_id, blog_id, content)                        │
│  └─ follows (follower_id, following_id)                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Trending Topics Flow
```
Database → Blogs (last 30 days) → Extract Tags → Count & Score → Top 10 → Frontend
```

### 2. Recommended Authors Flow
```
Database → Users + Blogs + Engagement → Calculate Score → Top 10 → Frontend
```

### 3. Trending Blogs Flow
```
Database → Blogs (last 7 days) + Engagement → Apply Recency → Top 10 → Frontend
```

## Scoring Formulas

### Topics
```
Score = (Tag Count × 10) + (Total Views × 2) + (Total Likes × 5) + (Total Comments × 3)
```

### Authors
```
Score = (Blog Count × 15) + (Views × 1) + (Likes × 8) + (Comments × 5) + (Followers × 20)
```

### Blogs
```
Base Score = (Views × 1) + (Likes × 10) + (Comments × 5)
Recency Factor = (168 - Age in Hours) / 168
Trending Score = Base Score × Recency Factor
```

## Time Windows

| Feature | Time Window | Reason |
|---------|-------------|--------|
| Topics | 30 days | Capture medium-term trends |
| Authors | 60 days | Identify consistently active authors |
| Blogs | 7 days | Show fresh, recent content |

## API Response Structure

```json
{
  "topics": [
    {
      "tag": "string",
      "count": number,
      "views": number,
      "likes": number,
      "comments": number,
      "score": number
    }
  ],
  "authors": [
    {
      "id": number,
      "username": "string",
      "avatar_url": "string",
      "blog_count": number,
      "total_views": number,
      "total_likes": number,
      "total_comments": number,
      "followers_count": number,
      "score": number
    }
  ],
  "blogs": [
    {
      "id": number,
      "title": "string",
      "content": "string",
      "image_url": "string",
      "tags": ["string"],
      "views": number,
      "likes_count": number,
      "comments_count": number,
      "created_at": "ISO date",
      "author": {
        "id": number,
        "username": "string",
        "avatar_url": "string"
      },
      "trending_score": number
    }
  ]
}
```

## Performance Metrics

| Endpoint | Expected Response Time | Database Queries |
|----------|----------------------|------------------|
| /trending/topics | 50-150ms | 1 query |
| /trending/authors | 100-300ms | 1 complex query with joins |
| /trending/blogs | 100-250ms | 1 complex query with joins |
| /trending/all | 200-500ms | 3 queries (combined) |

## Caching Strategy (Future Enhancement)

```
┌──────────────┐
│   Request    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     Cache Hit     ┌──────────────┐
│ Check Cache  │ ─────────────────>│ Return Data  │
└──────┬───────┘                    └──────────────┘
       │
       │ Cache Miss
       ▼
┌──────────────┐
│ Query DB     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Store Cache  │ (TTL: 5-15 min)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Return Data  │
└──────────────┘
```

## Security Considerations

✅ Only published blogs included
✅ Only active users shown
✅ No authentication required (public data)
✅ SQL injection prevented (SQLAlchemy ORM)
✅ No sensitive user data exposed
✅ Rate limiting recommended for production

## Scalability Notes

For high-traffic scenarios:
1. Add Redis caching (5-15 min TTL)
2. Create database indexes on:
   - blogs.created_at
   - blogs.status
   - users.is_active
3. Consider materialized views for complex queries
4. Implement pagination if needed
5. Use CDN for static assets

## Monitoring Recommendations

Track these metrics:
- API response times
- Cache hit rates
- Database query performance
- User engagement with trending features
- Click-through rates on recommendations
