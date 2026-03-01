"use client";

import React, { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Calendar, CheckSquare, Plus, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { CreateTaskModal } from '@/components/CreateTaskModal';

interface Task {
    id: number;
    title: string;
    due_datetime: string;
    severity: number;
    importance: number;
    status: string;
    task_type: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        apiClient.get('/tasks/').then(res => setTasks(res.data));
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        await apiClient.patch(`/tasks/${id}`, { status: newStatus });
        fetchTasks();
    };

    const handleDeleteTask = async (id: number) => {
        await apiClient.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const activeTasks = tasks.filter(t => filter === 'all' || (filter === 'active' && t.status !== 'done'));

    return (
        <div className="flex h-full gap-6 p-6 overflow-hidden relative">
            {/* Left Sidebar: Stats & Calendar */}
            <div className="w-80 glass-panel rounded-2xl p-6 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
                <div>
                    <h2 className="font-semibold mb-4 flex items-center gap-2 text-primary"><Calendar size={20} /> Schedule</h2>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-muted-foreground text-sm shadow-inner min-h-[150px] flex items-center justify-center">
                        <span className="opacity-50">Calendar Integration Pending</span>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold mb-4 flex items-center gap-2 text-primary"><Clock size={20} /> Upcoming</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                            <span className="text-white/90">Paper Submission</span>
                            <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs border border-red-500/20">2d</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content: Execution Board */}
            <div className="flex-1 glass-panel rounded-2xl p-8 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Execution</h1>
                        <p className="text-muted-foreground mt-1">Focus on what matters. Severity × Importance.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary/80 backdrop-blur-md text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
                    >
                        <Plus size={18} /> New Task
                    </button>
                </div>

                <div className="flex gap-4 mb-6 border-b border-white/10 pb-1 shrink-0">
                    <button
                        onClick={() => setFilter('active')}
                        className={`pb-2 px-3 transition-all ${filter === 'active' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`pb-2 px-3 transition-all ${filter === 'all' ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground hover:text-white'}`}
                    >
                        All History
                    </button>
                </div>

                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
                    {activeTasks.map(task => (
                        <div key={task.id} className="group flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all hover:scale-[1.01] cursor-pointer">
                            <button
                                onClick={() => handleStatusChange(task.id, task.status === 'done' ? 'pending' : 'done')}
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 hover:border-emerald-500'}`}
                            >
                                {task.status === 'done' && <CheckSquare size={14} />}
                            </button>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-medium text-lg ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-white'}`}>
                                        {task.title}
                                    </span>
                                    {task.severity >= 4 && <AlertCircle size={16} className="text-red-500 drop-shadow-md" />}
                                </div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                    <span className="capitalize bg-white/5 px-2 py-0.5 rounded border border-white/5">{task.task_type}</span>
                                    {task.due_datetime && <span>Due: {new Date(task.due_datetime).toLocaleDateString()}</span>}
                                </div>
                            </div>

                            <div className="text-right flex items-center gap-2">
                                <div className="text-[10px] font-mono bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-lg text-white/50 group-hover:text-white transition-colors">
                                    S{task.severity} • I{task.importance}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete task?')) handleDeleteTask(task.id);
                                    }}
                                    className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {activeTasks.length === 0 && (
                        <div className="text-center py-20 flex flex-col items-center justify-center border-dashed border-2 border-white/10 rounded-2xl">
                            <p className="text-muted-foreground text-lg">No active tasks.</p>
                            <p className="text-sm text-muted-foreground/50">You are free!</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTaskCreated={fetchTasks}
            />
        </div>
    );
}
