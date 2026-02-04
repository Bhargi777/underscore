# CogniNode - The Recursive AI Learning Map
## Requirements Document

## Product Vision

**The Problem**: Traditional learning is broken. Static roadmaps treat every learner the same, forcing linear paths that ignore individual knowledge gaps and curiosity. Students waste time on concepts they already know or get overwhelmed by missing prerequisites.

**The Solution**: CogniNode transforms learning into an adaptive, visual journey. Instead of following someone else's path, learners explore knowledge like a living map that grows and adapts to their unique needs. Each topic becomes a node that can expand infinitely deeper, creating personalized learning experiences that match how our brains actually work - through connections and curiosity.

**Why This Wins**: We're not just building another learning platform. We're creating the future of knowledge exploration - where AI doesn't just provide answers, but helps you discover the right questions to ask next.

## User Personas

### 1. The Curious Student (Primary)
- **Profile**: University student or self-learner exploring new fields
- **Pain Points**: Overwhelmed by information, doesn't know where to start, loses motivation with linear courses
- **Goals**: Understand complex topics at their own pace, see how concepts connect
- **Success Metric**: Completes 3+ learning sessions per week, explores 5+ node expansions per session

### 2. The Career Switcher (Secondary)
- **Profile**: Professional transitioning to tech/new field (25-40 years old)
- **Pain Points**: Limited time, needs to focus on practical skills, imposter syndrome
- **Goals**: Quickly identify knowledge gaps, build confidence through structured learning
- **Success Metric**: Masters 80% of nodes in chosen learning path within 30 days

### 3. The Knowledge Explorer (Tertiary)
- **Profile**: Lifelong learner, researcher, or educator
- **Pain Points**: Wants depth and breadth, needs to stay current with evolving fields
- **Goals**: Discover connections between disciplines, maintain comprehensive understanding
- **Success Metric**: Creates and shares custom learning maps, explores 10+ different domains

## Functional Requirements

### Must Have (MVP - Week 1)

#### Core Graph Generation
- **REQ-001**: User enters high-level topic (text input)
- **REQ-002**: AI generates initial node graph with 5-8 main subtopics
- **REQ-003**: Nodes display as interactive visual elements with titles and brief descriptions
- **REQ-004**: Graph renders using React Flow with smooth animations

#### Recursive Node Expansion
- **REQ-005**: Clicking any node triggers AI to generate 3-6 child nodes
- **REQ-006**: Child nodes appear with animated expansion effect
- **REQ-007**: Support for 3 levels of depth minimum (Topic → Subtopic → Concept)
- **REQ-008**: Visual hierarchy shows parent-child relationships clearly

#### Knowledge Cards
- **REQ-009**: Leaf nodes open detailed knowledge cards on click
- **REQ-010**: Cards contain AI-generated summary (150-300 words)
- **REQ-011**: Technical topics include relevant code snippet
- **REQ-012**: Each card shows 3 curated learning resources (YouTube, docs, articles)

#### Progress Tracking
- **REQ-013**: Users can mark nodes as "Learning", "Mastered", or "Skipped"
- **REQ-014**: Visual indicators show progress state (colors/icons)
- **REQ-015**: Progress persists across sessions (local storage minimum)

### Nice to Have (Post-MVP)

#### Enhanced Features
- **REQ-016**: User accounts and cloud sync
- **REQ-017**: Shareable learning maps with unique URLs
- **REQ-018**: Export maps as PDF or image
- **REQ-019**: Collaborative learning (multiple users on same map)
- **REQ-020**: AI-suggested learning paths based on goals
- **REQ-021**: Integration with note-taking apps
- **REQ-022**: Mobile-responsive design
- **REQ-023**: Offline mode for generated content

## Non-Functional Requirements

### Performance
- **NFR-001**: Node expansion completes within 3 seconds
- **NFR-002**: Graph renders smoothly with 50+ nodes
- **NFR-003**: Knowledge card loads within 1 second
- **NFR-004**: Resource search completes within 2 seconds

### User Experience
- **NFR-005**: Intuitive navigation requiring no tutorial
- **NFR-006**: Visually stunning "wow factor" for demos
- **NFR-007**: Responsive design works on desktop and tablet
- **NFR-008**: Accessibility support (keyboard navigation, screen readers)

### Technical
- **NFR-009**: Consistent AI output format (structured JSON)
- **NFR-010**: Graceful error handling for API failures
- **NFR-011**: Scalable architecture supporting 100+ concurrent users
- **NFR-012**: Clean, maintainable code for team development

### Visual Design
- **NFR-013**: Dark mode cyberpunk aesthetic
- **NFR-014**: Glowing edges and smooth animations
- **NFR-015**: Color-coded node types and states
- **NFR-016**: Professional, modern interface suitable for demos

## Success Metrics (Hackathon Focus)

### Demo Impact
- **Judges spend 5+ minutes exploring the interface**
- **"Wow" reaction when nodes expand recursively**
- **Clear understanding of value proposition within 30 seconds**

### Technical Excellence
- **Zero crashes during demo**
- **Sub-3 second response times**
- **Smooth animations and transitions**

### User Validation
- **3+ different learning domains successfully mapped**
- **Intuitive usage without explanation**
- **Positive feedback on visual design**

## Constraints & Assumptions

### Time Constraints
- **48-72 hour development window**
- **Single demo session (5-10 minutes)**
- **Team of 2-4 developers**

### Technical Constraints
- **Free tier API limits (OpenAI/Gemini)**
- **Client-side deployment preferred**
- **No complex backend infrastructure**

### Assumptions
- **Users have basic computer literacy**
- **Stable internet connection**
- **Modern web browser support**
- **English language content initially**

## Risk Mitigation

### High Risk
- **AI API rate limits**: Implement caching and fallback responses
- **Slow API responses**: Show loading states and optimize prompts
- **Complex graph rendering**: Use React Flow's built-in performance optimizations

### Medium Risk
- **Resource search failures**: Provide manual resource addition
- **Browser compatibility**: Test on Chrome, Firefox, Safari
- **Mobile experience**: Focus on desktop for MVP, ensure basic mobile function