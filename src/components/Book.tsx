"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Page from "./Page";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar"; // Import Toolbar here

// Dynamic import for HTMLFlipBook
const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

interface BookProps {
    activeTool: string;
    toolPayload: any;
    activeColor: string;
    brushWidth: number;
}

export default function Book({
    activeTool,
    toolPayload,
    activeColor,
    brushWidth
}: BookProps) {

    const bookRef = useRef(null);
    const [mount, setMount] = useState(false);
    const [bookId] = useState('demo-journal-vol1');
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setMount(true);
    }, []);

    const handleFlip = (e: any) => {
        setCurrentPage(e.data);
    };

    if (!mount) return <div className="flex justify-center items-center h-screen">Loading Journal...</div>;

    // Helper to determine if a page is currently visible and should be active
    const isPageActive = (pageNum: number) => {
        // Simple logic: if currentPage is 0 (cover), only page 0 is active.
        // Otherwise, if it's a spread, both pages in the spread are active.
        if (currentPage === 0) return pageNum === 0;

        // In react-pageflip spreads:
        // Spread 1: pages 1, 2
        // Spread 3: pages 3, 4
        // The currentPage returned is the index of the first page in the spread
        return pageNum === currentPage || pageNum === currentPage + 1;
    };

    return (
        <div className="flex justify-center items-center h-[85vh] w-full perspective-origin-center relative group">

            <div className="relative">
                {/* @ts-ignore - Types for react-pageflip workaround */}
                    <HTMLFlipBook
                    width={450}
                    height={650}
                    size="fixed"
                    minWidth={300}
                    maxWidth={500}
                    minHeight={400}
                    maxHeight={700}
                    showCover={true}
                    mobileScrollSupport={false}
                    useMouseEvents={false}
                    swipeDistance={9999}
                    className="demo-book shadow-2xl rounded-r-md"
                    ref={bookRef}
                    flippingTime={1000}
                    usePortrait={false}
                    startPage={0}
                    onFlip={handleFlip}
                >
                    {/* ... Pages ... */}
                    {/* Cover Page */}
                    <Page number={0} className="bg-gradient-to-br from-indigo-50 to-blue-50 border-r-4 border-gray-300">
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-24 h-24 bg-gray-900 rounded-full mb-6 flex items-center justify-center shadow-lg">
                                <span className="text-4xl text-white font-serif">LJ</span>
                            </div>
                            <h1 className="text-4xl font-serif text-gray-800 mb-2">Lumin Journal</h1>
                            <p className="text-gray-500 font-light italic">Your collaborative space</p>
                            <div className="mt-12 text-xs text-gray-400 uppercase tracking-widest">
                                Vol. 1
                                <div className="mt-2 text-[10px] text-gray-300 normal-case">Flip the page to start</div>
                            </div>
                        </div>
                    </Page>

                    {/* Page 1: Introduction */}
                    <Page number={1}>
                        <div className="p-8 font-serif leading-relaxed text-gray-700">
                            <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200">Preface</h2>
                            <p className="mb-4 text-sm">
                                Welcome to your new digital journal. This space is designed for creativity, reflection, and collaboration.
                            </p>
                            <p className="text-sm">
                                Feel free to draw, write, and paste images on the following pages. Your changes are saved automatically.
                            </p>
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                                <p>💡 Tip: Use the toolbar on the left to select tools. Click or drag to add elements. Select elements to move them.</p>
                            </div>
                        </div>
                    </Page>

                    {/* Page 2: Canvas */}
                    <Page number={2}>
                        <div className="h-full w-full relative">
                            <CanvasEditor
                                bookId={bookId}
                                pageId="page-2"
                                activeTool={activeTool}
                                toolPayload={toolPayload}
                                activePageId={isPageActive(2) ? "page-2" : "inactive"}
                                width={450}
                                height={650}
                                color={activeColor}
                                brushWidth={brushWidth}
                            />
                        </div>
                    </Page>

                    {/* Page 3: Canvas */}
                    <Page number={3}>
                        <div className="h-full w-full relative">
                            <CanvasEditor
                                bookId={bookId}
                                pageId="page-3"
                                activeTool={activeTool}
                                toolPayload={toolPayload}
                                activePageId={isPageActive(3) ? "page-3" : "inactive"}
                                width={450}
                                height={650}
                                color={activeColor}
                                brushWidth={brushWidth}
                            />
                        </div>
                    </Page>

                    {/* Page 4: Canvas */}
                    <Page number={4}>
                        <div className="h-full w-full relative">
                            <CanvasEditor
                                bookId={bookId}
                                pageId="page-4"
                                activeTool={activeTool}
                                toolPayload={toolPayload}
                                activePageId={isPageActive(4) ? "page-4" : "inactive"}
                                width={450}
                                height={650}
                                color={activeColor}
                                brushWidth={brushWidth}
                            />
                        </div>
                    </Page>

                    {/* Page 5: Canvas */}
                    <Page number={5}>
                        <div className="h-full w-full relative">
                            <CanvasEditor
                                bookId={bookId}
                                pageId="page-5"
                                activeTool={activeTool}
                                toolPayload={toolPayload}
                                activePageId={isPageActive(5) ? "page-5" : "inactive"}
                                width={450}
                                height={650}
                                color={activeColor}
                                brushWidth={brushWidth}
                            />
                        </div>
                    </Page>

                    {/* Back Cover */}
                    <Page number={6} className="bg-gray-100">
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 font-serif text-sm">Lumin Journal &copy; 2024</p>
                        </div>
                    </Page>

                </HTMLFlipBook>
                {/* Bottom-right compact navigation controls */}
                <div className="absolute bottom-6 right-6 z-40 flex items-center gap-3">
                    <button
                        onClick={() => (bookRef.current as any)?.pageFlip()?.flipPrev()}
                        className="bg-white/95 p-3 rounded-full shadow-md hover:scale-105 transition-transform text-gray-600 hover:text-gray-900 border border-gray-100"
                        aria-label="Previous Page"
                        title="Previous Page"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={() => (bookRef.current as any)?.pageFlip()?.flipNext()}
                        className="bg-white/95 p-3 rounded-full shadow-md hover:scale-105 transition-transform text-gray-600 hover:text-gray-900 border border-gray-100"
                        aria-label="Next Page"
                        title="Next Page"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
