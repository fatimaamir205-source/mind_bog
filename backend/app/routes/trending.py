from flask import Blueprint, jsonify
from app import db
from app.models import Blog, User, Like, Comment, Follow
from sqlalchemy import func, desc
from datetime import datetime, timedelta

trending_bp = Blueprint('trending', __name__)

@trending_bp.route('/topics', methods=['GET'])
def get_trending_topics():
    """Get trending topics based on recent blog tags"""
    try:
        # Get blogs from last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        # Get all tags from recent published blogs
        recent_blogs = Blog.query.filter(
            Blog.status == 'published',
            Blog.created_at >= thirty_days_ago
        ).all()
        
        # Count tag occurrences with engagement metrics
        tag_stats = {}
        for blog in recent_blogs:
            if blog.tags:
                tags = [t.strip() for t in blog.tags.split(',') if t.strip()]
                for tag in tags:
                    if tag not in tag_stats:
                        tag_stats[tag] = {
                            'count': 0,
                            'views': 0,
                            'likes': 0,
                            'comments': 0
                        }
                    tag_stats[tag]['count'] += 1
                    tag_stats[tag]['views'] += blog.views
                    tag_stats[tag]['likes'] += len(blog.likes)
                    tag_stats[tag]['comments'] += len(blog.comments)
        
        # Calculate trending score and format results
        trending_topics = []
        for tag, stats in tag_stats.items():
            score = (stats['count'] * 10) + (stats['views'] * 2) + (stats['likes'] * 5) + (stats['comments'] * 3)
            trending_topics.append({
                'tag': tag,
                'count': stats['count'],
                'views': stats['views'],
                'likes': stats['likes'],
                'comments': stats['comments'],
                'score': score
            })
        
        # Sort by score and return top 10
        trending_topics.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'topics': trending_topics[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trending_bp.route('/authors', methods=['GET'])
def get_recommended_authors():
    """Get recommended authors based on engagement and activity"""
    try:
        # Get authors with published blogs in last 60 days
        sixty_days_ago = datetime.utcnow() - timedelta(days=60)
        
        # Query authors with their stats
        authors = db.session.query(
            User.id,
            User.username,
            func.count(Blog.id).label('blog_count'),
            func.sum(Blog.views).label('total_views'),
            func.count(Like.id).label('total_likes'),
            func.count(Comment.id).label('total_comments'),
            func.count(Follow.id).label('followers_count')
        ).join(Blog, Blog.user_id == User.id)\
        .outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Comment, Comment.blog_id == Blog.id)\
        .outerjoin(Follow, Follow.following_id == User.id)\
        .filter(
            Blog.status == 'published',
            Blog.created_at >= sixty_days_ago,
            User.is_active == True
        ).group_by(User.id, User.username).all()
        
        # Calculate author scores
        author_list = []
        for author in authors:
            # Get avatar from profile
            user = User.query.get(author.id)
            avatar_url = user.profile.avatar_url if user.profile else None
            
            # Calculate engagement score
            views = author.total_views or 0
            likes = author.total_likes or 0
            comments = author.total_comments or 0
            followers = author.followers_count or 0
            blogs = author.blog_count or 0
            
            score = (blogs * 15) + (views * 1) + (likes * 8) + (comments * 5) + (followers * 20)
            
            author_list.append({
                'id': author.id,
                'username': author.username,
                'avatar_url': avatar_url,
                'blog_count': blogs,
                'total_views': views,
                'total_likes': likes,
                'total_comments': comments,
                'followers_count': followers,
                'score': score
            })
        
        # Sort by score and return top 10
        author_list.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'authors': author_list[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trending_bp.route('/blogs', methods=['GET'])
def get_trending_blogs():
    """Get trending blogs based on recent engagement"""
    try:
        # Get blogs from last 7 days
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        # Query blogs with engagement metrics
        blogs = db.session.query(
            Blog,
            func.count(Like.id).label('likes_count'),
            func.count(Comment.id).label('comments_count')
        ).outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Comment, Comment.blog_id == Blog.id)\
        .filter(
            Blog.status == 'published',
            Blog.created_at >= seven_days_ago
        ).group_by(Blog.id).all()
        
        # Calculate trending scores
        trending_blogs = []
        for blog, likes_count, comments_count in blogs:
            # Calculate recency factor (newer = higher score)
            age_hours = (datetime.utcnow() - blog.created_at).total_seconds() / 3600
            recency_factor = max(1, 168 - age_hours) / 168  # 168 hours = 7 days
            
            # Calculate engagement score
            base_score = (blog.views * 1) + (likes_count * 10) + (comments_count * 5)
            trending_score = base_score * recency_factor
            
            # Get author info
            author = User.query.get(blog.user_id)
            avatar_url = author.profile.avatar_url if author and author.profile else None
            
            trending_blogs.append({
                'id': blog.id,
                'title': blog.title,
                'content': blog.content[:200] + '...' if len(blog.content) > 200 else blog.content,
                'image_url': blog.image_url,
                'tags': blog.tags.split(',') if blog.tags else [],
                'views': blog.views,
                'likes_count': likes_count,
                'comments_count': comments_count,
                'created_at': blog.created_at.isoformat(),
                'author': {
                    'id': author.id,
                    'username': author.username,
                    'avatar_url': avatar_url
                } if author else None,
                'trending_score': round(trending_score, 2)
            })
        
        # Sort by trending score and return top 10
        trending_blogs.sort(key=lambda x: x['trending_score'], reverse=True)
        
        return jsonify({
            'blogs': trending_blogs[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trending_bp.route('/all', methods=['GET'])
def get_all_trending():
    """Get all trending data in one request"""
    try:
        # Get trending topics
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_blogs = Blog.query.filter(
            Blog.status == 'published',
            Blog.created_at >= thirty_days_ago
        ).all()
        
        tag_stats = {}
        for blog in recent_blogs:
            if blog.tags:
                tags = [t.strip() for t in blog.tags.split(',') if t.strip()]
                for tag in tags:
                    if tag not in tag_stats:
                        tag_stats[tag] = {'count': 0, 'views': 0, 'likes': 0, 'comments': 0}
                    tag_stats[tag]['count'] += 1
                    tag_stats[tag]['views'] += blog.views
                    tag_stats[tag]['likes'] += len(blog.likes)
                    tag_stats[tag]['comments'] += len(blog.comments)
        
        trending_topics = []
        for tag, stats in tag_stats.items():
            score = (stats['count'] * 10) + (stats['views'] * 2) + (stats['likes'] * 5) + (stats['comments'] * 3)
            trending_topics.append({
                'tag': tag,
                'count': stats['count'],
                'score': score
            })
        trending_topics.sort(key=lambda x: x['score'], reverse=True)
        
        # Get recommended authors
        sixty_days_ago = datetime.utcnow() - timedelta(days=60)
        authors = db.session.query(
            User.id,
            User.username,
            func.count(Blog.id).label('blog_count'),
            func.sum(Blog.views).label('total_views'),
            func.count(Like.id).label('total_likes'),
            func.count(Follow.id).label('followers_count')
        ).join(Blog, Blog.user_id == User.id)\
        .outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Follow, Follow.following_id == User.id)\
        .filter(
            Blog.status == 'published',
            Blog.created_at >= sixty_days_ago,
            User.is_active == True
        ).group_by(User.id, User.username).all()
        
        author_list = []
        for author in authors:
            user = User.query.get(author.id)
            avatar_url = user.profile.avatar_url if user.profile else None
            
            views = author.total_views or 0
            likes = author.total_likes or 0
            followers = author.followers_count or 0
            blogs = author.blog_count or 0
            
            score = (blogs * 15) + (views * 1) + (likes * 8) + (followers * 20)
            
            author_list.append({
                'id': author.id,
                'username': author.username,
                'avatar_url': avatar_url,
                'blog_count': blogs,
                'followers_count': followers,
                'score': score
            })
        author_list.sort(key=lambda x: x['score'], reverse=True)
        
        # Get trending blogs
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        blogs = db.session.query(
            Blog,
            func.count(Like.id).label('likes_count'),
            func.count(Comment.id).label('comments_count')
        ).outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Comment, Comment.blog_id == Blog.id)\
        .filter(
            Blog.status == 'published',
            Blog.created_at >= seven_days_ago
        ).group_by(Blog.id).all()
        
        trending_blogs = []
        for blog, likes_count, comments_count in blogs:
            age_hours = (datetime.utcnow() - blog.created_at).total_seconds() / 3600
            recency_factor = max(1, 168 - age_hours) / 168
            base_score = (blog.views * 1) + (likes_count * 10) + (comments_count * 5)
            trending_score = base_score * recency_factor
            
            author = User.query.get(blog.user_id)
            avatar_url = author.profile.avatar_url if author and author.profile else None
            
            trending_blogs.append({
                'id': blog.id,
                'title': blog.title,
                'content': blog.content[:200] + '...' if len(blog.content) > 200 else blog.content,
                'image_url': blog.image_url,
                'tags': blog.tags.split(',') if blog.tags else [],
                'views': blog.views,
                'likes_count': likes_count,
                'comments_count': comments_count,
                'created_at': blog.created_at.isoformat(),
                'author': {
                    'id': author.id,
                    'username': author.username,
                    'avatar_url': avatar_url
                } if author else None,
                'trending_score': round(trending_score, 2)
            })
        trending_blogs.sort(key=lambda x: x['trending_score'], reverse=True)
        
        return jsonify({
            'topics': trending_topics[:10],
            'authors': author_list[:10],
            'blogs': trending_blogs[:10]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
