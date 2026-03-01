"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/api/client';
import GraphView from '@/components/GraphView';
import { FileText, Lightbulb, Activity, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

export default function ProjectWorkspace() {
    const params = useParams();
    const id = params?.id as string;
    const [project, setProject] = useState<any>(null);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [activeTab, setActiveTab] = useState<'papers' | 'ideas'>('papers');

    useEffect(() => {
        if (!id) return;
        apiClient.get(`/projects/${id}`).then(res => setProject(res.data));
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Workspace Header */}
            <header className="h-16 px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <Link href="/projects" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-white backdrop-blur-sm border border-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight flex items-center gap-3">
                            {project.name}
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${project.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                {project.status}
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm text-muted-foreground">
                        Literature <span className="text-white ml-2">10%</span>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm text-muted-foreground">
                        Method <span className="text-white ml-2">0%</span>
                    </div>
                </div>
            </header>

            {/* 3-Pane Layout */}
            <div className="flex-1 flex overflow-hidden p-4 pt-0 gap-4">

                {/* Left: Papers (Glass Sidebar) */}
                <div className="w-80 glass-panel rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5 font-medium flex items-center gap-2 text-sm text-white/80 bg-white/5">
                        <FileText size={16} className="text-blue-400" /> Papers
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        <div className="text-sm text-muted-foreground text-center mt-10">
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                id="paper-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const formData = new FormData();
                                        formData.append('file', e.target.files[0]);
                                        formData.append('project_id', id);
                                        formData.append('scope', 'project');
                                        try {
                                            await apiClient.post('/papers/upload', formData);
                                            alert("Paper uploaded successfully! Processing will occur in background.");
                                        } catch (err) {
                                            alert("Upload failed.");
                                            console.error(err);
                                        }
                                    }
                                }}
                            />
                            <label
                                htmlFor="paper-upload"
                                className="mt-2 text-primary hover:text-white hover:underline cursor-pointer inline-block transition-colors"
                            >
                                + Upload Paper
                            </label>
                        </div>
                    </div>
                </div>

                {/* Center: KG (Transparent) */}
                <div className="flex-1 relative rounded-2xl border border-white/5 overflow-hidden bg-black/20">
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-muted-foreground">
                            {project.domain}
                        </span>
                    </div>

                    <GraphView data={graphData} />

                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center px-4 text-xs text-muted-foreground">
                        {graphData.nodes.length} Nodes • {graphData.links.length} Relations
                    </div>
                </div>

                {/* Right: Ideas/Signals (Glass Sidebar) */}
                <div className="w-80 glass-panel rounded-2xl flex flex-col overflow-hidden">
                    <div className="flex border-b border-white/5">
                        <button
                            onClick={() => setActiveTab('papers')}
                            className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'papers' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                        >
                            <Activity size={16} /> Activity
                        </button>
                        <button
                            onClick={() => setActiveTab('ideas')}
                            className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'ideas' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                        >
                            <Lightbulb size={16} /> Ideas
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {activeTab === 'papers' && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Upcoming Tasks</h3>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-sm group-hover:text-primary transition-colors">Define Model</span>
                                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">High</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Due: Tomorrow</div>
                                </div>

                                <div className="text-center py-4">
                                    <button className="text-xs text-primary hover:text-white transition-colors">+ Add Task</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ideas' && (
                            <div className="text-sm text-muted-foreground text-center mt-10">
                                No active ideas.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
