# CogniNode - Setup & Secrets Configuration Guide

## Phase 1: Environment Setup

### 1. Install Dependencies

Run this single command to install all required packages:

```bash
npm install next@14.0.4 react@^18 react-dom@^18 reactflow@^11.10.1 framer-motion@^10.16.16 lucide-react@^0.294.0 @google/generative-ai@^0.2.1 axios@^1.6.2 zustand@^4.4.7 tailwind-merge@^2.2.0 clsx@^2.0.0 @types/node@^20 @types/react@^18 @types/react-dom@^18 autoprefixer@^10.0.1 postcss@^8 tailwindcss@^3.3.0 typescript@^5 eslint@^8 eslint-config-next@14.0.4
```

### 2. Environment Variables Template

Create a file named `.env.local` in your project root with the following content:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# YouTube Data API (for resource curation)
YOUTUBE_API_KEY=your-youtube-api-key-here

# Serper API (for web search - completely free)
SERPER_API_KEY=your-serper-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Supabase (for future user accounts)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

## 🆓 COMPLETELY FREE Setup (No Credit Card Required)

Perfect for hackathons! Here's a 100% free setup using Google's generous free tiers:

### Free APIs Only:
```env
# Google Gemini API (completely free with generous limits)
GEMINI_API_KEY=your-gemini-api-key-here

# YouTube Data API (10,000 requests/day free)
YOUTUBE_API_KEY=your-youtube-api-key-here

# Serper API (2,500 searches/month free, no credit card)
SERPER_API_KEY=your-serper-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Free API Sources:

| API | Provider | Free Tier | No Credit Card |
|-----|----------|-----------|----------------|
| **Gemini API** | [aistudio.google.com](https://aistudio.google.com/app/apikey) | 15 requests/minute, 1,500/day | ✅ Yes |
| **YouTube API** | [Google Cloud](https://console.cloud.google.com/) | 10,000 requests/day | ✅ Yes |
| **Serper API** | [serper.dev](https://serper.dev/) | 2,500 searches/month | ✅ Yes |

### Google Gemini Setup (Best Free Option):
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. **No credit card required!**

**Gemini Pro is completely free with very generous limits - perfect for hackathons!**

### Alternative Free AI Options:

| API | Provider | Free Tier | Setup |
|-----|----------|-----------|-------|
| **Groq API** | [console.groq.com](https://console.groq.com/) | Unlimited requests (rate limited) | Sign up with Google/GitHub |
| **Cohere API** | [dashboard.cohere.ai](https://dashboard.cohere.ai/) | 1,000 requests/month | Sign up with email |

## Original Setup (With OpenAI)

| API Key | Where to Get It | Steps |
|---------|----------------|-------|
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) | 1. Sign up/login to OpenAI<br>2. Go to API Keys section<br>3. Click "Create new secret key"<br>4. Copy the key (starts with `sk-`)<br>**Note: $5 free credit for new accounts** |
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) | 1. Create/select a project<br>2. Enable YouTube Data API v3<br>3. Go to Credentials > Create Credentials > API Key<br>4. Copy the generated key<br>**Note: 10,000 requests/day FREE** |
| `SERPER_API_KEY` | [serper.dev](https://serper.dev/) | 1. Sign up with Google/GitHub (no credit card)<br>2. Go to dashboard<br>3. Copy your API key<br>**Note: 2,500 free searches/month** |
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com/) | 1. Create new project<br>2. Go to Project Settings > API<br>3. Copy the "Project URL"<br>**Note: Completely free tier** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [supabase.com](https://supabase.com/) | 1. Same project as above<br>2. Copy the "anon public" key<br>**Note: No credit card required** |
| `SUPABASE_SERVICE_ROLE_KEY` | [supabase.com](https://supabase.com/) | 1. Same project as above<br>2. Copy the "service_role" key (keep secret!) |

## Required API Keys for MVP

### Essential (Must Have) - All FREE!
- ✅ **GEMINI_API_KEY** - Core AI functionality (15 req/min, 1,500/day FREE)
- ✅ **YOUTUBE_API_KEY** - Resource curation (10,000 requests/day FREE)

### Optional (Nice to Have) - Also FREE!
- 🔶 **SERPER_API_KEY** - Enhanced web resource search (2,500 searches/month FREE)

**Total Cost: $0** 🎉

## Cost Estimates

## Cost Estimates

| Service | Free Tier | Hackathon Cost |
|---------|-----------|----------------|
| Google Gemini API | 15 req/min, 1,500/day | **FREE** ✅ |
| YouTube Data API | 10,000 requests/day | **FREE** ✅ |
| Serper Search API | 2,500 requests/month | **FREE** ✅ |

**Total Cost: $0** 🎉 **Perfect for hackathons!**

## Security Notes

⚠️ **Important Security Practices:**
- Never commit `.env.local` to git (already in .gitignore)
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep service role keys server-side only
- Rotate keys after hackathon if sharing code publicly

## Verification Commands

After setting up your `.env.local`, run these commands to verify everything works:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check if environment variables are loaded
node -e "console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing')"
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Solution: Run `npm install` again
   - Check if all packages are in package.json

2. **"API key not found" errors**
   - Solution: Verify `.env.local` exists in project root
   - Restart development server after adding keys

3. **OpenAI API errors**
   - Check if you have credits in your OpenAI account
   - Verify the key starts with `sk-`

4. **CORS errors with APIs**
   - YouTube and Brave APIs should be called from server-side only
   - Use Next.js API routes (`/api/*`) for external API calls

## Next Steps

Once you have:
1. ✅ Installed all dependencies with the npm command above
2. ✅ Created `.env.local` with at least the OpenAI and YouTube API keys
3. ✅ Verified the keys work

**Reply with "Keys ready" and I'll generate the complete application code.**