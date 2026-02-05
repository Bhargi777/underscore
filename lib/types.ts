// Core data types for CogniNode
export interface Node {
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

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'animated';
  style?: {
    stroke: string;
    strokeWidth: number;
  };
}

export interface LearningMap {
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

export interface KnowledgeCard {
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

export interface Resource {
  id: string;
  type: 'video' | 'article' | 'documentation' | 'course';
  title: string;
  url: string;
  description: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  thumbnail?: string;
}

export interface GenerateMapRequest {
  topic: string;
  depth?: number;
}

export interface GenerateMapResponse {
  nodes: Node[];
  edges: Edge[];
}

export interface ExpandNodeRequest {
  nodeId: string;
  parentTopic: string;
  context: string[];
}

export interface ExpandNodeResponse {
  nodes: Node[];
  edges: Edge[];
}

export interface GetResourcesRequest {
  topic: string;
  type?: Resource['type'][];
}

export interface GetResourcesResponse {
  resources: Resource[];
}

export type NodeStatus = Node['status'];

// Store types
export interface AppState {
  currentMap: LearningMap | null;
  selectedNode: Node | null;
  knowledgeCard: KnowledgeCard | null;
  isLoading: boolean;
  error: string | null;
  progress: Record<string, NodeStatus>;
}

export interface AppActions {
  setCurrentMap: (map: LearningMap) => void;
  setSelectedNode: (node: Node | null) => void;
  setKnowledgeCard: (card: KnowledgeCard | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  addNodes: (nodes: Node[], edges: Edge[]) => void;
}