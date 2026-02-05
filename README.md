# 🧠 CogniNode - The Recursive AI Learning Map

Transform any topic into an interactive, AI-powered learning journey. CogniNode creates personalized knowledge graphs that adapt and expand based on your curiosity.

![CogniNode Demo](https://via.placeholder.com/800x400/0a0a0f/00f5ff?text=CogniNode+Demo)

## ✨ Features

- **🤖 AI-Powered Generation**: Uses Google Gemini to create comprehensive learning maps
- **🔄 Recursive Expansion**: Click any node to dive deeper into subtopics
- **📚 Rich Knowledge Cards**: Detailed explanations with code examples and curated resources
- **🎯 Progress Tracking**: Mark topics as learning, mastered, or skipped
- **🎨 Cyberpunk UI**: Beautiful dark theme with glowing animations
- **📱 Responsive Design**: Works on desktop and tablet

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Gemini API (Required)
GEMINI_API_KEY=your-gemini-api-key-here

# YouTube Data API (Required)
YOUTUBE_API_KEY=your-youtube-api-key-here

# Serper API (Optional - for enhanced web search)
SERPER_API_KEY=your-serper-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Get Your API Keys

| API | Where to Get | Cost |
|-----|--------------|------|
| **Gemini** | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | **FREE** (15 req/min, 1,500/day) |
| **YouTube** | [Google Cloud Console](https://console.cloud.google.com/) | **FREE** (10,000 req/day) |
| **Serper** | [serper.dev](https://serper.dev/) | **FREE** (2,500 searches/month) |

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Use

1. **Enter a Topic**: Type any subject you want to learn (e.g., "Machine Learning", "React", "Quantum Physics")

2. **Generate Map**: Click "Generate Map" to create your initial learning graph

3. **Explore Recursively**: Click any node to expand it into deeper subtopics

4. **Learn Deeply**: Click leaf nodes to open rich knowledge cards with:
   - Comprehensive explanations
   - Code examples (for technical topics)
   - Curated YouTube videos and articles
   - Next learning steps

5. **Track Progress**: Mark nodes as learning, mastered, or skipped

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Graph View    │  │  Knowledge Card │  │  Progress   │ │
│  │  (React Flow)   │  │   (Modal)       │  │  Tracker    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (/api/*)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  /generate-map  │  │ /expand-node    │  │/knowledge-card│ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External APIs                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Gemini API     │  │  YouTube API    │  │ Serper API  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Visualization**: React Flow (interactive graphs)
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS (cyberpunk theme)
- **State Management**: Zustand
- **AI**: Google Gemini Pro
- **APIs**: YouTube Data API, Serper Search API

## 📁 Project Structure

```
cogninode/
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── generate-map/    # Initial map generation
│   │   ├── expand-node/     # Node expansion
│   │   └── knowledge-card/  # Knowledge card data
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── CustomNode.tsx       # Graph node component
│   ├── GraphCanvas.tsx      # Main graph component
│   └── KnowledgeCard.tsx    # Knowledge card modal
├── lib/
│   ├── config.ts            # Environment configuration
│   ├── gemini.ts            # Gemini AI integration
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript definitions
│   └── utils.ts             # Utility functions
└── ...config files
```

## 🎨 Design Philosophy

**Cyberpunk Aesthetic**: Dark theme with neon accents and glowing effects
**Smooth Animations**: Framer Motion for engaging interactions
**Intuitive UX**: Click to expand, visual progress indicators
**Responsive**: Works on desktop and tablet devices

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for powerful AI capabilities
- React Flow for beautiful graph visualizations
- Framer Motion for smooth animations
- The open-source community for amazing tools

---

**Built with ❤️ for learners everywhere**

Transform your curiosity into knowledge with CogniNode! 🧠✨