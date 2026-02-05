import { NextRequest, NextResponse } from 'next/server';
import { generateLearningMap } from '../../../lib/gemini';
import { calculateNodePositions, generateEdges, generateId } from '../../../lib/utils';
import type { GenerateMapRequest, GenerateMapResponse, LearningMap } from '../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateMapRequest = await request.json();
    const { topic, depth = 1 } = body;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Generate the learning map using Gemini
    const aiResponse = await generateLearningMap(topic.trim());
    
    if (!aiResponse.nodes || !Array.isArray(aiResponse.nodes)) {
      throw new Error('Invalid response format from AI');
    }

    // Process the nodes with proper positioning and metadata
    const processedNodes = calculateNodePositions(aiResponse.nodes, undefined, 0);
    
    // Create the root node
    const rootNode = {
      id: generateId(),
      type: 'root' as const,
      title: topic,
      description: `Master the fundamentals and advanced concepts of ${topic}`,
      level: 0,
      position: { x: 0, y: -200 },
      status: 'unexplored' as const,
      metadata: {
        difficulty: 'beginner' as const,
        estimatedTime: 0,
        prerequisites: [],
      },
    };

    // Position child nodes around the root
    const childNodes = processedNodes.map((node, index) => {
      const angleStep = (2 * Math.PI) / processedNodes.length;
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const radius = 300;
      
      return {
        ...node,
        type: 'branch' as const,
        level: 1,
        parentId: rootNode.id,
        position: {
          x: rootNode.position.x + radius * Math.cos(angle),
          y: rootNode.position.y + radius * Math.sin(angle),
        },
      };
    });

    const allNodes = [rootNode, ...childNodes];
    const edges = generateEdges(childNodes, rootNode.id);

    // Create the complete learning map
    const learningMap: LearningMap = {
      id: generateId(),
      title: `${topic} Learning Map`,
      rootTopic: topic,
      nodes: allNodes,
      edges,
      metadata: {
        totalNodes: allNodes.length,
        maxDepth: 1,
        createdAt: new Date(),
        lastModified: new Date(),
      },
    };

    const response: GenerateMapResponse = {
      nodes: allNodes,
      edges,
    };

    return NextResponse.json({ 
      success: true, 
      data: response,
      map: learningMap 
    });

  } catch (error) {
    console.error('Error generating map:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate learning map',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}