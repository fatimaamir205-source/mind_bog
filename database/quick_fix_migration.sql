-- Quick Fix: Add is_fake_news column to blogs table
-- Run this immediately to fix the error

USE blog_platform;

-- Check if column already exists (safe to run multiple times)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'blog_platform' 
    AND TABLE_NAME = 'blogs' 
    AND COLUMN_NAME = 'is_fake_news'
);

-- Add column if it doesn't exist
SET @query = IF(@col_exists = 0,
    'ALTER TABLE blogs ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER status',
    'SELECT "Column is_fake_news already exists" AS message'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add fact-checking columns to ai_analysis table
SET @col_exists_cred = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'blog_platform' 
    AND TABLE_NAME = 'ai_analysis' 
    AND COLUMN_NAME = 'credibility_score'
);

SET @query2 = IF(@col_exists_cred = 0,
    'ALTER TABLE ai_analysis ADD COLUMN credibility_score INT AFTER readability_score',
    'SELECT "Column credibility_score already exists" AS message'
);

PREPARE stmt2 FROM @query2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Add is_fake_news to ai_analysis
SET @col_exists_fake = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'blog_platform' 
    AND TABLE_NAME = 'ai_analysis' 
    AND COLUMN_NAME = 'is_fake_news'
);

SET @query3 = IF(@col_exists_fake = 0,
    'ALTER TABLE ai_analysis ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER credibility_score',
    'SELECT "Column is_fake_news already exists in ai_analysis" AS message'
);

PREPARE stmt3 FROM @query3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Add fact_check_feedback to ai_analysis
SET @col_exists_feedback = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'blog_platform' 
    AND TABLE_NAME = 'ai_analysis' 
    AND COLUMN_NAME = 'fact_check_feedback'
);

SET @query4 = IF(@col_exists_feedback = 0,
    'ALTER TABLE ai_analysis ADD COLUMN fact_check_feedback TEXT AFTER is_fake_news',
    'SELECT "Column fact_check_feedback already exists" AS message'
);

PREPARE stmt4 FROM @query4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

-- Update existing records
UPDATE blogs SET is_fake_news = FALSE WHERE is_fake_news IS NULL;
UPDATE ai_analysis SET is_fake_news = FALSE WHERE is_fake_news IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_is_fake_news ON blogs(is_fake_news);

-- Show results
SELECT 'Migration completed successfully!' AS status;
DESCRIBE blogs;
DESCRIBE ai_analysis;
