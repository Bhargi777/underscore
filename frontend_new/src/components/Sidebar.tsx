"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Lightbulb, Network, ListTodo, Menu, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    const navItems = [
        { name: 'Projects', path: '/projects', icon: LayoutGrid },
        { name: 'Ideas', path: '/ideas', icon: Lightbulb },
        { name: 'Research', path: '/research', icon: Network },
        { name: 'Tasks', path: '/tasks', icon: ListTodo },
    ];

    return (
        <motion.nav
            className={cn(
                "fixed left-4 top-4 bottom-4 z-50 flex flex-col glass-panel rounded-2xl transition-all duration-300 ease-in-out overflow-hidden",
                isHovered ? "w-64" : "w-20"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center relative w-full border-b border-white/5">
                <div className="flex items-center gap-3 absolute left-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent whitespace-nowrap"
                            >
                                Research OS
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-8 px-3 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="relative group"
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/10",
                                isActive ? "bg-white/10 text-white shadow-inner" : "text-muted-foreground"
                            )}>
                                <item.icon
                                    size={24}
                                    className={cn(
                                        "shrink-0 transition-colors duration-300",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                                    )}
                                />
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer / User Profile Placeholder */}
            <div className="p-4 border-t border-white/5">
                <button className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <Settings size={24} className="text-muted-foreground group-hover:text-white transition-colors" />
                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="ml-3 font-medium text-sm text-muted-foreground group-hover:text-white whitespace-nowrap overflow-hidden"
                            >
                                Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.nav>
    );
};

export default Sidebar;
