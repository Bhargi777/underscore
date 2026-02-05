import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Node, Edge } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Calculate node positions for graph layout
export function calculateNodePositions(
  nodes: any[],
  parentNode?: { position: { x: number; y: number } },
  level: number = 0
): Node[] {
  const nodeSpacing = 200;
  const levelSpacing = 150;
  
  if (level === 0) {
    // Root node - center it
    return nodes.map((node, index) => ({
      ...node,
      id: node.id || generateId(),
      type: 'root' as const,
      level: 0,
      position: {
        x: (index - (nodes.length - 1) / 2) * nodeSpacing,
        y: 0,
      },
      status: 'unexplored' as const,
      metadata: {
        difficulty: node.difficulty || 'beginner',
        estimatedTime: node.estimatedTime || 30,
        prerequisites: [],
      },
    }));
  }

  // Child nodes - arrange around parent
  const angleStep = (2 * Math.PI) / nodes.length;
  const radius = 250;

  return nodes.map((node, index) => {
    const angle = index * angleStep;
    const x = parentNode!.position.x + radius * Math.cos(angle);
    const y = parentNode!.position.y + radius * Math.sin(angle);

    return {
      ...node,
      id: node.id || generateId(),
      type: level === 1 ? 'branch' : 'leaf' as const,
      level,
      parentId: parentNode ? 'parent-id' : undefined,
      position: { x, y },
      status: 'unexplored' as const,
      metadata: {
        difficulty: node.difficulty || 'beginner',
        estimatedTime: node.estimatedTime || 30,
        prerequisites: [],
      },
    };
  });
}

// Generate edges between nodes
export function generateEdges(nodes: Node[], parentId?: string): Edge[] {
  if (!parentId) return [];

  return nodes.map(node => ({
    id: `${parentId}-${node.id}`,
    source: parentId,
    target: node.id,
    type: 'default' as const,
    style: {
      stroke: '#00f5ff',
      strokeWidth: 2,
    },
  }));
}

// Get status color for nodes
export function getStatusColor(status: Node['status']): string {
  switch (status) {
    case 'unexplored':
      return '#4a5568';
    case 'learning':
      return '#ffd700';
    case 'mastered':
      return '#00ff88';
    case 'skipped':
      return '#ff4757';
    default:
      return '#4a5568';
  }
}

// Get difficulty color
export function getDifficultyColor(difficulty: Node['metadata']['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return '#00ff88';
    case 'intermediate':
      return '#ffd700';
    case 'advanced':
      return '#ff006e';
    default:
      return '#00f5ff';
  }
}

// Format time duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};