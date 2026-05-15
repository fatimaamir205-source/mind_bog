from flask import Blueprint, jsonify, request
from app import db
from app.models import Blog, User, Like, Comment, Follow
from sqlalchemy import func, desc
from datetime import datetime, timedelta

trending_bp = Blueprint('trending', __name__)

@trending_bp.route('/topics', methods=['GET'])
def get_trending_topics():
    """Get trending topics based on blog tags (all time)"""
    try:
        # Get all published blogs
        recent_blogs = Blog.query.filter(Blog.status == 'published').all()
        
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
    """Get recommended authors based on engagement and activity (all time)"""
    try:
        # Query authors with their stats (all time)
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
    """Get trending blogs based on views and likes (all time) with pagination"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Query all published blogs with engagement metrics
        blogs = db.session.query(
            Blog,
            func.count(Like.id).label('likes_count'),
            func.count(Comment.id).label('comments_count')
        ).outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Comment, Comment.blog_id == Blog.id)\
        .filter(Blog.status == 'published')\
        .group_by(Blog.id).all()
        
        # Calculate trending scores based on views and likes
        trending_blogs = []
        for blog, likes_count, comments_count in blogs:
            # Calculate engagement score: prioritize views and likes
            trending_score = (blog.views * 2) + (likes_count * 10) + (comments_count * 3)
            
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
        
        # Sort by trending score
        trending_blogs.sort(key=lambda x: x['trending_score'], reverse=True)
        
        # Apply pagination
        total = len(trending_blogs)
        start = (page - 1) * per_page
        end = start + per_page
        paginated_blogs = trending_blogs[start:end]
        
        return jsonify({
            'blogs': paginated_blogs,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trending_bp.route('/all', methods=['GET'])
def get_all_trending():
    """Get all trending data in one request"""
    try:
        # Get trending topics (all time)
        recent_blogs = Blog.query.filter(Blog.status == 'published').all()
        
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
        
        # Get recommended authors (all time)
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
        
        # Get trending blogs (all time, sorted by views and likes)
        blogs = db.session.query(
            Blog,
            func.count(Like.id).label('likes_count'),
            func.count(Comment.id).label('comments_count')
        ).outerjoin(Like, Like.blog_id == Blog.id)\
        .outerjoin(Comment, Comment.blog_id == Blog.id)\
        .filter(Blog.status == 'published')\
        .group_by(Blog.id).all()
        
        trending_blogs = []
        for blog, likes_count, comments_count in blogs:
            # Calculate engagement score: prioritize views and likes
            trending_score = (blog.views * 2) + (likes_count * 10) + (comments_count * 3)
            
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
