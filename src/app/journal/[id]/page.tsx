"use client";

import React, { useState } from "react";
import Book from '@/components/Book';
import MusicPlayer from '@/components/MusicPlayer';
import Toolbar from '@/components/Toolbar';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function JournalPage() {
    const params = useParams();
    const id = params?.id as string;

    const [activeTool, setActiveTool] = useState('brush');
    const [toolPayload, setToolPayload] = useState<any>(null);
    const [activeColor, setActiveColor] = useState('#000000');
    const [brushWidth, setBrushWidth] = useState(3);

    // Draggable toolbar position
    const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number }>({ x: 32, y: 0 });
    const toolbarRef = React.useRef<HTMLDivElement | null>(null);
    const draggingRef = React.useRef(false);
    const offsetRef = React.useRef({ x: 0, y: 0 });

    React.useEffect(() => {
        // center vertically on mount
        setToolbarPos(pos => ({ x: pos.x, y: window.innerHeight / 2 - 100 }));
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
        const el = toolbarRef.current;
        if (!el) return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        draggingRef.current = true;
        const rect = el.getBoundingClientRect();
        offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingRef.current) return;
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;
        // clamp to viewport
        const clampedX = Math.max(8, Math.min(window.innerWidth - 80, newX));
        const clampedY = Math.max(8, Math.min(window.innerHeight - 80, newY));
        setToolbarPos({ x: clampedX, y: clampedY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        draggingRef.current = false;
        try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {}
    };

    const handleToolSelect = (tool: string, payload?: any) => {
        setActiveTool(tool);
        if (payload) setToolPayload(payload);

        if (['clear', 'download', 'undo', 'sticker'].includes(tool)) {
            setTimeout(() => {
                setActiveTool('select');
                setToolPayload(null);
            }, 200);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center py-8 relative">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center px-8 mb-4">
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium">
                    <Home size={18} />
                    <span>Lumin</span>
                </Link>
                <div className="flex items-center gap-4">
                    <MusicPlayer />
                    <div className="text-sm text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">
                        ID: {id}
                    </div>
                </div>
            </div>

            {/* Sidebar Toolbar - draggable outside the book on the left */}
            <div
                ref={toolbarRef}
                style={{ left: toolbarPos.x, top: toolbarPos.y }}
                className="fixed z-50"
            >
                <div
                    className="flex flex-col items-center gap-2"
                >
                    <div
                        className="w-8 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        title="Drag to move toolbar"
                    >
                        <div className="w-6 h-1 rounded-full bg-gray-200" />
                    </div>

                    <div onPointerDown={(e) => e.stopPropagation()}>
                        <Toolbar
                            activeTool={activeTool}
                            onToolSelect={handleToolSelect}
                            onClear={() => handleToolSelect('clear')}
                            onUndo={() => handleToolSelect('undo')}
                            onDownload={() => handleToolSelect('download')}
                            activeColor={activeColor}
                            onColorChange={setActiveColor}
                            brushWidth={brushWidth}
                            onBrushWidthChange={setBrushWidth}
                        />
                    </div>
                </div>
            </div>

            {/* The Book */}
            <div className="flex-1 w-full flex items-center justify-center p-4 pl-48">
                <Book
                    activeTool={activeTool}
                    toolPayload={toolPayload}
                    activeColor={activeColor}
                    brushWidth={brushWidth}
                />
            </div>

            {/* Footer / Instructions */}
            <div className="mt-8 text-gray-400 text-xs text-center pb-8 animate-pulse">
                Auto-saving to cloud...
            </div>
        </div>
    );
}

