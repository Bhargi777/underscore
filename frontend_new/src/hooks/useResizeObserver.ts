"use client";
import { useEffect } from 'react';

export const useResizeObserver = (ref: React.RefObject<HTMLElement | null>, callback: (entry: ResizeObserverEntry) => void) => {
    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver((entries) => {
            entries.forEach(callback);
        });
        observer.observe(ref.current as Element);
        return () => observer.disconnect();
    }, [ref, callback]);
};
