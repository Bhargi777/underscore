import { NextRequest, NextResponse } from 'next/server';
import { expandNode } from '../../../lib/gemini';
import { calculateNodePositions, generateEdges, generateId } from '../../../lib/utils';
import type { ExpandNodeRequest, ExpandNodeResponse } from '../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: ExpandNodeRequest = await request.json();
    const { nodeId, parentTopic, context } = body;

    if (!nodeId || !parentTopic) {
      return NextResponse.json(
        { error: 'Node ID and parent topic are required' },
        { status: 400 }
      );
    }

    // Generate expanded nodes using Gemini
    const aiResponse = await expandNode(parentTopic, context || []);
    
    if (!aiResponse.nodes || !Array.isArray(aiResponse.nodes)) {
      throw new Error('Invalid response format from AI');
    }

    // Get parent node position from request (should be included in real implementation)
    const parentPosition = { x: 0, y: 0 }; // This should come from the request

    // Process the nodes with proper positioning
    const processedNodes = aiResponse.nodes.map((node: any, index: number) => {
      const angleStep = (2 * Math.PI) / aiResponse.nodes.length;
      const angle = index * angleStep;
      const radius = 200;
      
      return {
        ...node,
        id: node.id || generateId(),
        type: 'leaf' as const,
        level: 2, // Assuming this is level 2 expansion
        parentId: nodeId,
        position: {
          x: parentPosition.x + radius * Math.cos(angle),
          y: parentPosition.y + radius * Math.sin(angle),
        },
        status: 'unexplored' as const,
        metadata: {
          difficulty: node.difficulty || 'beginner',
          estimatedTime: node.estimatedTime || 30,
          prerequisites: [],
        },
      };
    });

    // Generate edges connecting to parent
    const edges = generateEdges(processedNodes, nodeId);

    const response: ExpandNodeResponse = {
      nodes: processedNodes,
      edges,
    };

    return NextResponse.json({ 
      success: true, 
      data: response 
    });

  } catch (error) {
    console.error('Error expanding node:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to expand node',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}