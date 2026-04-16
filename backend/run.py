from app import create_app, db
from app.models import User, Profile, Blog, AIAnalysis, Comment, Like, Bookmark

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Profile': Profile,
        'Blog': Blog,
        'AIAnalysis': AIAnalysis,
        'Comment': Comment,
        'Like': Like,
        'Bookmark': Bookmark
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
