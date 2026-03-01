"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/client';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        domain: 'general',
        problem_statement: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiClient.post('/projects/create', formData);
            router.push('/projects');
        } catch (err) {
            console.error(err);
            alert("Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 w-full">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Create New Project</h1>
                    <p className="text-muted-foreground mt-2">Initialize a new research context to organize your papers and ideas.</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Project Name</label>
                            <input
                                required
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-muted-foreground/50 text-white"
                                placeholder="e.g. Diffusion Models for Climate"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Domain</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all appearance-none text-white cursor-pointer"
                                    value={formData.domain}
                                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                                >
                                    <option value="general" className="bg-slate-900">General</option>
                                    <option value="cs" className="bg-slate-900">Computer Science</option>
                                    <option value="physics" className="bg-slate-900">Physics</option>
                                    <option value="biology" className="bg-slate-900">Biology</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Problem Statement</label>
                            <textarea
                                required
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/10 outline-none transition-all min-h-[120px] placeholder:text-muted-foreground/50 text-white resize-none"
                                placeholder="What are the core questions you are trying to answer?"
                                value={formData.problem_statement}
                                onChange={e => setFormData({ ...formData, problem_statement: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                Create Workspace
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
