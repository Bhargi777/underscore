import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AppActions, LearningMap, Node, KnowledgeCard, NodeStatus, Edge } from './types';

interface Store extends AppState, AppActions {}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // State
      currentMap: null,
      selectedNode: null,
      knowledgeCard: null,
      isLoading: false,
      error: null,
      progress: {},

      // Actions
      setCurrentMap: (map: LearningMap) => {
        set({ currentMap: map, error: null });
      },

      setSelectedNode: (node: Node | null) => {
        set({ selectedNode: node });
      },

      setKnowledgeCard: (card: KnowledgeCard | null) => {
        set({ knowledgeCard: card });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      updateNodeStatus: (nodeId: string, status: NodeStatus) => {
        const { progress, currentMap } = get();
        const newProgress = { ...progress, [nodeId]: status };
        
        // Update node in current map
        if (currentMap) {
          const updatedNodes = currentMap.nodes.map(node =>
            node.id === nodeId ? { ...node, status } : node
          );
          
          set({
            progress: newProgress,
            currentMap: {
              ...currentMap,
              nodes: updatedNodes,
              metadata: {
                ...currentMap.metadata,
                lastModified: new Date(),
              },
            },
          });
        } else {
          set({ progress: newProgress });
        }
      },

      addNodes: (nodes: Node[], edges: Edge[]) => {
        const { currentMap } = get();
        if (!currentMap) return;

        const updatedMap: LearningMap = {
          ...currentMap,
          nodes: [...currentMap.nodes, ...nodes],
          edges: [...currentMap.edges, ...edges],
          metadata: {
            ...currentMap.metadata,
            totalNodes: currentMap.nodes.length + nodes.length,
            maxDepth: Math.max(
              currentMap.metadata.maxDepth,
              Math.max(...nodes.map(n => n.level))
            ),
            lastModified: new Date(),
          },
        };

        set({ currentMap: updatedMap });
      },
    }),
    {
      name: 'cogninode-storage',
      partialize: (state) => ({
        progress: state.progress,
        currentMap: state.currentMap,
      }),
    }
  )
);