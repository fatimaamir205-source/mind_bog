"""
Test script to verify trending endpoints logic
Run this after starting the Flask server
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_trending_topics():
    print("\n=== Testing Trending Topics ===")
    try:
        response = requests.get(f"{BASE_URL}/trending/topics")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data.get('topics', []))} trending topics")
            for topic in data.get('topics', [])[:3]:
                print(f"  - {topic['tag']}: {topic['count']} blogs, score: {topic['score']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_recommended_authors():
    print("\n=== Testing Recommended Authors ===")
    try:
        response = requests.get(f"{BASE_URL}/trending/authors")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data.get('authors', []))} recommended authors")
            for author in data.get('authors', [])[:3]:
                print(f"  - {author['username']}: {author['blog_count']} blogs, {author['followers_count']} followers")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_trending_blogs():
    print("\n=== Testing Trending Blogs ===")
    try:
        response = requests.get(f"{BASE_URL}/trending/blogs")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data.get('blogs', []))} trending blogs")
            for blog in data.get('blogs', [])[:3]:
                print(f"  - {blog['title'][:50]}: {blog['views']} views, score: {blog['trending_score']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_all_trending():
    print("\n=== Testing All Trending (Combined) ===")
    try:
        response = requests.get(f"{BASE_URL}/trending/all")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Topics: {len(data.get('topics', []))}")
            print(f"Authors: {len(data.get('authors', []))}")
            print(f"Blogs: {len(data.get('blogs', []))}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("Trending System API Tests")
    print("=" * 60)
    print("\nMake sure the Flask server is running on http://localhost:5000")
    print("Press Enter to start tests...")
    input()
    
    test_trending_topics()
    test_recommended_authors()
    test_trending_blogs()
    test_all_trending()
    
    print("\n" + "=" * 60)
    print("Tests completed!")
    print("=" * 60)
