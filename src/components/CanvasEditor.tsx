"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCollaboration } from '@/hooks/useCollaboration';
import { Loader2 } from 'lucide-react';

interface CanvasEditorProps {
    bookId: string;
    pageId: string;
    activeTool: string;
    toolPayload?: any;
    activePageId?: string;
    width?: number;
    height?: number;
    color?: string;
    brushWidth?: number;
}

export default function CanvasEditor({
    bookId,
    pageId,
    activeTool,
    toolPayload,
    activePageId,
    width = 450,
    height = 650,
    color = '#000000',
    brushWidth = 3
}: CanvasEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<any>(null);
    const [fabricCanvas, setFabricCanvas] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const prevToolRef = useRef<string | null>(null);

    const { saveCanvas, isRemoteUpdate } = useCollaboration(bookId, pageId, fabricCanvas);

    // Initialize Fabric
    useEffect(() => {
        let canvas: any;

        const init = async () => {
            try {
                const fabricModule = await import('fabric');
                const fabric = fabricModule.fabric || fabricModule.default;
                fabricRef.current = fabric;

                if (!canvasRef.current || !fabric) return;

                canvas = new fabric.Canvas(canvasRef.current, {
                    height: height,
                    width: width,
                    backgroundColor: 'transparent',
                    isDrawingMode: false,
                });

                // ensure a pencil brush exists for drawing & erasing
                try {
                    const Pencil = (fabric as any).PencilBrush || fabric.PencilBrush;
                    if (Pencil) {
                        canvas.freeDrawingBrush = new Pencil(canvas);
                        canvas.freeDrawingBrush.width = brushWidth;
                        canvas.freeDrawingBrush.color = color;
                    }
                } catch (e) {
                    // ignore if brush type not found
                }

                setFabricCanvas(canvas);
                setIsReady(true);
            } catch (e) {
                console.error("Fabric init error:", e);
            }
        };

        if (!fabricCanvas) {
            init();
        }

        return () => {
            if (canvas) {
                canvas.dispose();
            }
        };
    }, []);

    // Handle History and Save Events
    useEffect(() => {
        if (!fabricCanvas) return;

        const handleSave = () => {
            if (!isRemoteUpdate.current) {
                const json = JSON.stringify(fabricCanvas.toJSON());
                setHistory(prev => {
                    const newHistory = [...prev, json];
                    if (newHistory.length > 20) return newHistory.slice(1);
                    return newHistory;
                });
                saveCanvas();
            }
        };

        const handleObjectAdded = (e: any) => {
            if (!isRemoteUpdate.current) handleSave();
        };

        fabricCanvas.on('object:modified', handleSave);
        fabricCanvas.on('path:created', handleSave);
        fabricCanvas.on('object:added', handleObjectAdded);
        fabricCanvas.on('object:removed', handleSave);

        return () => {
            fabricCanvas.off('object:modified', handleSave);
            fabricCanvas.off('path:created', handleSave);
            fabricCanvas.off('object:added', handleObjectAdded);
            fabricCanvas.off('object:removed', handleSave);
        };
    }, [fabricCanvas, saveCanvas, isRemoteUpdate]);

    // Handle Tools
    useEffect(() => {
        if (!fabricCanvas || !fabricRef.current) return;

        const fabric = fabricRef.current;

        // Reset
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = activeTool === 'select';
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.off('mouse:down');

        // Handle delete key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeObjects = fabricCanvas.getActiveObjects();
                if (activeObjects.length > 0) {
                    fabricCanvas.remove(...activeObjects);
                    fabricCanvas.discardActiveObject();
                    fabricCanvas.renderAll();
                    // handleSave() is called by object:removed (if active)
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);


        // Drag and Drop support
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const file = e.dataTransfer?.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (f) => {
                    const data = f.target?.result;
                    fabric.Image.fromURL(data, (img: any) => {
                        const pointer = fabricCanvas.getPointer(e);
                        img.set({
                            left: pointer.x,
                            top: pointer.y,
                            shadow: new fabric.Shadow({
                                color: 'rgba(0,0,0,0.1)',
                                blur: 10,
                                offsetX: 5,
                                offsetY: 5
                            })
                        });
                        img.scaleToWidth(150);
                        fabricCanvas.add(img);
                        fabricCanvas.setActiveObject(img);
                        // handleSave() is called by object:added
                    });
                };
                reader.readAsDataURL(file);
            }
        };

        const canvasEl = fabricCanvas.getElement().parentElement;
        canvasEl?.addEventListener('dragover', handleDragOver);
        canvasEl?.addEventListener('drop', handleDrop);

        const handleMouseDown = (options: any) => {
            const pointer = fabricCanvas.getPointer(options.e);

            if (activeTool === 'text') {
                if (options.target) return;
                const text = new fabric.IText('Type...', {
                    left: pointer.x,
                    top: pointer.y,
                    fontFamily: 'serif',
                    fill: color,
                    fontSize: 20
                });
                fabricCanvas.add(text);
                fabricCanvas.setActiveObject(text);
                text.enterEditing();
                text.selectAll();
                return;
            } else if (activeTool === 'image') {
                if (options.target) return;
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (f) => {
                        const data = f.target?.result;
                        fabric.Image.fromURL(data, (img: any) => {
                            img.set({
                                left: pointer.x,
                                top: pointer.y,
                                shadow: new fabric.Shadow({
                                    color: 'rgba(0,0,0,0.1)',
                                    blur: 10,
                                    offsetX: 5,
                                    offsetY: 5
                                })
                            });
                            img.scaleToWidth(150);
                            fabricCanvas.add(img);
                            fabricCanvas.setActiveObject(img);
                        });
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            } else if (activeTool === 'circle') {
                const circle = new fabric.Circle({
                    radius: 30,
                    fill: 'transparent',
                    stroke: color,
                    strokeWidth: brushWidth,
                    left: pointer.x,
                    top: pointer.y,
                    selectable: true,
                });
                fabricCanvas.add(circle);
                fabricCanvas.setActiveObject(circle);
            } else if (activeTool === 'rect') {
                const rect = new fabric.Rect({
                    width: 60,
                    height: 60,
                    fill: 'transparent',
                    stroke: color,
                    strokeWidth: brushWidth,
                    left: pointer.x,
                    top: pointer.y,
                    selectable: true,
                });
                fabricCanvas.add(rect);
                fabricCanvas.setActiveObject(rect);
            }
        };

        if (activeTool === 'brush') {
            fabricCanvas.isDrawingMode = true;
            // use pencil brush with normal draw composite
            try {
                const Pencil = (fabricRef.current as any).PencilBrush || fabricRef.current.PencilBrush;
                fabricCanvas.freeDrawingBrush = new Pencil(fabricCanvas);
            } catch {}
            fabricCanvas.freeDrawingBrush.width = brushWidth;
            fabricCanvas.freeDrawingBrush.color = color;
            if (fabricCanvas.freeDrawingBrush) fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        } else if (activeTool === 'eraser') {
            fabricCanvas.isDrawingMode = true;
            // create an eraser-like brush using destination-out composite
            try {
                const Pencil = (fabricRef.current as any).PencilBrush || fabricRef.current.PencilBrush;
                fabricCanvas.freeDrawingBrush = new Pencil(fabricCanvas);
            } catch {}
            fabricCanvas.freeDrawingBrush.width = Math.max(4, brushWidth * 2);
            // set composite operation to erase
            if (fabricCanvas.freeDrawingBrush) fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
        } else if (['text', 'image', 'circle', 'rect'].includes(activeTool)) {
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.on('mouse:down', handleMouseDown);
        } else if (activeTool === 'sticker') {
            const isVisible = fabricCanvas.getElement().offsetParent !== null;
            if (toolPayload && isVisible) {
                const sticker = new fabric.IText(toolPayload, {
                    left: width / 2 - 40 + (Math.random() * 80),
                    top: height / 2 - 40 + (Math.random() * 80),
                    fontSize: 80,
                    selectable: true,
                    shadow: new fabric.Shadow({
                        color: 'rgba(0,0,0,0.15)',
                        blur: 8,
                        offsetX: 4,
                        offsetY: 4
                    })
                });
                fabricCanvas.add(sticker);
                fabricCanvas.setActiveObject(sticker);
            }
        } else if (activeTool === 'clear') {
            const isVisible = fabricCanvas.getElement().offsetParent !== null;
            if (isVisible) {
                fabricCanvas.clear();
                fabricCanvas.backgroundColor = 'transparent';
                saveCanvas();
            }
        } else if (activeTool === 'undo') {
            const isVisible = fabricCanvas.getElement().offsetParent !== null;
            if (isVisible && history.length > 0) {
                const lastState = history[history.length - 2] || '{}';
                isRemoteUpdate.current = true;
                fabricCanvas.loadFromJSON(lastState, () => {
                    fabricCanvas.renderAll();
                    setHistory(prev => prev.slice(0, -1));
                    saveCanvas();
                    setTimeout(() => isRemoteUpdate.current = false, 100);
                });
            }
        } else if (activeTool === 'download') {
            const isVisible = fabricCanvas.getElement().offsetParent !== null;
            if (isVisible) {
                const dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier: 2 });
                const link = document.createElement('a');
                link.download = `page-${pageId}.png`;
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        return () => {
            fabricCanvas.off('mouse:down', handleMouseDown);
            canvasEl?.removeEventListener('dragover', handleDragOver);
            canvasEl?.removeEventListener('drop', handleDrop);
            window.removeEventListener('keydown', handleKeyDown);
            fabricCanvas.isDrawingMode = false;
        };

    }, [activeTool, toolPayload, activePageId, fabricCanvas, saveCanvas, width, height, pageId, color, brushWidth, history]);

    // react to color/brush size changes when in drawing mode
    useEffect(() => {
        if (!fabricCanvas) return;
        if (activeTool === 'brush') {
            fabricCanvas.freeDrawingBrush.width = brushWidth;
            fabricCanvas.freeDrawingBrush.color = color;
            if (fabricCanvas.freeDrawingBrush) fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        } else if (activeTool === 'eraser') {
            fabricCanvas.freeDrawingBrush.width = Math.max(4, brushWidth * 2);
            if (fabricCanvas.freeDrawingBrush) fabricCanvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
        }
    }, [brushWidth, color, activeTool, fabricCanvas]);

    // Auto-insert a text box when user selects the text tool (single insertion on tool change)
    useEffect(() => {
        if (!fabricCanvas || !fabricRef.current) return;
        // only insert when this page is active
        if (!activePageId || activePageId === 'inactive' || activePageId !== pageId) {
            prevToolRef.current = activeTool;
            return;
        }

        if (activeTool === 'text' && prevToolRef.current !== 'text') {
            const fabric = fabricRef.current;
            const text = new fabric.IText('Type...', {
                left: width / 2 - 80,
                top: height / 2 - 12,
                fontFamily: 'serif',
                fill: color,
                fontSize: 20
            });
            fabricCanvas.add(text);
            fabricCanvas.setActiveObject(text);
            text.enterEditing();
            text.selectAll();
        }

        prevToolRef.current = activeTool;
    }, [activeTool, activePageId, fabricCanvas, pageId, width, height, color]);

    return (
        <div
            className="relative w-full h-full group"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
                    <Loader2 className="animate-spin text-gray-400" />
                </div>
            )}
            <canvas ref={canvasRef} />
        </div>
    );
}

