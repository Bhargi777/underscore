"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useResizeObserver } from '@/hooks/useResizeObserver';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Loading Graph...</div>
});

interface GraphData {
    nodes: any[];
    links: any[];
}

interface GraphViewProps {
    data: GraphData;
    onNodeClick?: (node: any) => void;
}

const GraphView: React.FC<GraphViewProps> = ({ data, onNodeClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<any>(null); // Type is hard to import dynamically
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-transparent overflow-hidden relative">
            <ForceGraph2D
                ref={fgRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                backgroundColor="rgba(0,0,0,0)"
                nodeLabel="name"
                nodeColor={(node: any) => {
                    if (node.labels?.includes('Project')) return '#ef4444'; // Red-500
                    if (node.labels?.includes('Idea')) return '#a855f7'; // Purple-500
                    if (node.labels?.includes('Paper')) return '#3b82f6'; // Blue-500
                    return '#10b981'; // Emerald-500
                }}
                nodeRelSize={6}
                linkColor={() => 'rgba(255,255,255,0.2)'}
                onNodeClick={(node: any) => {
                    fgRef.current?.centerAt(node.x, node.y, 1000);
                    fgRef.current?.zoom(3, 2000);
                    if (onNodeClick) onNodeClick(node);
                }}
                cooldownTicks={100}
                d3VelocityDecay={0.6}
            />
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-3 text-xs rounded-xl border border-white/10 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Concept</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Paper</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Idea</div>
            </div>
        </div>
    );
};

export default GraphView;
