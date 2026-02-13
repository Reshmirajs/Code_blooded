import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PageProps {
    children?: React.ReactNode;
    number?: number;
    className?: string;
    style?: React.CSSProperties; // Required for react-pageflip
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div
            className={cn("bg-gradient-to-br from-white to-[#fffaf0] shadow-2xl ring-1 ring-blue-50/40 rounded-md border-l border-gray-100/40 h-full w-full overflow-hidden relative", props.className)}
            ref={ref}
            style={props.style}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-20 pointer-events-none z-10" />
            <div className="h-full w-full p-6 relative z-0">
                {props.number && (
                    <div className="absolute bottom-4 right-4 text-gray-400 font-serif text-xs select-none">
                        Page {props.number}
                    </div>
                )}
                {props.children}
            </div>
        </div>
    );
});

Page.displayName = 'Page';

export default Page;
