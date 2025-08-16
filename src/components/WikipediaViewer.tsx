import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ExternalLink, Loader2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';

interface WikipediaViewerProps {
  topic?: string;
  onClose?: () => void;
}

interface WikipediaSummary {
  title: string;
  extract: string;
  content_urls: {
    desktop: {
      page: string;
    };
  };
  thumbnail?: {
    source: string;
  };
  pageid: number;
}

interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

export const WikipediaViewer: React.FC<WikipediaViewerProps> = ({
  topic,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState(topic || '');
  const [currentArticle, setCurrentArticle] = useState<WikipediaSummary | null>(null);
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(!topic);

  useEffect(() => {
    if (topic && !currentArticle) {
      fetchArticleSummary(topic);
    }
  }, [topic]);

  const fetchArticleSummary = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using the Wikipedia Summary API (No Key Needed)
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Article not found');
      }
      
      const data: WikipediaSummary = await response.json();
      setCurrentArticle(data);
      setShowSearch(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
      // Fallback to search if direct article fetch fails
      await performSearch(query);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setError(null);
    
    try {
      // Using the Wikipedia Search API (No Key Needed)
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      const results: WikipediaSearchResult[] = data.query.search.map((item: any) => ({
        title: item.title,
        snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''), // Remove HTML tags
        pageid: item.pageid
      }));
      
      setSearchResults(results);
      setShowSearch(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchArticleSummary(searchQuery.trim());
    }
  };

  const selectSearchResult = async (result: WikipediaSearchResult) => {
    await fetchArticleSummary(result.title);
  };

  const openInWikipedia = () => {
    if (currentArticle) {
      window.open(currentArticle.content_urls.desktop.page, '_blank');
    }
  };

  if (isLoading && !showSearch) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      >
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gray-50">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg">Loading Wikipedia article...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
             <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {showSearch ? 'Search Wikipedia' : 'Wikipedia Article'}
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
              icon={ExternalLink}
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
                       placeholder="Search Wikipedia for GATE topics..."
                       className="flex-1 px-4 py-2 border rounded-md bg-white"
                     />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>
                </form>

                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  {searchResults.map((result) => (
                                         <motion.div
                       key={result.pageid}
                       whileHover={{ scale: 1.01 }}
                       className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors bg-white"
                       onClick={() => selectSearchResult(result)}
                     >
                       <h4 className="font-medium mb-2 text-primary">
                         {result.title}
                       </h4>
                       <p className="text-sm text-gray-700 line-clamp-3">
                         {result.snippet}
                       </p>
                     </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="article"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                                 className="p-6 max-h-[70vh] overflow-y-auto bg-white rounded-lg"
              >
                {error ? (
                  <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
                    <h3 className="text-xl font-semibold mb-2">Article Not Found</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => setShowSearch(true)}>
                      Search for another topic
                    </Button>
                  </div>
                ) : currentArticle ? (
                  <div>
                                         {currentArticle.thumbnail && (
                       <div className="mb-4 text-center">
                         <div className="bg-white p-4 rounded-lg inline-block">
                           <img
                             src={currentArticle.thumbnail.source}
                             alt={currentArticle.title}
                             className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
                           />
                         </div>
                       </div>
                     )}
                    
                                         <h2 className="text-2xl font-bold mb-4 text-primary bg-white p-3 rounded-lg border">
                       {currentArticle.title}
                     </h2>
                    
                                         <div className="prose prose-sm max-w-none text-gray-800">
                       <p className="text-base leading-relaxed mb-4 bg-white p-4 rounded-lg border">
                         {currentArticle.extract}
                       </p>
                     </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="w-4 h-4" />
                        Article ID: {currentArticle.pageid}
                      </div>
                      
                      <Button onClick={openInWikipedia} variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
