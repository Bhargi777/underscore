import { NextRequest, NextResponse } from 'next/server';
import { generateKnowledgeCard } from '../../../lib/gemini';
import config from '../../../lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeTitle, nodeDescription } = body;

    if (!nodeTitle) {
      return NextResponse.json(
        { error: 'Node title is required' },
        { status: 400 }
      );
    }

    // Generate knowledge card using Gemini
    const aiResponse = await generateKnowledgeCard(nodeTitle, nodeDescription || '');
    
    // Get YouTube resources
    let youtubeResources = [];
    if (config.youtube.apiKey) {
      try {
        youtubeResources = await searchYouTubeVideos(nodeTitle);
      } catch (error) {
        console.warn('YouTube search failed:', error);
      }
    }

    // Get web resources using Serper (if available)
    let webResources = [];
    if (config.serper.apiKey) {
      try {
        webResources = await searchWebResources(nodeTitle);
      } catch (error) {
        console.warn('Web search failed:', error);
      }
    }

    // Combine all resources
    const allResources = [...youtubeResources, ...webResources];

    const knowledgeCard = {
      nodeId: body.nodeId || 'unknown',
      summary: aiResponse.summary,
      codeExample: aiResponse.codeExample,
      keyPoints: aiResponse.keyPoints || [],
      nextSteps: aiResponse.nextSteps || [],
      resources: allResources.slice(0, 6), // Limit to 6 resources
    };

    return NextResponse.json({ 
      success: true, 
      data: knowledgeCard 
    });

  } catch (error) {
    console.error('Error generating knowledge card:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate knowledge card',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function searchYouTubeVideos(query: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' tutorial')}&type=video&maxResults=3&key=${config.youtube.apiKey}`
  );

  if (!response.ok) {
    throw new Error('YouTube API request failed');
  }

  const data = await response.json();
  
  return data.items?.map((item: any) => ({
    id: item.id.videoId,
    type: 'video',
    title: item.snippet.title,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    description: item.snippet.description.slice(0, 200) + '...',
    thumbnail: item.snippet.thumbnails.medium?.url,
    difficulty: 'beginner', // Default difficulty
  })) || [];
}

async function searchWebResources(query: string) {
  if (!config.serper.apiKey) return [];

  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': config.serper.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: `${query} tutorial guide documentation`,
        num: 3,
      }),
    });

    if (!response.ok) {
      throw new Error('Serper API request failed');
    }

    const data = await response.json();
    
    return data.organic?.map((item: any, index: number) => ({
      id: `web-${index}`,
      type: 'article',
      title: item.title,
      url: item.link,
      description: item.snippet || '',
      difficulty: 'intermediate', // Default difficulty
    })) || [];
  } catch (error) {
    console.warn('Serper search failed:', error);
    return [];
  }
}