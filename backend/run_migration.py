#!/usr/bin/env python3
"""
Automatic Database Migration Script
Adds fact-checking columns to the database
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    """Run database migration to add fact-checking columns"""
    
    print("=" * 60)
    print("Database Migration: Add Fact-Checking Support")
    print("=" * 60)
    print()
    
    try:
        import pymysql
    except ImportError:
        print("❌ Error: pymysql not installed")
        print()
        print("Install it with:")
        print("  pip install pymysql")
        print()
        return False
    
    # Get database URL from environment
    db_url = os.getenv('BLOG_DATABASE_URL') or os.getenv('DATABASE_URL')
    
    if not db_url:
        print("❌ Error: No database URL found in .env")
        print()
        print("Add to backend/.env:")
        print("  DATABASE_URL=mysql+pymysql://root:password@localhost/blog_platform")
        print()
        return False
    
    # Parse database URL
    try:
        # Remove mysql+pymysql:// prefix
        db_url = db_url.replace('mysql+pymysql://', '')
        
        # Parse: user:password@host/database
        if '@' in db_url:
            auth, rest = db_url.split('@')
            if ':' in auth:
                user, password = auth.split(':', 1)
            else:
                user = auth
                password = ''
            
            if '/' in rest:
                host, database = rest.split('/', 1)
            else:
                host = rest
                database = 'blog_platform'
        else:
            user = 'root'
            password = ''
            host = 'localhost'
            database = 'blog_platform'
        
        print(f"Connecting to database...")
        print(f"  Host: {host}")
        print(f"  Database: {database}")
        print(f"  User: {user}")
        print()
        
    except Exception as e:
        print(f"❌ Error parsing database URL: {e}")
        return False
    
    # Connect to database
    try:
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✓ Connected to database")
        print()
        
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        print()
        print("Check:")
        print("  1. MySQL is running")
        print("  2. Database exists")
        print("  3. Credentials are correct")
        print()
        return False
    
    try:
        with connection.cursor() as cursor:
            print("Running migration...")
            print("-" * 60)
            
            # Check if is_fake_news column exists in blogs table
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s
                AND TABLE_NAME = 'blogs' 
                AND COLUMN_NAME = 'is_fake_news'
            """, (database,))
            
            result = cursor.fetchone()
            
            if result['count'] == 0:
                print("Adding is_fake_news column to blogs table...")
                cursor.execute("""
                    ALTER TABLE blogs 
                    ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER status
                """)
                print("✓ Added is_fake_news to blogs")
            else:
                print("✓ is_fake_news column already exists in blogs")
            
            # Check and add credibility_score to ai_analysis
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s
                AND TABLE_NAME = 'ai_analysis' 
                AND COLUMN_NAME = 'credibility_score'
            """, (database,))
            
            result = cursor.fetchone()
            
            if result['count'] == 0:
                print("Adding credibility_score column to ai_analysis table...")
                cursor.execute("""
                    ALTER TABLE ai_analysis 
                    ADD COLUMN credibility_score INT AFTER readability_score
                """)
                print("✓ Added credibility_score to ai_analysis")
            else:
                print("✓ credibility_score column already exists in ai_analysis")
            
            # Check and add is_fake_news to ai_analysis
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s
                AND TABLE_NAME = 'ai_analysis' 
                AND COLUMN_NAME = 'is_fake_news'
            """, (database,))
            
            result = cursor.fetchone()
            
            if result['count'] == 0:
                print("Adding is_fake_news column to ai_analysis table...")
                cursor.execute("""
                    ALTER TABLE ai_analysis 
                    ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER credibility_score
                """)
                print("✓ Added is_fake_news to ai_analysis")
            else:
                print("✓ is_fake_news column already exists in ai_analysis")
            
            # Check and add fact_check_feedback to ai_analysis
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s
                AND TABLE_NAME = 'ai_analysis' 
                AND COLUMN_NAME = 'fact_check_feedback'
            """, (database,))
            
            result = cursor.fetchone()
            
            if result['count'] == 0:
                print("Adding fact_check_feedback column to ai_analysis table...")
                cursor.execute("""
                    ALTER TABLE ai_analysis 
                    ADD COLUMN fact_check_feedback TEXT AFTER is_fake_news
                """)
                print("✓ Added fact_check_feedback to ai_analysis")
            else:
                print("✓ fact_check_feedback column already exists in ai_analysis")
            
            # Update existing records
            print("Updating existing records...")
            cursor.execute("UPDATE blogs SET is_fake_news = FALSE WHERE is_fake_news IS NULL")
            cursor.execute("UPDATE ai_analysis SET is_fake_news = FALSE WHERE is_fake_news IS NULL")
            print("✓ Updated existing records")
            
            # Create index
            print("Creating index...")
            try:
                cursor.execute("CREATE INDEX idx_is_fake_news ON blogs(is_fake_news)")
                print("✓ Created index on is_fake_news")
            except:
                print("✓ Index already exists")
            
            # Commit changes
            connection.commit()
            
            print()
            print("=" * 60)
            print("✅ Migration completed successfully!")
            print("=" * 60)
            print()
            
            # Show table structure
            print("Updated table structure:")
            print()
            print("blogs table:")
            cursor.execute("DESCRIBE blogs")
            for row in cursor.fetchall():
                if row['Field'] in ['status', 'is_fake_news', 'views']:
                    print(f"  {row['Field']}: {row['Type']}")
            
            print()
            print("ai_analysis table:")
            cursor.execute("DESCRIBE ai_analysis")
            for row in cursor.fetchall():
                if row['Field'] in ['readability_score', 'credibility_score', 'is_fake_news', 'fact_check_feedback']:
                    print(f"  {row['Field']}: {row['Type']}")
            
            print()
            print("✓ Database is ready for fact-checking!")
            print()
            
            return True
            
    except Exception as e:
        print()
        print(f"❌ Error during migration: {e}")
        print()
        connection.rollback()
        return False
        
    finally:
        connection.close()

if __name__ == "__main__":
    print()
    print("🔧 Database Migration Tool")
    print()
    
    success = run_migration()
    
    if success:
        print("🎉 Success! You can now:")
        print("  ✓ Create blog posts")
        print("  ✓ Use fact-checking")
        print("  ✓ Detect fake news")
        print()
        sys.exit(0)
    else:
        print("⚠️  Migration failed. Please:")
        print("  1. Check error messages above")
        print("  2. Verify MySQL is running")
        print("  3. Check database credentials")
        print("  4. Try manual migration: FIX_DATABASE_NOW.md")
        print()
        sys.exit(1)
