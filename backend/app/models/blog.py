from app import db
from datetime import datetime

class Blog(db.Model):
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    tags = db.Column(db.String(255))  # Comma-separated
    status = db.Column(db.String(20), default='draft')  # draft or published
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ai_analysis = db.relationship('AIAnalysis', backref='blog', uselist=False, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='blog', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='blog', lazy=True, cascade='all, delete-orphan')
    bookmarks = db.relationship('Bookmark', backref='blog', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_author=True):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url or '',
            'tags': self.tags.split(',') if self.tags else [],
            'status': self.status,
            'views': self.views,
            'likes_count': len(self.likes),
            'comments_count': len(self.comments),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        if include_author and self.author:
            data['author'] = {
                'id': self.author.id,
                'username': self.author.username
            }
        return data

class AIAnalysis(db.Model):
    __tablename__ = 'ai_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey('blogs.id'), nullable=False)
    quality_score = db.Column(db.Integer)
    grammar_feedback = db.Column(db.Text)
    seo_feedback = db.Column(db.Text)
    readability_score = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'blog_id': self.blog_id,
            'quality_score': self.quality_score,
            'grammar_feedback': self.grammar_feedback,
            'seo_feedback': self.seo_feedback,
            'readability_score': self.readability_score,
            'created_at': self.created_at.isoformat()
        }
