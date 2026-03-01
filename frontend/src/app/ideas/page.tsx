"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Sparkles, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface Idea {
    id: number;
    title: string;
    summary: string;
    status: string;
}

export default function IdeasPage() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/ideas/')
            .then(res => setIdeas(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Idea Backlog</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage, mature, and promote your research ideas.</p>
                </div>
                <button className="bg-primary/80 backdrop-blur-md text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-primary/25">
                    <Sparkles size={20} /> Generate Idea
                </button>
            </div>

            <div className="space-y-4">
                {ideas.map((idea, index) => (
                    <Link
                        key={idea.id}
                        href={`/ideas/${idea.id}`}
                    >
                        <GlassCard
                            hoverEffect={true}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 flex justify-between items-center group mb-4"
                        >
                            <div className="max-w-3xl">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{idea.title}</h3>
                                    <span className={`text-xs px-3 py-1 rounded-full border bg-white/5 backdrop-blur-sm ${idea.status === 'promoted' ? 'text-purple-400 border-purple-500/30' :
                                        idea.status === 'mature' ? 'text-blue-400 border-blue-500/30' :
                                            idea.status === 'rejected' ? 'text-red-400 border-red-500/30' :
                                                'text-gray-400 border-gray-500/30'
                                        }`}>
                                        {idea.status}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-base line-clamp-1 leading-relaxed">
                                    {idea.summary || "No summary provided."}
                                </p>
                            </div>

                            <div
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all ml-4"
                            >
                                <ArrowRight size={20} />
                            </div>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (confirm('Delete idea?')) {
                                        apiClient.delete(`/ideas/${idea.id}`).then(() => window.location.reload());
                                    }
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </GlassCard>
                    </Link>
                ))}

                {ideas.length === 0 && (
                    <GlassCard className="text-center py-20 flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-transparent shadow-none">
                        <p className="text-lg text-muted-foreground mb-2">No ideas yet.</p>
                        <p className="text-sm text-muted-foreground/50">Synthesize new ones from your research.</p>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
