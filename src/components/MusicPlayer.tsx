"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music as MusicIcon, Volume2, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface PlaylistItem {
    id: string;
    url: string;
    title: string;
}

// Default lofi track
const DEFAULT_TRACK = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

export default function MusicPlayer({ bookId = "demo-journal-vol1" }: { bookId?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([
        { id: '1', url: DEFAULT_TRACK, title: 'Lofi Study' }
    ]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showPlaylistPanel, setShowPlaylistPanel] = useState(false);
    const [newMusicUrl, setNewMusicUrl] = useState('');
    const [newMusicTitle, setNewMusicTitle] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState('');
    const isRemoteUpdate = useRef(false);

    const isYouTubeUrl = (url: string) => {
        return /youtube\.com|youtu\.be/.test(url);
    };

    const extractYouTubeId = (url: string) => {
        try {
            if (!url) return '';
            if (url.includes('youtube.com/watch?v=')) return url.split('v=')[1]?.split('&')[0] || '';
            if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] || '';
            if (url.includes('youtube.com/embed/')) return url.split('embed/')[1]?.split('?')[0] || '';
            return '';
        } catch {
            return '';
        }
    };

    const sendYoutubeCommand = (cmd: 'play' | 'pause') => {
        try {
            const func = cmd === 'play' ? 'playVideo' : 'pauseVideo';
            if (!iframeRef.current || !iframeRef.current.contentWindow) return;
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
        } catch (e) {
            // ignore
        }
    };

    // Sync with Firestore
    useEffect(() => {
        if (!db) return; // Safely exit if db is not initialized

        const docRef = doc(db, 'books', bookId, 'state', 'music');

        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (data) {
                    // If remote state is different from local state
                    if (data.isPlaying !== isPlaying) {
                        isRemoteUpdate.current = true;
                        if (data.isPlaying) {
                            audioRef.current?.play().catch(() => {
                                // Autoplay policy might block this if user hasn't interacted
                                console.log("Autoplay blocked");
                            });
                        } else {
                            audioRef.current?.pause();
                        }
                        setIsPlaying(data.isPlaying);

                        // Sync time if significantly different (e.g. > 2 seconds)
                        if (audioRef.current && Math.abs(audioRef.current.currentTime - data.currentTime) > 2) {
                            audioRef.current.currentTime = data.currentTime;
                        }

                        setTimeout(() => {
                            isRemoteUpdate.current = false;
                        }, 500);
                    }
                    // Sync playlist
                    if (data.playlist) {
                        setPlaylist(data.playlist);
                        try {
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(`music_playlist_${bookId}`, JSON.stringify(data.playlist));
                            }
                        } catch {}
                    }
                    if (data.currentTrackIndex !== undefined) {
                        setCurrentTrackIndex(data.currentTrackIndex);
                        try {
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(`music_current_${bookId}`, String(data.currentTrackIndex));
                            }
                        } catch {}
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [bookId, isPlaying]); // Added isPlaying dependency to avoid stale closure if needed, though ref usage covers most

    // Load playlist from localStorage when Firestore is not configured or on first render
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const lsKey = `music_playlist_${bookId}`;
        const idxKey = `music_current_${bookId}`;

        try {
            const raw = localStorage.getItem(lsKey);
            if (raw && (!db || playlist.length <= 1)) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length) {
                    setPlaylist(parsed);
                }
            }

            const rawIdx = localStorage.getItem(idxKey);
            if (rawIdx && !db) {
                const n = Number(rawIdx);
                if (!Number.isNaN(n)) setCurrentTrackIndex(n);
            }
        } catch (e) {
            // ignore
        }
    }, [bookId]);

    // Persist playlist + index to localStorage so refresh keeps state even without Firestore
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(`music_playlist_${bookId}`, JSON.stringify(playlist));
            localStorage.setItem(`music_current_${bookId}`, String(currentTrackIndex));
        } catch (e) {
            // ignore
        }
    }, [playlist, currentTrackIndex, bookId]);

    const togglePlay = async () => {
        const newState = !isPlaying;
        setIsPlaying(newState); // Optimistic update

        const current = playlist[currentTrackIndex];
        if (current && isYouTubeUrl(current.url)) {
            // Control youtube iframe via postMessage
            if (newState) {
                sendYoutubeCommand('play');
            } else {
                sendYoutubeCommand('pause');
            }
        } else {
            // native audio element
            if (audioRef.current) {
                if (newState) audioRef.current.play().catch(() => {});
                else audioRef.current.pause();
            }
        }

        // Sync to Firestore
        if (db) {
            try {
                const docRef = doc(db, 'books', bookId, 'state', 'music');
                await setDoc(docRef, {
                    isPlaying: newState,
                    currentTime: audioRef.current?.currentTime || 0,
                    lastUpdated: new Date().toISOString(),
                    playlist,
                    currentTrackIndex
                }, { merge: true });
            } catch (e) {
                console.error("Error syncing music:", e);
            }
        }
    };

    const addMusicToPlaylist = () => {
        if (!newMusicUrl.trim()) {
            alert('Please enter a valid music URL');
            return;
        }
        
        const newTrack: PlaylistItem = {
            id: Date.now().toString(),
            url: newMusicUrl,
            title: newMusicTitle || `Track ${playlist.length + 1}`
        };
        
        const updatedPlaylist = [...playlist, newTrack];
        setPlaylist(updatedPlaylist);
        setNewMusicUrl('');
        setNewMusicTitle('');
        
        // Sync to Firestore
        if (db) {
            try {
                const docRef = doc(db, 'books', bookId, 'state', 'music');
                setDoc(docRef, {
                    playlist: updatedPlaylist,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error syncing playlist:", e);
            }
        }
    };

    const removeFromPlaylist = (trackId: string) => {
        const updatedPlaylist = playlist.filter(track => track.id !== trackId);
        setPlaylist(updatedPlaylist);
        
        // Adjust current track index if needed
        if (currentTrackIndex >= updatedPlaylist.length) {
            setCurrentTrackIndex(Math.max(0, updatedPlaylist.length - 1));
        }
        
        // Sync to Firestore
        if (db) {
            try {
                const docRef = doc(db, 'books', bookId, 'state', 'music');
                setDoc(docRef, {
                    playlist: updatedPlaylist,
                    currentTrackIndex: currentTrackIndex >= updatedPlaylist.length ? updatedPlaylist.length - 1 : currentTrackIndex,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error syncing playlist:", e);
            }
        }
    };

    const playTrack = (index: number) => {
        if (index >= 0 && index < playlist.length) {
            setCurrentTrackIndex(index);
            setIsPlaying(true);
            const url = playlist[index]?.url || '';
            if (isYouTubeUrl(url)) {
                setYoutubeVideoId(extractYouTubeId(url));
            } else {
                setYoutubeVideoId('');
            }

            // Sync to Firestore
            if (db) {
                try {
                    const docRef = doc(db, 'books', bookId, 'state', 'music');
                    setDoc(docRef, {
                        currentTrackIndex: index,
                        isPlaying: true,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                } catch (e) {
                    console.error("Error syncing music:", e);
                }
            }
        }
    };

    const playNextTrack = async () => {
        const nextIndex = currentTrackIndex + 1;
        if (nextIndex < playlist.length) {
            setCurrentTrackIndex(nextIndex);
            // Sync to Firestore
            if (db) {
                try {
                    const docRef = doc(db, 'books', bookId, 'state', 'music');
                    await setDoc(docRef, {
                        currentTrackIndex: nextIndex,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                } catch (e) {
                    console.error("Error syncing music:", e);
                }
            }
        }
    };

    const playPreviousTrack = async () => {
        const prevIndex = currentTrackIndex - 1;
        if (prevIndex >= 0) {
            setCurrentTrackIndex(prevIndex);
            // Sync to Firestore
            if (db) {
                try {
                    const docRef = doc(db, 'books', bookId, 'state', 'music');
                    await setDoc(docRef, {
                        currentTrackIndex: prevIndex,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                } catch (e) {
                    console.error("Error syncing music:", e);
                }
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, []);

    useEffect(() => {
        const handleTrackEnd = () => {
            playNextTrack();
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleTrackEnd);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleTrackEnd);
            }
        };
    }, [currentTrackIndex, playlist.length]);

    // Ensure playback starts/pauses when track or play state changes
    useEffect(() => {
        const current = playlist[currentTrackIndex];
        if (!current) return;

        if (isYouTubeUrl(current.url)) {
            // Pause native audio when playing youtube
            audioRef.current?.pause();
            if (isPlaying) {
                setYoutubeVideoId(extractYouTubeId(current.url));
            }
        } else {
            // Clear any youtube embed
            setYoutubeVideoId('');
            if (audioRef.current) {
                audioRef.current.src = current.url;
                if (isPlaying) {
                    audioRef.current.play().catch(() => {
                        // autoplay might be blocked until user interacts
                    });
                } else {
                    audioRef.current.pause();
                }
            }
        }
    }, [currentTrackIndex, isPlaying, playlist]);

    return (
        <div className="space-y-4">
            {/* Main Player */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20 transition-all hover:bg-white/20">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg">
                    <MusicIcon className="text-indigo-600" size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700">
                        {playlist[currentTrackIndex]?.title || 'No Track'}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        {isPlaying ? <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-gray-300" />}
                        {isPlaying ? "Playing..." : "Paused"}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-1">
                        Track {currentTrackIndex + 1} of {playlist.length}
                    </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={playPreviousTrack}
                        disabled={currentTrackIndex === 0}
                        className="h-8 w-8 text-gray-600 hover:text-indigo-600 disabled:opacity-50"
                    >
                        <SkipBack size={16} />
                    </Button>
                    <Button
                        variant={isPlaying ? "default" : "outline"}
                        size="icon"
                        onClick={togglePlay}
                        className={`h-10 w-10 rounded-full shadow-md transition-all active:scale-95 ${isPlaying ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white hover:bg-gray-50'}`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1 text-gray-700" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={playNextTrack}
                        disabled={currentTrackIndex === playlist.length - 1}
                        className="h-8 w-8 text-gray-600 hover:text-indigo-600 disabled:opacity-50"
                    >
                        <SkipForward size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
                        className="h-8 w-8 text-gray-600 hover:text-indigo-600 ml-2"
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            </div>

            {/* Add Music Panel */}
            {showPlaylistPanel && (
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/20 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Add Music</h3>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowPlaylistPanel(false)}
                            className="h-6 w-6"
                        >
                            <X size={14} />
                        </Button>
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Music title (optional)"
                        value={newMusicTitle}
                        onChange={(e) => setNewMusicTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 text-gray-800 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <input
                        type="url"
                        placeholder="Paste music URL here..."
                        value={newMusicUrl}
                        onChange={(e) => setNewMusicUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 text-gray-800 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    
                    <Button
                        onClick={addMusicToPlaylist}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                    >
                        Add to Playlist
                    </Button>

                    {/* Playlist */}
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Playlist ({playlist.length})</h4>
                        {playlist.map((track, index) => (
                            <div
                                key={track.id}
                                className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                                    currentTrackIndex === index
                                        ? 'bg-indigo-500/30 border border-indigo-400'
                                        : 'bg-white/10 hover:bg-white/20'
                                }`}
                                onClick={() => playTrack(index)}
                            >
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-700">{track.title}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{track.url}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromPlaylist(track.id);
                                    }}
                                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100/20 ml-2"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hidden YouTube iframe for audio-only playback when selected */}
            {youtubeVideoId && (
                <iframe
                    ref={iframeRef}
                    style={{ display: 'none' }}
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&loop=1&playlist=${youtubeVideoId}&controls=0&modestbranding=1&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    onLoad={() => {
                        if (isPlaying) sendYoutubeCommand('play');
                    }}
                />
            )}

            <audio 
                ref={audioRef} 
                src={playlist[currentTrackIndex]?.url || DEFAULT_TRACK}
                key={playlist[currentTrackIndex]?.id}
            />
        </div>
    );
}
