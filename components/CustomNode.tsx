import React from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Zap, CheckCircle, XCircle, Play } from 'lucide-react';
import { cn, getStatusColor, getDifficultyColor, formatDuration } from '../lib/utils';
import type { Node } from '../lib/types';

interface CustomNodeProps {
  data: Node & {
    onExpand?: (nodeId: string) => void;
    onOpenCard?: (node: Node) => void;
    onStatusChange?: (nodeId: string, status: Node['status']) => void;
  };
  selected?: boolean;
}

export function CustomNode({ data, selected }: CustomNodeProps) {
  const {
    id,
    type,
    title,
    description,
    status,
    metadata,
    onExpand,
    onOpenCard,
    onStatusChange,
  } = data;

  const statusColor = getStatusColor(status);
  const difficultyColor = getDifficultyColor(metadata.difficulty);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand?.(id);
  };

  const handleOpenCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenCard?.(data);
  };

  const handleStatusChange = (newStatus: Node['status']) => {
    onStatusChange?.(id, newStatus);
  };

  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <motion.div
        variants={nodeVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className={cn(
          'relative min-w-[200px] max-w-[280px] p-4 rounded-lg border-2 cursor-pointer',
          'transition-all duration-300 shadow-lg',
          {
            // Node type styles
            'bg-gradient-to-br from-accent-primary to-accent-secondary border-accent-primary shadow-accent-primary/50':
              type === 'root',
            'bg-bg-tertiary border-accent-tertiary shadow-accent-tertiary/30':
              type === 'branch',
            'bg-bg-secondary border-text-secondary shadow-text-secondary/20':
              type === 'leaf',
            
            // Selected state
            'ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary':
              selected,
          }
        )}
        style={{
          boxShadow: type === 'root' 
            ? `0 0 20px ${statusColor}` 
            : `0 4px 12px ${statusColor}20`,
        }}
      >
        {/* Status indicator */}
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-bg-primary flex items-center justify-center"
          style={{ backgroundColor: statusColor }}
        >
          {status === 'mastered' && <CheckCircle size={14} className="text-white" />}
          {status === 'learning' && <Play size={12} className="text-white" />}
          {status === 'skipped' && <XCircle size={14} className="text-white" />}
        </div>

        {/* Difficulty indicator */}
        <div
          className="absolute -top-2 -left-2 w-4 h-4 rounded-full border border-bg-primary"
          style={{ backgroundColor: difficultyColor }}
          title={`Difficulty: ${metadata.difficulty}`}
        />

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className={cn(
              'font-semibold text-sm leading-tight',
              type === 'root' ? 'text-bg-primary' : 'text-text-primary'
            )}>
              {title}
            </h3>
            <p className={cn(
              'text-xs mt-1 line-clamp-2',
              type === 'root' ? 'text-bg-primary/80' : 'text-text-muted'
            )}>
              {description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{formatDuration(metadata.estimatedTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span className="capitalize">{metadata.difficulty}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {type !== 'leaf' && (
              <button
                onClick={handleExpand}
                className={cn(
                  'flex-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                  'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary hover:text-bg-primary'
                )}
              >
                <Zap size={12} className="inline mr-1" />
                Expand
              </button>
            )}
            
            {type === 'leaf' && (
              <button
                onClick={handleOpenCard}
                className={cn(
                  'flex-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                  'bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary hover:text-white'
                )}
              >
                <BookOpen size={12} className="inline mr-1" />
                Learn
              </button>
            )}
          </div>

          {/* Status controls */}
          <div className="flex gap-1">
            {(['learning', 'mastered', 'skipped'] as const).map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => handleStatusChange(statusOption)}
                className={cn(
                  'flex-1 px-1 py-1 rounded text-xs transition-colors',
                  status === statusOption
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                )}
                style={{
                  backgroundColor: status === statusOption ? getStatusColor(statusOption) : undefined
                }}
              >
                {statusOption === 'learning' && '📚'}
                {statusOption === 'mastered' && '✅'}
                {statusOption === 'skipped' && '⏭️'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </>
  );
}

// Node types for React Flow
export const nodeTypes = {
  custom: CustomNode,
};