import { GoogleGenerativeAI } from '@google/generative-ai';
import config, { validateConfig } from './config';

// Initialize Gemini
let genAI: GoogleGenerativeAI;

try {
  validateConfig();
  genAI = new GoogleGenerativeAI(config.gemini.apiKey!);
} catch (error) {
  console.error('Gemini initialization failed:', error);
}

// Get the model
const model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

export async function generateLearningMap(topic: string): Promise<any> {
  if (!model) {
    throw new Error('Gemini model not initialized. Check your API key.');
  }

  const prompt = `
You are an expert learning designer. Create a comprehensive learning map for: "${topic}"

Generate exactly 6-8 main subtopics that cover this subject comprehensively.
Each subtopic should be:
- Specific and actionable
- Logically sequenced
- Appropriate for progressive learning
- Cover different aspects of the main topic

Return ONLY valid JSON in this exact format (no markdown, no explanations):
{
  "nodes": [
    {
      "id": "unique-id-1",
      "title": "Subtopic Title",
      "description": "Brief 1-sentence description of what this covers",
      "difficulty": "beginner",
      "estimatedTime": 45
    },
    {
      "id": "unique-id-2", 
      "title": "Another Subtopic",
      "description": "Brief 1-sentence description",
      "difficulty": "intermediate",
      "estimatedTime": 60
    }
  ]
}

Make sure each node has a unique ID and the difficulty progresses logically.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating learning map:', error);
    throw new Error('Failed to generate learning map. Please try again.');
  }
}

export async function expandNode(nodeTitle: string, parentContext: string[]): Promise<any> {
  if (!model) {
    throw new Error('Gemini model not initialized. Check your API key.');
  }

  const prompt = `
You are expanding the learning topic: "${nodeTitle}"
Parent context: ${parentContext.join(' → ')}

Generate 4-6 specific sub-concepts that break down this topic into learnable chunks.
Focus on practical, specific concepts that a learner can master individually.

Return ONLY valid JSON in this exact format (no markdown, no explanations):
{
  "nodes": [
    {
      "id": "unique-id-1",
      "title": "Specific Sub-concept",
      "description": "Brief 1-sentence description",
      "difficulty": "beginner",
      "estimatedTime": 30
    }
  ]
}

Make each sub-concept specific and actionable, not too broad.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error expanding node:', error);
    throw new Error('Failed to expand node. Please try again.');
  }
}

export async function generateKnowledgeCard(nodeTitle: string, nodeDescription: string): Promise<any> {
  if (!model) {
    throw new Error('Gemini model not initialized. Check your API key.');
  }

  const prompt = `
Create a comprehensive knowledge card for: "${nodeTitle}"
Description: ${nodeDescription}

Generate educational content that helps someone learn this topic effectively.

Return ONLY valid JSON in this exact format (no markdown, no explanations):
{
  "summary": "A comprehensive 200-300 word explanation that covers the key concepts, why it's important, and how it fits into the broader topic. Make it engaging and educational.",
  "keyPoints": [
    "Key concept or principle 1",
    "Key concept or principle 2", 
    "Key concept or principle 3",
    "Key concept or principle 4"
  ],
  "codeExample": {
    "language": "javascript",
    "code": "// Relevant code example if this is a technical topic\nconsole.log('Hello World');",
    "explanation": "Brief explanation of what this code demonstrates"
  },
  "nextSteps": [
    "Suggested next learning step 1",
    "Suggested next learning step 2",
    "Suggested next learning step 3"
  ]
}

If the topic is not technical, omit the codeExample field entirely.
Make the content educational, engaging, and actionable.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating knowledge card:', error);
    throw new Error('Failed to generate knowledge card. Please try again.');
  }
}