import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, Calendar, AlertTriangle, Target } from 'lucide-react';
import apiClient from '@/api/client';
import { GlassCard } from '@/components/GlassCard';

interface Project {
    id: number;
    name: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onTaskCreated }) => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_datetime: '',
        importance: 5,
        severity: 5,
        linked_project_id: '',
        task_type: 'implementation'
    });

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        try {
            const res = await apiClient.get('/projects/');
            setProjects(res.data);
            if (res.data.length > 0 && !formData.linked_project_id) {
                setFormData(prev => ({ ...prev, linked_project_id: res.data[0].id.toString() }));
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                linked_project_id: formData.linked_project_id ? parseInt(formData.linked_project_id) : null,
                importance: parseInt(formData.importance.toString()),
                severity: parseInt(formData.severity.toString()),
            };

            // Backend requires either project or idea
            if (!payload.linked_project_id) {
                alert("Please select a project context for this task.");
                setLoading(false);
                return;
            }

            // Fix empty date
            if (!payload.due_datetime) {
                delete (payload as any).due_datetime;
            }

            await apiClient.post('/tasks/create', payload);
            onTaskCreated();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                due_datetime: '',
                importance: 5,
                severity: 5,
                linked_project_id: projects[0]?.id.toString() || '',
                task_type: 'implementation'
            });
        } catch (err) {
            console.error(err);
            alert("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-lg p-4">
                            <GlassCard className="w-full flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border-white/10 bg-slate-900/80">
                                <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Target className="text-primary" /> New Task
                                    </h2>
                                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Title</label>
                                            <input
                                                required
                                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all placeholder:text-white/20"
                                                placeholder="Task Title..."
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Project Context</label>
                                                <select
                                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none cursor-pointer appearance-none"
                                                    value={formData.linked_project_id}
                                                    onChange={e => setFormData({ ...formData, linked_project_id: e.target.value })}
                                                >
                                                    <option value="" className="bg-slate-900 text-white/50">Select Project...</option>
                                                    {projects.map(p => (
                                                        <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Type</label>
                                                <select
                                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none cursor-pointer appearance-none"
                                                    value={formData.task_type}
                                                    onChange={e => setFormData({ ...formData, task_type: e.target.value })}
                                                >
                                                    <option value="implementation" className="bg-slate-900">Implementation</option>
                                                    <option value="research" className="bg-slate-900">Research</option>
                                                    <option value="bug" className="bg-slate-900">Bug Fix</option>
                                                    <option value="review" className="bg-slate-900">Review</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/70 uppercase tracking-wider flex items-center gap-2">
                                                    Importance <span className="text-white/40 font-normal">1-10</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all"
                                                    value={formData.importance}
                                                    onChange={e => setFormData({ ...formData, importance: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/70 uppercase tracking-wider flex items-center gap-2">
                                                    Severity <span className="text-white/40 font-normal">1-10</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all"
                                                    value={formData.severity}
                                                    onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Due Date</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 text-white outline-none transition-all [color-scheme:dark]"
                                                value={formData.due_datetime}
                                                onChange={e => setFormData({ ...formData, due_datetime: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50 text-sm font-medium"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                                Create Task
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
