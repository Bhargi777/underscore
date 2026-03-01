import React, { useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/api/client';
import { GlassCard } from '@/components/GlassCard';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ResearchChatProps {
    className?: string;
    context?: any;
}

export const ResearchChat: React.FC<ResearchChatProps> = ({ className, context }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I can help you explore the research graph. What are you looking for?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await apiClient.post('/research/chat', {
                message: userMsg,
                context: context
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className={`flex flex-col h-full overflow-hidden ${className}`}>
            <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
                <Sparkles className="text-primary" size={18} />
                <h3 className="font-semibold text-white">Research Copilot</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary/20 border border-primary/20 text-white rounded-tr-sm'
                                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm text-muted-foreground flex items-center gap-2 text-sm">
                                <Loader2 className="animate-spin" size={12} /> Thinking...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5">
                <div className="relative">
                    <input
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:border-primary/50 outline-none placeholder:text-white/20 transition-all"
                        placeholder="Ask about your research..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};
