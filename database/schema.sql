-- Create Database
CREATE DATABASE IF NOT EXISTS blog_platform;
USE blog_platform;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Profiles Table
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Blogs Table
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    tags VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    views INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (title, content)
);

-- AI Analysis Table
CREATE TABLE ai_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_id INT NOT NULL,
    quality_score INT,
    grammar_feedback TEXT,
    seo_feedback TEXT,
    readability_score INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    INDEX idx_blog_id (blog_id)
);

-- Comments Table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    INDEX idx_blog_id (blog_id),
    INDEX idx_user_id (user_id)
);

-- Likes Table
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_blog_like (user_id, blog_id),
    INDEX idx_blog_id (blog_id),
    INDEX idx_user_id (user_id)
);

-- Bookmarks Table
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    blog_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_blog_bookmark (user_id, blog_id),
    INDEX idx_blog_id (blog_id),
    INDEX idx_user_id (user_id)
);

-- Sample Data
-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@blog.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqVr/VXj5i', 'admin');

-- Insert regular user (password: user123)
INSERT INTO users (username, email, password_hash, role) VALUES 
('john_doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqVr/VXj5i', 'user');

-- Insert profiles
INSERT INTO profiles (user_id, bio, avatar_url) VALUES 
(1, 'Platform Administrator', 'https://i.pravatar.cc/150?img=1'),
(2, 'Tech enthusiast and blogger', 'https://i.pravatar.cc/150?img=2');

-- Insert sample blogs
INSERT INTO blogs (user_id, title, content, tags, status, views) VALUES 
(2, 'Getting Started with Python', 'Python is an amazing programming language that is perfect for beginners. In this comprehensive guide, we will explore the fundamentals of Python programming, including variables, data types, control structures, and functions. Python''s simple syntax makes it easy to learn while being powerful enough for complex applications.', 'python,programming,tutorial', 'published', 150),
(2, 'Web Development Best Practices', 'Building modern web applications requires following industry best practices. This includes responsive design, security considerations, performance optimization, and accessibility standards. Let''s dive into each of these important aspects and learn how to create better web applications.', 'web,development,best-practices', 'published', 89);

-- Insert sample AI analysis
INSERT INTO ai_analysis (blog_id, quality_score, grammar_feedback, seo_feedback, readability_score) VALUES 
(1, 85, 'Well-structured content with good grammar. Consider adding more examples.', 'Good keyword usage. Add meta description and internal links.', 78),
(2, 82, 'Clear and concise writing. Some sentences could be shorter.', 'Include more specific keywords. Add alt text to images.', 75);

-- Insert sample comments
INSERT INTO comments (user_id, blog_id, content) VALUES 
(1, 1, 'Great tutorial! Very helpful for beginners.'),
(1, 2, 'Excellent tips on web development. Thanks for sharing!');

-- Insert sample likes
INSERT INTO likes (user_id, blog_id) VALUES 
(1, 1),
(1, 2);
