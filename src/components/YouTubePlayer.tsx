import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';

interface YouTubePlayerProps {
  videoId?: string;
  topic?: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  topic,
  onClose,
  autoPlay = true
}) => {
  const [currentVideoId, setCurrentVideoId] = useState(videoId || '');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(topic || '');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(!videoId);
  
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Mock YouTube search results for demonstration
  const mockSearchResults: YouTubeSearchResult[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'GATE CS: Linear Algebra Complete Course',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: '2:15:30',
      channel: 'GATE Academy'
    },
    {
      id: '9bZkp7q19f0',
      title: 'Digital Logic Design - Boolean Algebra',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
      duration: '1:45:20',
      channel: 'Computer Science Hub'
    },
    {
      id: 'kJzni8d3sWc',
      title: 'Data Structures and Algorithms for GATE',
      thumbnail: 'https://img.youtube.com/vi/kJzni8d3sWc/mqdefault.jpg',
      duration: '3:20:15',
      channel: 'GATE Preparation'
    }
  ];

  useEffect(() => {
    if (topic && !videoId) {
      setSearchQuery(topic);
      performSearch(topic);
    }
  }, [topic, videoId]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter mock results based on query
    const filtered = mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.channel.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const selectVideo = (video: YouTubeSearchResult) => {
    setCurrentVideoId(video.id);
    setIsPlaying(true);
    setShowSearch(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would control the YouTube iframe player
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the YouTube iframe player
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  if (!currentVideoId && !showSearch) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
             <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">
            {showSearch ? 'Search YouTube Videos' : 'YouTube Player'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {!showSearch && (
              <IconButton
                icon={Search}
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                label="Search"
              />
            )}
            <IconButton
              icon={X}
              variant="ghost"
              size="sm"
              onClick={onClose}
              label="Close"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                                 className="p-6 bg-white rounded-lg"
              >
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="flex gap-2">
                                         <input
                       type="text"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search for GATE topics..."
                       className="flex-1 px-4 py-2 border rounded-md bg-white"
                     />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((video) => (
                                         <motion.div
                       key={video.id}
                       whileHover={{ scale: 1.02 }}
                       className="cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors bg-white"
                       onClick={() => selectVideo(video)}
                     >
                       <img
                         src={video.thumbnail}
                         alt={video.title}
                         className="w-full h-32 object-cover"
                       />
                       <div className="p-3">
                         <h4 className="font-medium text-sm line-clamp-2 mb-2 text-gray-800">
                           {video.title}
                         </h4>
                         <div className="flex items-center justify-between text-xs text-gray-600">
                           <span>{video.channel}</span>
                           <span>{video.duration}</span>
                         </div>
                       </div>
                     </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative"
              >
                <div className="relative aspect-video bg-black">
                  <iframe
                    ref={playerRef}
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&enablejsapi=1`}
                    title="YouTube video player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Custom Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconButton
                          icon={isPlaying ? Pause : Play}
                          variant="ghost"
                          size="sm"
                          onClick={togglePlayPause}
                          className="text-white hover:bg-white/20"
                          label={isPlaying ? 'Pause' : 'Play'}
                        />
                        <IconButton
                          icon={isMuted ? VolumeX : Volume2}
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                          label={isMuted ? 'Unmute' : 'Mute'}
                        />
                      </div>
                      
                      <IconButton
                        icon={Maximize}
                        variant="ghost"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                        label="Fullscreen"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
