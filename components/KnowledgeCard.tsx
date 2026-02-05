'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Play, 
  FileText, 
  Code,
  Lightbulb,
  ArrowRight,
  Youtube,
  Globe
} from 'lucide-react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { cn, formatDuration } from '../lib/utils';
import type { KnowledgeCard as KnowledgeCardType, Resource } from '../lib/types';

interface KnowledgeCardProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeCard: KnowledgeCardType | null;
  isLoading?: boolean;
}

export function KnowledgeCard({ isOpen, onClose, knowledgeCard, isLoading }: KnowledgeCardProps) {
  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading Knowledge...">
        <div className="p-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-bg-tertiary rounded w-3/4"></div>
            <div className="h-4 bg-bg-tertiary rounded w-1/2"></div>
            <div className="h-32 bg-bg-tertiary rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-bg-tertiary rounded w-full"></div>
              <div className="h-4 bg-bg-tertiary rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  if (!knowledgeCard) return null;

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Youtube size={16} className="text-red-500" />;
      case 'article': return <Globe size={16} className="text-blue-500" />;
      case 'documentation': return <FileText size={16} className="text-green-500" />;
      case 'course': return <BookOpen size={16} className="text-purple-500" />;
      default: return <ExternalLink size={16} />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-text-muted';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <BookOpen className="text-accent-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-accent-primary">
                Knowledge Card
              </h2>
              <p className="text-text-muted">
                Deep dive into this concept
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="text-accent-secondary" size={20} />
            <h3 className="text-lg font-semibold text-text-primary">Overview</h3>
          </div>
          <div className="bg-bg-tertiary/50 rounded-lg p-4 border border-accent-primary/20">
            <p className="text-text-secondary leading-relaxed">
              {knowledgeCard.summary}
            </p>
          </div>
        </motion.div>

        {/* Key Points */}
        {knowledgeCard.keyPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <ArrowRight className="text-accent-primary" size={20} />
              <h3 className="text-lg font-semibold text-text-primary">Key Points</h3>
            </div>
            <div className="grid gap-3">
              {knowledgeCard.keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-bg-tertiary/30 rounded-lg border border-accent-tertiary/20"
                >
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Code Example */}
        {knowledgeCard.codeExample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Code className="text-accent-tertiary" size={20} />
              <h3 className="text-lg font-semibold text-text-primary">Code Example</h3>
              <span className="px-2 py-1 bg-accent-tertiary/20 text-accent-tertiary text-xs rounded">
                {knowledgeCard.codeExample.language}
              </span>
            </div>
            <div className="bg-bg-primary rounded-lg border border-accent-tertiary/30 overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-text-primary">
                  {knowledgeCard.codeExample.code}
                </code>
              </pre>
              {knowledgeCard.codeExample.explanation && (
                <div className="px-4 py-3 bg-bg-tertiary/30 border-t border-accent-tertiary/20">
                  <p className="text-text-muted text-sm">
                    {knowledgeCard.codeExample.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Resources */}
        {knowledgeCard.resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="text-accent-secondary" size={20} />
              <h3 className="text-lg font-semibold text-text-primary">Learning Resources</h3>
            </div>
            <div className="grid gap-3">
              {knowledgeCard.resources.map((resource, index) => (
                <motion.a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-bg-tertiary/30 rounded-lg border border-accent-primary/20 hover:border-accent-primary/40 transition-all group"
                >
                  <div className="flex-shrink-0 p-2 bg-bg-secondary rounded-lg">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1">
                        {resource.title}
                      </h4>
                      <ExternalLink size={14} className="text-text-muted group-hover:text-accent-primary transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-text-muted text-sm mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className={cn('font-medium', getDifficultyColor(resource.difficulty))}>
                        {resource.difficulty}
                      </span>
                      {resource.duration && (
                        <span className="text-text-muted flex items-center gap-1">
                          <Clock size={12} />
                          {formatDuration(resource.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {knowledgeCard.nextSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Play className="text-status-learning" size={20} />
              <h3 className="text-lg font-semibold text-text-primary">Next Steps</h3>
            </div>
            <div className="grid gap-3">
              {knowledgeCard.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-status-learning/10 rounded-lg border border-status-learning/20"
                >
                  <div className="w-6 h-6 bg-status-learning text-bg-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-text-secondary">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3 pt-4 border-t border-accent-primary/20"
        >
          <Button variant="primary" className="flex-1">
            Mark as Learning
          </Button>
          <Button variant="secondary" className="flex-1">
            Mark as Mastered
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}