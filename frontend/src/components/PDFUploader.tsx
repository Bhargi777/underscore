import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/api/client';
import { GlassCard } from '@/components/GlassCard';

interface PDFUploaderProps {
    className?: string;
    onUploadComplete?: () => void;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ className, onUploadComplete }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert("Only PDF files are allowed");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('scope', 'global');

        try {
            await apiClient.post('/papers/upload', formData);
            if (onUploadComplete) onUploadComplete();
            alert("PDF Uploaded successfully! Processing started.");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <GlassCard className={`flex flex-col overflow-hidden ${className}`}>
            <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
                <FileText className="text-primary" size={18} />
                <h3 className="font-semibold text-white">Knowledge Base</h3>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-center">
                <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${dragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                    />

                    {uploading ? (
                        <Loader2 className="animate-spin text-primary" size={32} />
                    ) : (
                        <Upload className="text-primary/50" size={32} />
                    )}

                    <div className="text-sm text-muted-foreground">
                        {uploading ? (
                            <span className="text-primary animate-pulse">Uploading & Parsing...</span>
                        ) : (
                            <>
                                <span className="text-white font-medium">Click to upload PDF</span>
                                <span className="block text-xs mt-1 opacity-50">or drag and drop</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
