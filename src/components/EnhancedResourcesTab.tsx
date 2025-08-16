import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, TrendingUp, BarChart3, 
  Youtube, BookOpen, Sparkles, Lightbulb, History, Star
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { TopicDropdown } from './TopicDropdown';
import { YouTubePlayer } from './YouTubePlayer';
import { WikipediaViewer } from './WikipediaViewer';

import { getGATESearchSuggestions } from '@/lib/api';

const EnhancedResourcesTab: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch } = useProgressStore();
  const { theme } = useSettingsStore();
  
  // State for enhanced features
  const [searchQuery, setSearchQuery] = useState('');
  
  // New enhanced state
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [showWikipediaViewer, setShowWikipediaViewer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);
  
  const branch = currentBranch ? getBranchByCode(currentBranch) : null;

  useEffect(() => {
    // Load recent searches and favorites from localStorage
    const savedRecent = localStorage.getItem('recentSearches');
    const savedFavorites = localStorage.getItem('favoriteTopics');
    
    if (savedRecent) {
      setRecentSearches(JSON.parse(savedRecent));
    }
    if (savedFavorites) {
      setFavoriteTopics(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Update search suggestions based on query
    if (searchQuery.trim()) {
      const suggestions = getGATESearchSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">No Branch Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a GATE branch to view resources.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleTopicSelect = (topic: string, type: 'youtube' | 'wikipedia') => {
    setSelectedTopic(topic);
    
    // Add to recent searches
    const newRecent = [topic, ...recentSearches.filter(s => s !== topic)].slice(0, 10);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    if (type === 'youtube') {
      setShowYouTubePlayer(true);
    } else {
      setShowWikipediaViewer(true);
    }
  };

  const toggleFavorite = (topic: string) => {
    const newFavorites = favoriteTopics.includes(topic)
      ? favoriteTopics.filter(t => t !== topic)
      : [...favoriteTopics, topic];
    
    setFavoriteTopics(newFavorites);
    localStorage.setItem('favoriteTopics', JSON.stringify(newFavorites));
  };

  const handleSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Enhanced Study Resources
          </h1>
          <p className="text-muted-foreground">
            Smart search, YouTube integration, and Wikipedia content for {branch.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={() => navigate('/progress')} className="gradient">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Search and Topic Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Smart Topic Search
            </CardTitle>
            <CardDescription>
              Search for topics or use the dropdown to find YouTube videos and Wikipedia articles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Smart Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources and topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-md bg-background focus:ring-2 focus:ring-primary/20"
                />
                
                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSuggestion(suggestion)}
                          className="w-full p-3 text-left hover:bg-secondary/50 transition-colors border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <span>{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Topic Dropdown */}
              <TopicDropdown
                onTopicSelect={handleTopicSelect}
                currentTopic={selectedTopic}
              />
            </div>

            {/* Recent Searches and Favorites */}
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(search)}
                  className="text-xs"
                >
                  <History className="w-3 h-3 mr-1" />
                  {search}
                </Button>
              ))}
              {favoriteTopics.slice(0, 5).map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(topic)}
                  className="text-xs text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access frequently used resources and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => navigate('/pyq')}
              >
                <FileText className="w-6 h-6" />
                <span>PYQ Papers</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => handleTopicSelect('GATE CS Preparation', 'youtube')}
              >
                <Youtube className="w-6 h-6 text-red-500" />
                <span>Video Lectures</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => handleTopicSelect('Computer Science', 'wikipedia')}
              >
                <BookOpen className="w-6 h-6 text-blue-500" />
                <span>CS Overview</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <FileText className="w-6 h-6" />
                <span>Practice Tests</span>
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Enhanced Modals */}
      <AnimatePresence>
        {showYouTubePlayer && (
          <YouTubePlayer
            topic={selectedTopic}
            onClose={() => setShowYouTubePlayer(false)}
            autoPlay={true}
          />
        )}
        
        {showWikipediaViewer && (
          <WikipediaViewer
            topic={selectedTopic}
            onClose={() => setShowWikipediaViewer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedResourcesTab;
