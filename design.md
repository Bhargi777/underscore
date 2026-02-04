# CogniNode - The Recursive AI Learning Map
## Design Document

## Tech Stack Selection

### Frontend Framework
- **Next.js 14** with App Router
  - **Why**: Full-stack React framework with built-in API routes, perfect for hackathon speed
  - **Benefits**: Zero-config deployment, built-in optimization, TypeScript support

### Graph Visualization
- **React Flow** 
  - **Why**: Most mature React graph library with excellent performance
  - **Features**: Built-in zoom/pan, node positioning, edge routing, animations

### Animation & UI
- **Framer Motion**
  - **Why**: Smooth, performant animations that create "wow factor"
  - **Usage**: Node expansion animations, page transitions, micro-interactions
- **Tailwind CSS**
  - **Why**: Rapid styling with consistent design system
  - **Custom**: Dark mode cyberpunk theme with glowing effects

### AI Integration
- **OpenAI GPT-4** (Primary) / **Google Gemini** (Fallback)
  - **Why**: Reliable structured output, good reasoning for educational content
  - **Usage**: Topic expansion, knowledge card generation, resource curation

### Data & State
- **Zustand** for client state management
  - **Why**: Lightweight, TypeScript-friendly, perfect for hackathon complexity
- **Local Storage** for MVP persistence
- **Supabase** for post-MVP user accounts and cloud sync

### Search & Resources
- **YouTube Data API** for video resources
- **Brave Search API** for articles and documentation
- **GitHub API** for code examples (technical topics)

## System Architecture

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
│  │  /generate-map  │  │ /expand-node    │  │ /get-resources│ │
│  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External APIs                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   OpenAI API    │  │  YouTube API    │  │ Brave Search│ │
│  │   (GPT-4)       │  │                 │  │    API      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Initial Map Generation**:
   ```
   User Input → /api/generate-map → OpenAI → Structured JSON → React Flow
   ```

2. **Node Expansion**:
   ```
   Node Click → /api/expand-node → OpenAI → Child Nodes → Animated Render
   ```

3. **Knowledge Cards**:
   ```
   Leaf Click → /api/get-knowledge → OpenAI + Search APIs → Modal Display
   ```

## Data Models

### Core Entities

```typescript
interface User {
  id: string;
  email?: string;
  preferences: {
    theme: 'dark' | 'light';
    defaultDepth: number;
    favoriteTopics: string[];
  };
  createdAt: Date;
}

interface LearningMap {
  id: string;
  userId?: string;
  title: string;
  rootTopic: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    totalNodes: number;
    maxDepth: number;
    createdAt: Date;
    lastModified: Date;
  };
}

interface Node {
  id: string;
  type: 'root' | 'branch' | 'leaf';
  title: string;
  description: string;
  level: number;
  parentId?: string;
  position: { x: number; y: number };
  status: 'unexplored' | 'learning' | 'mastered' | 'skipped';
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // minutes
    prerequisites: string[];
  };
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'animated';
  style?: {
    stroke: string;
    strokeWidth: number;
  };
}

interface KnowledgeCard {
  nodeId: string;
  summary: string;
  codeExample?: {
    language: string;
    code: string;
    explanation: string;
  };
  resources: Resource[];
  keyPoints: string[];
  nextSteps: string[];
}

interface Resource {
  id: string;
  type: 'video' | 'article' | 'documentation' | 'course';
  title: string;
  url: string;
  description: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
}
```

## API Endpoints

### Core Endpoints

```typescript
// Generate initial learning map
POST /api/generate-map
Body: { topic: string, depth?: number }
Response: { nodes: Node[], edges: Edge[] }

// Expand a specific node
POST /api/expand-node  
Body: { nodeId: string, parentTopic: string, context: string[] }
Response: { nodes: Node[], edges: Edge[] }

// Get knowledge card for leaf node
GET /api/knowledge-card/:nodeId
Response: KnowledgeCard

// Search and curate resources
POST /api/get-resources
Body: { topic: string, type?: ResourceType[] }
Response: { resources: Resource[] }

// Save/load user progress
POST /api/progress
Body: { mapId: string, nodeId: string, status: NodeStatus }
Response: { success: boolean }

GET /api/progress/:mapId
Response: { progress: Record<string, NodeStatus> }
```

### AI Prompt Engineering

#### Map Generation Prompt
```typescript
const GENERATE_MAP_PROMPT = `
You are an expert learning designer. Create a comprehensive learning map for: "${topic}"

Generate exactly 6-8 main subtopics that cover this subject comprehensively.
Each subtopic should be:
- Specific and actionable
- Logically sequenced
- Appropriate for the target difficulty level

Return ONLY valid JSON in this exact format:
{
  "nodes": [
    {
      "id": "unique-id",
      "title": "Subtopic Title",
      "description": "Brief 1-sentence description",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": 30
    }
  ]
}
`;
```

#### Node Expansion Prompt
```typescript
const EXPAND_NODE_PROMPT = `
You are expanding the learning topic: "${nodeTitle}"
Parent context: ${parentContext}

Generate 4-6 specific sub-concepts that break down this topic.
Focus on practical, learnable chunks.

Return ONLY valid JSON with the same node structure.
`;
```

## UI/UX Design Guidelines

