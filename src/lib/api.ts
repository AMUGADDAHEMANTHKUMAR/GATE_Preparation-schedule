// API Integration Functions for YouTube and Wikipedia
// These functions provide a clean interface for external API calls with proper error handling

export interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  description?: string;
}

export interface WikipediaSummary {
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

export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

// YouTube API Functions (Mock implementation with fallback)
export class YouTubeAPI {
  private static mockResults: YouTubeSearchResult[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'GATE CS: Linear Algebra Complete Course',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      duration: '2:15:30',
      channel: 'GATE Academy',
      description: 'Complete course on Linear Algebra for GATE Computer Science preparation'
    },
    {
      id: '9bZkp7q19f0',
      title: 'Digital Logic Design - Boolean Algebra',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
      duration: '1:45:20',
      channel: 'Computer Science Hub',
      description: 'Comprehensive tutorial on Boolean Algebra and Digital Logic Design'
    },
    {
      id: 'kJzni8d3sWc',
      title: 'Data Structures and Algorithms for GATE',
      thumbnail: 'https://img.youtube.com/vi/kJzni8d3sWc/mqdefault.jpg',
      duration: '3:20:15',
      channel: 'GATE Preparation',
      description: 'Complete guide to Data Structures and Algorithms for GATE exam'
    },
    {
      id: 'mQkq9k2j9kQ',
      title: 'Operating Systems - Process Management',
      thumbnail: 'https://img.youtube.com/vi/mQkq9k2j9kQ/mqdefault.jpg',
      duration: '1:30:45',
      channel: 'CS Tutorials',
      description: 'Detailed explanation of Process Management in Operating Systems'
    },
    {
      id: 'nP8s2pX8pQ8',
      title: 'Database Management Systems - SQL',
      thumbnail: 'https://img.youtube.com/vi/nP8s2pX8pQ8/mqdefault.jpg',
      duration: '2:45:30',
      channel: 'Database Academy',
      description: 'SQL queries and database concepts for GATE preparation'
    }
  ];

  static async search(query: string, maxResults: number = 10): Promise<YouTubeSearchResult[]> {
    try {
      // In a real implementation, you would use the YouTube Data API v3
      // const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
      // const response = await fetch(
      //   `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`
      // );
      
      // For now, we'll use mock data with filtering
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const filteredResults = this.mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase()) ||
        result.channel.toLowerCase().includes(query.toLowerCase())
      );
      
      return filteredResults.slice(0, maxResults);
    } catch (error) {
      console.error('YouTube API Error:', error);
      // Return mock results as fallback
      return this.mockResults.slice(0, maxResults);
    }
  }

  static async getVideoDetails(videoId: string): Promise<YouTubeSearchResult | null> {
    try {
      const video = this.mockResults.find(result => result.id === videoId);
      return video || null;
    } catch (error) {
      console.error('YouTube Video Details Error:', error);
      return null;
    }
  }
}

// Wikipedia API Functions (Real implementation - No API key needed)
export class WikipediaAPI {
  static async search(query: string, maxResults: number = 10): Promise<WikipediaSearchResult[]> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=${maxResults}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.query || !data.query.search) {
        return [];
      }
      
      return data.query.search.map((item: any) => ({
        title: item.title,
        snippet: this.cleanHtml(item.snippet),
        pageid: item.pageid
      }));
    } catch (error) {
      console.error('Wikipedia Search API Error:', error);
      throw new Error('Failed to search Wikipedia');
    }
  }

  static async getSummary(title: string): Promise<WikipediaSummary> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.type === 'disambiguation') {
        throw new Error('This is a disambiguation page. Please be more specific.');
      }
      
      return data;
    } catch (error) {
      console.error('Wikipedia Summary API Error:', error);
      throw new Error('Failed to fetch Wikipedia article');
    }
  }

  static async getContent(title: string): Promise<string> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=extracts&exintro=true&origin=*`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const content = pages[pageId].extract;
      
      return this.cleanHtml(content);
    } catch (error) {
      console.error('Wikipedia Content API Error:', error);
      throw new Error('Failed to fetch Wikipedia content');
    }
  }

  private static cleanHtml(html: string): string {
    // Remove HTML tags and decode HTML entities
    return html
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }
}

// Utility function to get GATE-specific search suggestions
export const getGATESearchSuggestions = (query: string): string[] => {
  const suggestions = [
    'Linear Algebra',
    'Boolean Algebra',
    'Data Structures',
    'Algorithms',
    'Operating Systems',
    'Database Systems',
    'Computer Networks',
    'Theory of Computation',
    'Digital Logic',
    'Computer Organization',
    'Programming',
    'Software Engineering',
    'Computer Architecture',
    'Microprocessors',
    'Assembly Language'
  ];
  
  return suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Rate limiting utility (for future use with real APIs)
export class RateLimiter {
  private static requests: { [key: string]: number[] } = {};
  private static maxRequests = 100;
  private static windowMs = 60000; // 1 minute

  static canMakeRequest(apiKey: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests[apiKey]) {
      this.requests[apiKey] = [];
    }
    
    // Remove old requests outside the window
    this.requests[apiKey] = this.requests[apiKey].filter(
      timestamp => timestamp > windowStart
    );
    
    if (this.requests[apiKey].length >= this.maxRequests) {
      return false;
    }
    
    this.requests[apiKey].push(now);
    return true;
  }
}
