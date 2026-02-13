"use client";

import React, { useState } from 'react';
import { PenTool, Type, Image as ImageIcon, RotateCcw, Download, Palette, MousePointer, Sticker, FileText, MonitorPlay, Square, Circle, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolbarProps {
    onToolSelect: (tool: string, payload?: any) => void;
    activeTool: string;
    onClear: () => void;
    onUndo: () => void;
    onDownload: () => void;
    activeColor: string;
    onColorChange: (color: string) => void;
    brushWidth: number;
    onBrushWidthChange: (width: number) => void;
}

const STICKERS = [
    '⭐', '❤️', '🔥', '💡', '✅', '🎉', '📍', '💭', '🌈', '🎨', '📚', '✨'
];

const COLORS = [
    '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280', '#ef4444', '#f97316', '#fb923c', '#facc15', '#eab308',
    '#84cc16', '#16a34a', '#059669', '#0ea5a3', '#06b6d4', '#0891b2', '#3b82f6', '#2563eb', '#1d4ed8', '#7c3aed',
    '#a855f7', '#ec4899', '#db2777', '#9f1239', '#111827', '#71717a'
];

const Toolbar: React.FC<ToolbarProps> = ({
    onToolSelect,
    activeTool,
    onClear,
    onUndo,
    onDownload,
    activeColor,
    onColorChange,
    brushWidth,
    onBrushWidthChange
}) => {
    const [showStickers, setShowStickers] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showColors, setShowColors] = useState(false);

    return (
        <div className="flex items-center gap-4 z-50">

            <div className="flex flex-col items-center gap-2 relative left-toolbar">
                {/* decorative accent bar to the left */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-2 h-36 rounded-full bg-gradient-to-b from-purple-400 to-blue-400 shadow-lg blur-sm opacity-90 pointer-events-none" />
                {/* Color Popover */}
                {showColors && (
                    <div className="absolute left-full ml-4 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-left-2 w-48">
                        <div className="grid grid-cols-6 gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-gray-200 transition-transform hover:scale-125",
                                        activeColor === c && "ring-2 ring-offset-2 ring-blue-500"
                                    )}
                                    style={{ backgroundColor: c }}
                                    onClick={() => {
                                        onColorChange(c);
                                        setShowColors(false);
                                    }}
                                />
                            ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                aria-label="Custom color"
                                type="color"
                                value={activeColor}
                                onChange={(e) => onColorChange(e.target.value)}
                                className="w-8 h-8 p-0 border-0 bg-transparent"
                            />
                            <input
                                type="text"
                                value={activeColor}
                                onChange={(e) => onColorChange(e.target.value)}
                                className="text-xs w-20 bg-white/90 border border-gray-200 rounded px-2 py-1"
                            />
                        </div>
                        <div className="flex flex-col gap-2 border-t pt-2">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex justify-between">
                                <span>Brush Size</span>
                                <span>{brushWidth}px</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={brushWidth}
                                onChange={(e) => onBrushWidthChange(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                )}

                {/* Sticker Popover */}
                {showStickers && (
                    <div className="absolute left-full ml-4 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-3 grid grid-cols-4 gap-2 animate-in slide-in-from-left-2 w-48 max-h-64 overflow-y-auto">
                        {STICKERS.map(s => (
                            <button
                                key={s}
                                className="text-2xl hover:scale-125 transition-transform p-1"
                                onClick={() => {
                                    onToolSelect('sticker', s);
                                    setShowStickers(false);
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Export Popover */}
                {showExport && (
                    <div className="absolute left-full ml-4 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-2 flex flex-col gap-1 animate-in slide-in-from-left-2 w-40">
                        <Button variant="ghost" size="sm" onClick={() => { onDownload(); setShowExport(false); }} className="justify-start gap-2 text-xs">
                            <Download size={14} /> Download Page
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { onToolSelect('export-pdf'); setShowExport(false); }} className="justify-start gap-2 text-xs">
                            <FileText size={14} /> Export PDF
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { onToolSelect('export-ppt'); setShowExport(false); }} className="justify-start gap-2 text-xs">
                            <MonitorPlay size={14} /> Export PPT
                        </Button>
                    </div>
                )}


                {/* Main Bar (Vertical) */}
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-3xl py-6 px-3 flex flex-col gap-3 items-center transition-all hover:shadow-blue-100/50 left-toolbar-panel">

                    <Button
                        variant={activeTool === 'select' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('select')}
                        title="Select / Move"
                        className="rounded-xl"
                    >
                        <MousePointer size={20} />
                    </Button>

                    <div className="w-8 h-px bg-gray-100 mx-auto my-1" />

                    <button
                        onClick={() => {
                            setShowColors(!showColors);
                            setShowStickers(false);
                            setShowExport(false);
                        }}
                        className="w-9 h-9 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 active:scale-95 overflow-hidden group relative"
                        style={{ backgroundColor: activeColor }}
                        title="Color & Size"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity text-white">
                            <Palette size={14} />
                        </div>
                    </button>

                    <Button
                        variant={activeTool === 'brush' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => {
                            onToolSelect('brush');
                            setShowColors(true);
                            setShowStickers(false);
                            setShowExport(false);
                        }}
                        title="Brush"
                        className="rounded-xl"
                    >
                        <PenTool size={20} />
                    </Button>

                    <Button
                        variant={activeTool === 'eraser' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('eraser')}
                        title="Eraser"
                        className="rounded-xl"
                    >
                        <Eraser size={20} />
                    </Button>

                    <div className="w-8 h-px bg-gray-100 mx-auto my-1" />

                    <Button
                        variant={activeTool === 'text' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('text')}
                        title="Add Text"
                        className="rounded-xl"
                    >
                        <Type size={20} />
                    </Button>

                    <Button
                        variant={activeTool === 'image' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('image')}
                        title="Add Image"
                        className="rounded-xl"
                    >
                        <ImageIcon size={20} />
                    </Button>

                    <Button
                        variant={showStickers ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => {
                            setShowStickers(!showStickers);
                            setShowColors(false);
                            setShowExport(false);
                        }}
                        title="Add Sticker"
                        className="rounded-xl"
                    >
                        <Sticker size={20} />
                    </Button>

                    <div className="w-8 h-px bg-gray-100 mx-auto my-1" />

                    <Button
                        variant={activeTool === 'rect' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('rect')}
                        title="Square"
                        className="rounded-xl"
                    >
                        <Square size={20} />
                    </Button>

                    <Button
                        variant={activeTool === 'circle' ? 'default' : 'ghost'}
                        size="icon"
                        onClick={() => onToolSelect('circle')}
                        title="Circle"
                        className="rounded-xl"
                    >
                        <Circle size={20} />
                    </Button>

                    <div className="w-8 h-px bg-gray-100 mx-auto my-1" />

                    <Button variant="ghost" size="icon" onClick={onUndo} title="Undo" className="rounded-xl text-gray-400 hover:text-gray-900">
                        <RotateCcw size={18} />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={onClear} title="Clear Page" className="rounded-xl text-gray-400 hover:text-red-500">
                        <Palette size={18} />
                    </Button>

                    <div className="w-8 h-px bg-gray-100 mx-auto my-1" />

                    <Button
                        variant={showExport ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => {
                            setShowExport(!showExport);
                            setShowColors(false);
                            setShowStickers(false);
                        }}
                        title="Export"
                        className="rounded-xl text-gray-400 hover:text-blue-500"
                    >
                        <Download size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