### Visual Theme: Cyberpunk Learning

#### Color Palette
```css
:root {
  /* Primary Colors */
  --bg-primary: #0a0a0f;
  --bg-secondary: #1a1a2e;
  --bg-tertiary: #16213e;
  
  /* Accent Colors */
  --accent-primary: #00f5ff;    /* Cyan glow */
  --accent-secondary: #ff006e;  /* Pink highlights */
  --accent-tertiary: #8338ec;   /* Purple nodes */
  
  /* Status Colors */
  --status-unexplored: #4a5568;
  --status-learning: #ffd700;
  --status-mastered: #00ff88;
  --status-skipped: #ff4757;
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --text-muted: #718096;
}
```

#### Node Styling
```css
.node-root {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: 2px solid var(--accent-primary);
  box-shadow: 0 0 20px var(--accent-primary);
  animation: pulse-glow 2s infinite;
}

.node-branch {
  background: var(--bg-tertiary);
  border: 1px solid var(--accent-tertiary);
  box-shadow: 0 0 10px var(--accent-tertiary);
}

.node-leaf {
  background: var(--bg-secondary);
  border: 1px solid var(--text-secondary);
  transition: all 0.3s ease;
}

.node-leaf:hover {
  box-shadow: 0 0 15px var(--accent-primary);
  transform: scale(1.05);
}
```

#### Edge Styling
```css
.react-flow__edge-path {
  stroke: var(--accent-primary);
  stroke-width: 2;
  filter: drop-shadow(0 0 5px var(--accent-primary));
}

.react-flow__edge.animated {
  animation: edge-flow 2s linear infinite;
}

@keyframes edge-flow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -20; }
}
```

### Component Layout

#### Main Graph View
```tsx
<div className="h-screen bg-gradient-to-br from-bg-primary to-bg-secondary">
  <Header />
  <div className="flex h-full">
    <Sidebar /> {/* Progress, Controls */}
    <ReactFlow 
      className="flex-1"
      nodeTypes={customNodeTypes}
      edgeTypes={customEdgeTypes}
    />
  </div>
  <KnowledgeCardModal />
</div>
```

#### Knowledge Card Modal
```tsx
<Modal className="cyberpunk-modal">
  <div className="bg-bg-secondary border border-accent-primary rounded-lg p-6">
    <h2 className="text-2xl font-bold text-accent-primary mb-4">
      {node.title}
    </h2>
    <div className="prose prose-invert">
      {knowledgeCard.summary}
    </div>
    {codeExample && <CodeBlock />}
    <ResourceList resources={knowledgeCard.resources} />
  </div>
</Modal>
```

### Animation Guidelines

#### Node Expansion Animation
```tsx
const expandAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20,
      staggerChildren: 0.1
    }
  }
};
```

#### Loading States
```tsx
const LoadingNode = () => (
  <div className="node-loading">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary" />
    <span className="text-accent-primary animate-pulse">Generating...</span>
  </div>
);
```

## Development Workflow

### Phase 1: Core MVP (Day 1)
1. **Setup**: Next.js project with TypeScript, Tailwind, React Flow
2. **Basic Graph**: Static node generation and rendering
3. **AI Integration**: OpenAI API for topic expansion
4. **Basic Styling**: Dark theme with glowing effects

### Phase 2: Interactivity (Day 2)
1. **Node Expansion**: Click handlers and dynamic generation
2. **Knowledge Cards**: Modal system with AI-generated content
3. **Progress Tracking**: Local storage for node states
4. **Animations**: Framer Motion for smooth transitions

### Phase 3: Polish (Day 3)
1. **Resource Integration**: YouTube and search APIs
2. **Error Handling**: Graceful fallbacks and loading states
3. **Performance**: Optimization for large graphs
4. **Demo Prep**: Sample topics and smooth demo flow

### Deployment Strategy
- **Vercel**: One-click deployment from GitHub
- **Environment Variables**: API keys via Vercel dashboard
- **Domain**: Custom domain for professional presentation

## Performance Optimizations

### Graph Rendering
- **Virtualization**: Only render visible nodes
- **Lazy Loading**: Load node details on demand
- **Memoization**: React.memo for expensive components

### API Efficiency
- **Caching**: Cache AI responses for common topics
- **Batching**: Combine multiple API calls where possible
- **Fallbacks**: Graceful degradation when APIs fail

### Bundle Size
- **Tree Shaking**: Import only needed components
- **Code Splitting**: Lazy load heavy components
- **Image Optimization**: Next.js automatic optimization

## Demo Strategy

### Sample Topics for Demo
1. **"Machine Learning"** - Technical with code examples
2. **"Digital Marketing"** - Business-focused
3. **"Quantum Computing"** - Complex theoretical topic

### Demo Flow (5 minutes)
1. **Hook** (30s): "Learning is broken. Watch this."
2. **Problem** (60s): Show static learning resources
3. **Solution** (180s): Live demo of recursive expansion
4. **Impact** (60s): Show progress tracking and personalization

### Key Demo Moments
- **Wow Factor**: First node expansion with smooth animation
- **Depth Demo**: Go 3 levels deep on one branch
- **Knowledge Card**: Show rich content with resources
- **Progress**: Mark nodes as mastered, show visual feedback