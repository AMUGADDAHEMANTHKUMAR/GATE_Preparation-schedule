import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Video, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';

interface TopicDropdownProps {
  onTopicSelect: (topic: string, type: 'youtube' | 'wikipedia') => void;
  currentTopic?: string;
  className?: string;
}

interface TopicCategory {
  name: string;
  topics: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const TopicDropdown: React.FC<TopicDropdownProps> = ({
  onTopicSelect,
  currentTopic,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // GATE CS Topics organized by category
  const topicCategories: TopicCategory[] = [
    {
      name: 'Engineering Mathematics',
      topics: [
        'Linear Algebra',
        'Calculus',
        'Probability',
        'Statistics',
        'Discrete Mathematics',
        'Graph Theory',
        'Combinatorics'
      ],
      icon: Search
    },
    {
      name: 'Digital Logic',
      topics: [
        'Boolean Algebra',
        'Logic Gates',
        'Combinational Circuits',
        'Sequential Circuits',
        'Number Systems',
        'K-Maps'
      ],
      icon: Video
    },
    {
      name: 'Computer Organization',
      topics: [
        'CPU Architecture',
        'Memory Hierarchy',
        'Cache Memory',
        'Pipelining',
        'Assembly Language',
        'I/O Systems'
      ],
      icon: BookOpen
    },
    {
      name: 'Programming',
      topics: [
        'Data Structures',
        'Algorithms',
        'Object-Oriented Programming',
        'C Programming',
        'Java Programming',
        'Python Programming'
      ],
      icon: Search
    },
    {
      name: 'Operating Systems',
      topics: [
        'Process Management',
        'Memory Management',
        'File Systems',
        'Deadlocks',
        'Scheduling Algorithms',
        'Virtual Memory'
      ],
      icon: Video
    },
    {
      name: 'Databases',
      topics: [
        'Relational Algebra',
        'SQL Queries',
        'Normalization',
        'Transaction Management',
        'Indexing',
        'Query Optimization'
      ],
      icon: BookOpen
    },
    {
      name: 'Computer Networks',
      topics: [
        'OSI Model',
        'TCP/IP Protocol',
        'Network Security',
        'Routing Algorithms',
        'Error Detection',
        'Flow Control'
      ],
      icon: Search
    },
    {
      name: 'Theory of Computation',
      topics: [
        'Finite Automata',
        'Regular Expressions',
        'Context-Free Grammars',
        'Turing Machines',
        'Computability',
        'Complexity Theory'
      ],
      icon: Video
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = topicCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.topics.some(topic => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleTopicSelect = (topic: string, type: 'youtube' | 'wikipedia') => {
    onTopicSelect(topic, type);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setSelectedCategory(null);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={toggleDropdown}
        className="w-full justify-between"
      >
        <span className="truncate">
          {currentTopic || 'Select a GATE topic...'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-[9999] max-h-96 overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                 <input
                   type="text"
                   placeholder="Search topics..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 text-sm border rounded-md bg-white"
                   autoFocus
                 />
              </div>
            </div>

            {/* Categories and Topics */}
            <div className="max-h-80 overflow-y-auto">
              {filteredCategories.map((category) => (
                <div key={category.name} className="border-b last:border-b-0">
                  <button
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.name ? null : category.name
                    )}
                    className="w-full p-3 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        selectedCategory === category.name ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  <AnimatePresence>
                    {selectedCategory === category.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-secondary/20 p-2 space-y-1">
                          {category.topics.map((topic) => (
                            <div key={topic} className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTopicSelect(topic, 'youtube')}
                                className="flex-1 justify-start h-8 text-xs hover:bg-background"
                              >
                                <Video className="w-3 h-3 mr-2 text-red-500" />
                                {topic}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTopicSelect(topic, 'wikipedia')}
                                className="h-8 px-2 text-xs hover:bg-background"
                              >
                                <BookOpen className="w-3 h-3 text-blue-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t bg-secondary/20">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTopicSelect('GATE CS Preparation', 'youtube')}
                  className="flex-1 text-xs"
                >
                  <Video className="w-3 h-3 mr-1" />
                  GATE CS Prep
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTopicSelect('Computer Science', 'wikipedia')}
                  className="flex-1 text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  CS Overview
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
