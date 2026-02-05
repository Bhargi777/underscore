'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Brain, Zap, BookOpen, Target } from 'lucide-react';
import { GraphCanvasWrapper } from '../components/GraphCanvas';
import { KnowledgeCard } from '../components/KnowledgeCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useStore } from '../lib/store';
import { generateId } from '../lib/utils';
import type { Node, LearningMap, KnowledgeCard as KnowledgeCardType } from '../lib/types';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [showKnowledgeCard, setShowKnowledgeCard] = useState(false);
  
  const { 
    currentMap, 
    knowledgeCard,
    setCurrentMap, 
    setKnowledgeCard,
    addNodes,
    setError 
  } = useStore();

  const handleGenerateMap = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate map');
      }

      if (data.success && data.map) {
        setCurrentMap(data.map);
      }
    } catch (error) {
      console.error('Error generating map:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate learning map');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNodeExpand = async (nodeId: string, nodeTitle: string, context: string[]) => {
    setIsExpanding(true);
    setError(null);

    try {
      const response = await fetch('/api/expand-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          parentTopic: nodeTitle,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to expand node');
      }

      if (data.success && data.data) {
        addNodes(data.data.nodes, data.data.edges);
      }
    } catch (error) {
      console.error('Error expanding node:', error);
      setError(error instanceof Error ? error.message : 'Failed to expand node');
    } finally {
      setIsExpanding(false);
    }
  };

  const handleNodeSelect = async (node: Node) => {
    setIsLoadingCard(true);
    setShowKnowledgeCard(true);
    setKnowledgeCard(null);

    try {
      const response = await fetch('/api/knowledge-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId: node.id,
          nodeTitle: node.title,
          nodeDescription: node.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load knowledge card');
      }

      if (data.success && data.data) {
        setKnowledgeCard(data.data);
      }
    } catch (error) {
      console.error('Error loading knowledge card:', error);
      setError(error instanceof Error ? error.message : 'Failed to load knowledge card');
    } finally {
      setIsLoadingCard(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerateMap();
    }
  };

  const sampleTopics = [
    'Machine Learning',
    'React Development',
    'Quantum Computing',
    'Digital Marketing',
    'Blockchain Technology',
    'Data Science',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      {/* Header */}
      <header className="border-b border-accent-primary/20 bg-bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-accent-primary/20 rounded-lg">
                <Brain className="text-accent-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-accent-primary">
                  CogniNode
                </h1>
                <p className="text-text-muted text-sm">
                  The Recursive AI Learning Map
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="hidden md:flex items-center gap-6 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent-primary" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-accent-secondary" />
                  <span>Recursive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-accent-tertiary" />
                  <span>Adaptive</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col h-[calc(100vh-80px)]">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-accent-primary/20 bg-bg-secondary/30 backdrop-blur-sm"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
                <Input
                  placeholder="Enter any topic to start learning... (e.g., Machine Learning, React, Quantum Physics)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg"
                  disabled={isGenerating}
                />
              </div>
              <Button
                onClick={handleGenerateMap}
                disabled={!topic.trim() || isGenerating}
                size="lg"
                variant="primary"
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Generate Map
                  </>
                )}
              </Button>
            </div>

            {/* Sample Topics */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-text-muted text-sm">Try:</span>
              {sampleTopics.map((sampleTopic) => (
                <button
                  key={sampleTopic}
                  onClick={() => setTopic(sampleTopic)}
                  className="px-3 py-1 bg-bg-tertiary/50 text-text-secondary text-sm rounded-full border border-accent-primary/20 hover:border-accent-primary/40 hover:text-accent-primary transition-all"
                  disabled={isGenerating}
                >
                  {sampleTopic}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Graph Canvas */}
        <div className="flex-1 relative">
          <GraphCanvasWrapper
            onNodeExpand={handleNodeExpand}
            onNodeSelect={handleNodeSelect}
          />

          {/* Loading Overlays */}
          {isExpanding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 bg-bg-secondary/90 backdrop-blur-sm border border-accent-primary/30 rounded-lg p-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="loading-spinner w-5 h-5" />
                <span className="text-accent-primary font-medium">
                  Expanding knowledge...
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Knowledge Card Modal */}
        <KnowledgeCard
          isOpen={showKnowledgeCard}
          onClose={() => {
            setShowKnowledgeCard(false);
            setKnowledgeCard(null);
          }}
          knowledgeCard={knowledgeCard}
          isLoading={isLoadingCard}
        />

        {/* Welcome Message */}
        {!currentMap && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center space-y-6 max-w-2xl px-6">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl mb-6"
              >
                🧠
              </motion.div>
              
              <h2 className="text-4xl font-bold text-accent-primary mb-4">
                Welcome to CogniNode
              </h2>
              
              <p className="text-xl text-text-secondary leading-relaxed">
                Transform any topic into an interactive learning journey. 
                Watch as AI creates a personalized knowledge map that grows with your curiosity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center mx-auto">
                    <Sparkles className="text-accent-primary" size={24} />
                  </div>
                  <h3 className="font-semibold text-text-primary">AI-Generated</h3>
                  <p className="text-text-muted text-sm">
                    Intelligent topic breakdown powered by advanced AI
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center mx-auto">
                    <Zap className="text-accent-secondary" size={24} />
                  </div>
                  <h3 className="font-semibold text-text-primary">Recursive</h3>
                  <p className="text-text-muted text-sm">
                    Click any node to expand deeper into subtopics
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-accent-tertiary/20 rounded-lg flex items-center justify-center mx-auto">
                    <BookOpen className="text-accent-tertiary" size={24} />
                  </div>
                  <h3 className="font-semibold text-text-primary">Interactive</h3>
                  <p className="text-text-muted text-sm">
                    Rich knowledge cards with resources and examples
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}