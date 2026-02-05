'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Connection,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { CustomNode, nodeTypes } from './CustomNode';
import { useStore } from '../lib/store';
import type { Node as AppNode } from '../lib/types';

interface GraphCanvasProps {
  onNodeExpand: (nodeId: string, nodeTitle: string, context: string[]) => void;
  onNodeSelect: (node: AppNode) => void;
}

export function GraphCanvas({ onNodeExpand, onNodeSelect }: GraphCanvasProps) {
  const { currentMap, updateNodeStatus } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert app nodes to React Flow nodes
  const convertToReactFlowNodes = useCallback((appNodes: AppNode[]): Node[] => {
    return appNodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: {
        ...node,
        onExpand: (nodeId: string) => {
          const nodeData = appNodes.find(n => n.id === nodeId);
          if (nodeData) {
            // Build context path
            const context = [nodeData.title];
            onNodeExpand(nodeId, nodeData.title, context);
          }
        },
        onOpenCard: (node: AppNode) => {
          onNodeSelect(node);
        },
        onStatusChange: (nodeId: string, status: AppNode['status']) => {
          updateNodeStatus(nodeId, status);
        },
      },
      draggable: true,
    }));
  }, [onNodeExpand, onNodeSelect, updateNodeStatus]);

  // Update nodes and edges when currentMap changes
  useEffect(() => {
    if (currentMap) {
      const reactFlowNodes = convertToReactFlowNodes(currentMap.nodes);
      const reactFlowEdges = currentMap.edges.map(edge => ({
        ...edge,
        animated: true,
        style: {
          stroke: '#00f5ff',
          strokeWidth: 2,
        },
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    }
  }, [currentMap, convertToReactFlowNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!currentMap) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🧠</div>
          <h2 className="text-2xl font-bold text-accent-primary">
            Ready to Learn?
          </h2>
          <p className="text-text-muted max-w-md">
            Enter a topic above to generate your personalized learning map.
            Watch as AI creates an interactive knowledge graph that adapts to your curiosity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        className="bg-gradient-to-br from-bg-primary to-bg-secondary"
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls 
          className="bg-bg-secondary border border-accent-primary rounded-lg"
          showInteractive={false}
        />
        
        <MiniMap
          className="bg-bg-secondary border border-accent-primary rounded-lg"
          nodeColor={(node) => {
            const nodeData = node.data as AppNode;
            switch (nodeData.status) {
              case 'mastered': return '#00ff88';
              case 'learning': return '#ffd700';
              case 'skipped': return '#ff4757';
              default: return '#4a5568';
            }
          }}
          maskColor="rgba(10, 10, 15, 0.8)"
        />
        
        <Background 
          color="#00f5ff" 
          gap={20} 
          size={1}
          variant="dots"
        />
      </ReactFlow>

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <div className="text-center space-y-4">
            <div className="loading-spinner w-12 h-12 mx-auto"></div>
            <p className="text-accent-primary font-medium">
              Expanding your knowledge...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export function GraphCanvasWrapper(props: GraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <GraphCanvas {...props} />
    </ReactFlowProvider>
  );
}