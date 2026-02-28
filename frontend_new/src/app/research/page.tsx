"use client";

import React, { useState } from 'react';
import { Search, Maximize2, Minimize2 } from 'lucide-react';
import GraphView from '@/components/GraphView';
import { ResearchChat } from '@/components/ResearchChat';
import { PDFUploader } from '@/components/PDFUploader';
import { motion } from 'framer-motion';

export default function ResearchPage() {
    const [query, setQuery] = useState('');
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);

    return (
        <div className="h-full flex flex-col gap-4 p-4 relative overflow-hidden">
            {/* Header / Search Area */}
            <div className="shrink-0 z-10 flex justify-center">
                <div className="max-w-2xl w-full relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="glass-panel rounded-2xl flex items-center px-4 py-3 gap-3 relative">
                        <Search className="text-muted-foreground w-5 h-5" />
                        <input
                            className="bg-transparent outline-none flex-1 text-base placeholder:text-muted-foreground/50 text-foreground"
                            placeholder="Search global knowledge (e.g. 'Diffusion Models')..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Workspace Area (3 Columns) */}
            <div className="flex-1 flex gap-4 overflow-hidden relative">

                {/* Left Column: Uploads & Knowledge */}
                <motion.div
                    initial={{ width: 320, opacity: 1 }}
                    animate={{ width: leftPanelOpen ? 320 : 0, opacity: leftPanelOpen ? 1 : 0 }}
                    className="flex flex-col gap-4 shrink-0 overflow-hidden"
                >
                    <PDFUploader className="h-64 shrink-0" />
                    <div className="glass-panel flex-1 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Recent Papers</h3>
                        {/* Placeholder for recent uploads list - could be a separate component */}
                        <div className="text-center text-muted-foreground text-xs py-10 opacity-50">
                            Recent uploads will appear here.
                        </div>
                    </div>
                </motion.div>

                {/* Center Column: Graph View */}
                <div className="flex-1 relative rounded-2xl border border-white/5 overflow-hidden bg-black/20 flex flex-col">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <button
                            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                            className="p-2 glass-button rounded-lg bg-black/40 hover:bg-white/10 text-white/70"
                            title="Toggle Sidebar"
                        >
                            {leftPanelOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button
                            onClick={() => setRightPanelOpen(!rightPanelOpen)}
                            className="p-2 glass-button rounded-lg bg-black/40 hover:bg-white/10 text-white/70"
                            title="Toggle Chat"
                        >
                            {rightPanelOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>

                    <GraphView data={{ nodes: [], links: [] }} />

                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex justify-center">
                        <p className="text-xs text-muted-foreground/50">Shift+Click to multi-select nodes • Drag to pan • Scroll to zoom</p>
                    </div>
                </div>

                {/* Right Column: Chat */}
                <motion.div
                    initial={{ width: 350, opacity: 1 }}
                    animate={{ width: rightPanelOpen ? 350 : 0, opacity: rightPanelOpen ? 1 : 0 }}
                    className="flex flex-col gap-4 shrink-0 overflow-hidden"
                >
                    <ResearchChat className="h-full" />
                </motion.div>

            </div>
        </div>
    );
}
