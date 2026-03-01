"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/api/client';
import { Plus, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';

interface Project {
    id: number;
    name: string;
    domain: string;
    status: string;
    problem_statement: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/projects/')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Projects</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your active research contexts.</p>
                </div>
                <Link href="/projects/create">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary/90 backdrop-blur text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        <Plus size={20} /> New Project
                    </motion.button>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <GlassCard
                            className="p-6 h-full flex flex-col cursor-pointer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold px-3 py-1 bg-secondary/80 backdrop-blur text-secondary-foreground rounded-full uppercase tracking-wider">
                                    {project.domain}
                                </span>
                                <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`} />
                            </div>
                            <div className="absolute top-4 right-4 z-20">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm("Delete project? This action cannot be undone.")) {
                                            apiClient.delete(`/projects/${project.id}`).then(() => window.location.reload());
                                        }
                                    }}
                                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 tracking-tight group-hover:text-primary transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-muted-foreground/80 text-sm line-clamp-3 mb-6 leading-relaxed">
                                {project.problem_statement}
                            </p>

                            <div className="mt-auto flex items-center text-sm font-medium text-primary/80 group-hover:text-primary transition-colors">
                                Open Workspace <ArrowRight size={16} className="ml-2" />
                            </div>
                        </GlassCard>
                    </Link>
                ))}

                {projects.length === 0 && (
                    <GlassCard className="col-span-full py-20 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/20 bg-transparent shadow-none">
                        <p className="text-lg text-muted-foreground">No projects found.</p>
                        <p className="text-sm text-muted-foreground/60 mb-6">Create one to start your research journey.</p>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
