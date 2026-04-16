-- Migration: Update image_url columns to handle file paths
-- Run this if you already have the database created

USE blog_platform;

-- Ensure blogs.image_url can be NULL and handle longer paths
ALTER TABLE blogs MODIFY COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- Ensure profiles.avatar_url can be NULL and handle longer paths
ALTER TABLE profiles MODIFY COLUMN avatar_url VARCHAR(500) DEFAULT NULL;

-- Verify changes
DESCRIBE blogs;
DESCRIBE profiles;
