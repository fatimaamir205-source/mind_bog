-- Migration: Add Fact-Checking Support
-- Run this SQL to add fact-checking columns to existing database

USE blog_platform;

-- Add is_fake_news column to blogs table
ALTER TABLE blogs 
ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER status;

-- Add fact-checking columns to ai_analysis table
ALTER TABLE ai_analysis 
ADD COLUMN credibility_score INT AFTER readability_score,
ADD COLUMN is_fake_news BOOLEAN DEFAULT FALSE AFTER credibility_score,
ADD COLUMN fact_check_feedback TEXT AFTER is_fake_news;

-- Update existing records to have default values
UPDATE blogs SET is_fake_news = FALSE WHERE is_fake_news IS NULL;
UPDATE ai_analysis SET is_fake_news = FALSE WHERE is_fake_news IS NULL;

-- Add index for fake news filtering
CREATE INDEX idx_is_fake_news ON blogs(is_fake_news);

-- Verify changes
DESCRIBE blogs;
DESCRIBE ai_analysis;
