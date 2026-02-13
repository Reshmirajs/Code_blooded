"use client";

import { useState } from 'react';
import Book from '@/components/Book';
import MusicPlayer from '@/components/MusicPlayer';
import Link from 'next/link';
import { Home, X } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function JournalPage() {
    const params = useParams();
    const id = params?.id as string;
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [showYoutubePanel, setShowYoutubePanel] = useState(false);

    // Extract video ID from YouTube URL
    const extractVideoId = (url: string) => {
        try {
            let id = '';
            if (url.includes('youtube.com/watch?v=')) {
                id = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                id = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                id = url.split('embed/')[1]?.split('?')[0];
            }
            return id || '';
        } catch (error) {
            return '';
        }
    };

    const handleAddYoutube = () => {
        if (!youtubeUrl.trim()) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        const id = extractVideoId(youtubeUrl);
        if (!id) {
            alert('Invalid YouTube URL. Please try again.');
            return;
        }

        setVideoId(id);
        setYoutubeUrl('');
        setShowYoutubePanel(false);
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center py-8 relative">
            {/* YouTube Audio Only (Hidden) */}
            {videoId && (
                <iframe
                    style={{ display: 'none' }}
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                />
            )}

            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center px-8 mb-4 relative z-10">
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium">
                    <Home size={18} />
                    <span>Lumin</span>
                </Link>
                <div className="flex items-center gap-4">
                    <MusicPlayer />
                    <button
                        onClick={() => setShowYoutubePanel(!showYoutubePanel)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition font-medium"
                    >
                        {videoId ? '🎵 Music' : '+ YouTube'}
                    </button>
                    <div className="text-sm text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">
                        ID: {id}
                    </div>
                </div>
            </div>

            {/* YouTube Panel */}
            {showYoutubePanel && (
                <div className="relative z-50 mb-4">
                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800">Add YouTube Music</h3>
                            <button
                                onClick={() => setShowYoutubePanel(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <input
                            type="url"
                            placeholder="Paste YouTube URL..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                        />
                        
                        <button
                            onClick={handleAddYoutube}
                            className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                            Play Music
                        </button>

                        {videoId && (
                            <button
                                onClick={() => setVideoId('')}
                                className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition"
                            >
                                Stop Music
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* The Book */}
            <div className="flex-1 w-full flex items-center justify-center p-4 relative z-10">
                <Book />
            </div>

            {/* Footer / Instructions */}
            <div className="mt-8 text-gray-400 text-xs text-center pb-8 animate-pulse">
                Auto-saving to cloud...
            </div>
        </div>
    );
}
