# DeepSeek API Setup Guide

## What Changed

The AI system has been updated to use **DeepSeek API** instead of OpenAI API.

## Changes Made

1. **analyzer.py** - Updated to use DeepSeek API endpoints
2. **requirements.txt** - Replaced `openai` with `requests` library
3. **.env** - Changed `OPENAI_API_KEY` to `DEEPSEEK_API_KEY`

## Setup Instructions

### 1. Get DeepSeek API Key

1. Visit [https://platform.deepseek.com](https://platform.deepseek.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variable

Edit your `.env` file and add your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

### 3. Install Dependencies

```bash
# Activate your virtual environment first
# Windows:
venv\Scripts\activate

# Then install/update dependencies
pip install -r requirements.txt
```

### 4. Restart Backend

```bash
python run.py
```

## Features

The DeepSeek integration provides:

- **Content Analysis**: Quality and readability scoring
- **Grammar Checking**: Grammar suggestions and improvements
- **SEO Analysis**: SEO recommendations
- **Fact Checking**: Credibility scoring and fake news detection

## Mock Mode

If you leave `DEEPSEEK_API_KEY` empty, the system will automatically use the mock analyzer with rule-based scoring (no API calls).

## API Details

- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Model**: `deepseek-chat`
- **Timeout**: 30 seconds per request

## Troubleshooting

### API Key Not Working
- Verify your API key is correct
- Check if you have API credits
- Ensure no extra spaces in the .env file

### Connection Errors
- Check your internet connection
- Verify the API endpoint is accessible
- System will fallback to mock mode on errors

### Mock Mode Always Active
- Ensure `DEEPSEEK_API_KEY` is set in .env
- Restart the Flask application after changing .env
- Check for typos in the environment variable name
