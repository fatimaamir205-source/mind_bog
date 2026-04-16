import os
from dotenv import load_dotenv

load_dotenv()

print("Environment Variables Check:")
print("=" * 50)
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"JWT_SECRET_KEY: {os.getenv('JWT_SECRET_KEY')}")
print(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY')}")
print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}")
print("=" * 50)

# Test database URL format
db_url = os.getenv('DATABASE_URL') or 'mysql+pymysql://root:@localhost/blog_platform'
print(f"\nUsing Database URL: {db_url}")

if db_url.startswith('mysql'):
    print("✓ MySQL database detected")
elif db_url.startswith('postgresql'):
    print("✗ PostgreSQL detected - This is wrong!")
else:
    print("✗ Unknown database type")
