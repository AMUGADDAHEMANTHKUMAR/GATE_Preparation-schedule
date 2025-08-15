import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Search,
  Filter,
  Download,
  Bookmark,
  Eye,
  Calendar,
  Target,
  BarChart3,
  Play,
  Clock,
  Star,
  ChevronRight
} from 'lucide-react';
import { usePyqStore } from '@/stores/pyqStore';
import { useProgressStore } from '@/stores/progressStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';

const PyqBrowser: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch } = useProgressStore();
  const { pyqItems, filters, setFilters, clearFilters } = usePyqStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'difficulty' | 'rating'>('year');
  
  const branch = currentBranch ? getBranchByCode(currentBranch) : null;

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
            Please select a GATE branch to view PYQ papers.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  // Mock PYQ data
  const mockPyqItems = [
    {
      id: 'pyq-1',
      branch: 'CS',
      year: 2023,
      set: 'Set 1',
      title: 'GATE CS 2023 Set 1',
      difficulty: 'Medium',
      totalMarks: 100,
      duration: 180,
      topics: ['Data Structures', 'Algorithms', 'Computer Networks'],
      downloadUrl: 'https://example.com/pyq-1.pdf',
      answerKeyUrl: 'https://example.com/pyq-1-answers.pdf',
      rating: 4.5,
      solvedCount: 1250,
      isBookmarked: false,
      isSolved: false,
      isFlagged: false,
      lastAccessed: new Date('2024-01-15')
    },
    {
      id: 'pyq-2',
      branch: 'CS',
      year: 2022,
      set: 'Set 1',
      title: 'GATE CS 2022 Set 1',
      difficulty: 'Hard',
      totalMarks: 100,
      duration: 180,
      topics: ['Operating Systems', 'Database', 'Theory of Computation'],
      downloadUrl: 'https://example.com/pyq-2.pdf',
      answerKeyUrl: 'https://example.com/pyq-2-answers.pdf',
      rating: 4.8,
      solvedCount: 2100,
      isBookmarked: true,
      isSolved: true,
      isFlagged: false,
      lastAccessed: new Date('2024-01-10')
    },
    {
      id: 'pyq-3',
      branch: 'CS',
      year: 2021,
      set: 'Set 1',
      title: 'GATE CS 2021 Set 1',
      difficulty: 'Easy',
      totalMarks: 100,
      duration: 180,
      topics: ['Digital Logic', 'Computer Architecture', 'Programming'],
      downloadUrl: 'https://example.com/pyq-3.pdf',
      answerKeyUrl: 'https://example.com/pyq-3-answers.pdf',
      rating: 4.2,
      solvedCount: 1800,
      isBookmarked: false,
      isSolved: false,
      isFlagged: true,
      lastAccessed: new Date('2024-01-05')
    }
  ];

  const filteredItems = mockPyqItems.filter(item => {
    if (searchQuery) {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;
    }
    
    if (filters.year && item.year !== filters.year) return false;
    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (filters.set && item.set !== filters.set) return false;
    
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return b.year - a.year;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          <h1 className="text-3xl font-bold gradient-text">
            Previous Year Questions
          </h1>
          <p className="text-muted-foreground">
            Practice with {branch.name} question papers from 1991 to present
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={() => navigate('/resources')} className="gradient">
            <FileText className="w-4 h-4 mr-2" />
            Resources
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {mockPyqItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Papers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-2">
                  {mockPyqItems.filter(item => item.isSolved).length}
                </div>
                <div className="text-sm text-muted-foreground">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {mockPyqItems.filter(item => item.isBookmarked).length}
                </div>
                <div className="text-sm text-muted-foreground">Bookmarked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {mockPyqItems.filter(item => item.isFlagged).length}
                </div>
                <div className="text-sm text-muted-foreground">Flagged</div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search papers by title or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filters.year || ''}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 33 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value || undefined })}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="year">Sort by Year</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* PYQ List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sortedItems.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <GlassCard className="hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        item.difficulty === 'Easy' && "bg-green-100 text-green-800",
                        item.difficulty === 'Medium' && "bg-yellow-100 text-yellow-800",
                        item.difficulty === 'Hard' && "bg-red-100 text-red-800"
                      )}>
                        {item.difficulty}
                      </div>
                      {item.isBookmarked && (
                        <Bookmark className="w-4 h-4 text-yellow-500" />
                      )}
                      {item.isFlagged && (
                        <Target className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                      <span>{item.set}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration} min
                      </span>
                      <span>{item.totalMarks} marks</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {item.rating}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary rounded-full text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {item.solvedCount} students solved • Last accessed: {formatDate(item.lastAccessed)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => navigate(`/pyq/${item.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/solve/${item.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Solve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(item.downloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {sortedItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No papers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PyqBrowser;
