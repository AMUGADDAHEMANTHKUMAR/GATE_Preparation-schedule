import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  Play,
  Star,
  Clock,
  Target,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  Book,
  FileVideo,
  Calculator,
  PenTool,
  Headphones,
  Monitor,
  Smartphone,
  Globe,
  Database,
  Cloud,
  Zap
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatTime, getDifficultyColor } from '@/lib/utils';
import { Resource, SyllabusItem } from '@/types';

const Resources: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch, studyStats } = useProgressStore();
  const { theme } = useSettingsStore();
  
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'textbooks' | 'videos' | 'pyqs' | 'practice' | 'formulas' | 'notes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'duration' | 'difficulty'>('relevance');
  const [showCompleted, setShowCompleted] = useState(true);
  
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
            Please select a GATE branch to view resources.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  // Mock syllabus data with resources
  const syllabusData: SyllabusItem[] = [
    {
      id: 'cs-1',
      title: 'Engineering Mathematics',
      weightage: 15,
      difficulty: 'Medium',
      estimatedHours: 40,
      topics: [
        {
          id: 'cs-1-1',
          title: 'Linear Algebra',
          weightage: 5,
          difficulty: 'Medium',
          estimatedHours: 12,
          resources: [
            {
              id: 'res-1',
              title: 'Linear Algebra by Gilbert Strang',
              type: 'textbook',
              description: 'Comprehensive textbook covering matrices, determinants, and eigenvalues',
              url: 'https://example.com/linear-algebra-book',
              duration: 0,
              rating: 4.8,
              difficulty: 'Medium',
              tags: ['matrices', 'determinants', 'eigenvalues'],
              isDownloaded: false,
              isBookmarked: false
            },
            {
              id: 'res-2',
              title: 'Linear Algebra Video Lectures',
              type: 'video',
              description: 'Complete video course on linear algebra fundamentals',
              url: 'https://example.com/linear-algebra-videos',
              duration: 7200, // 2 hours in seconds
              rating: 4.6,
              difficulty: 'Medium',
              tags: ['video lectures', 'fundamentals'],
              isDownloaded: true,
              isBookmarked: true
            },
            {
              id: 'res-3',
              title: 'Linear Algebra PYQs (2015-2023)',
              type: 'pyqs',
              description: 'Previous year questions with detailed solutions',
              url: 'https://example.com/linear-algebra-pyqs',
              duration: 0,
              rating: 4.9,
              difficulty: 'Hard',
              tags: ['previous year questions', 'solutions'],
              isDownloaded: false,
              isBookmarked: false
            }
          ]
        }
      ]
    },
    {
      id: 'cs-2',
      title: 'Digital Logic',
      weightage: 8,
      difficulty: 'Easy',
      estimatedHours: 25,
      topics: [
        {
          id: 'cs-2-1',
          title: 'Boolean Algebra',
          weightage: 3,
          difficulty: 'Easy',
          estimatedHours: 8,
          resources: [
            {
              id: 'res-4',
              title: 'Digital Logic Design Textbook',
              type: 'textbook',
              description: 'Complete guide to digital logic and boolean algebra',
              url: 'https://example.com/digital-logic-book',
              duration: 0,
              rating: 4.5,
              difficulty: 'Easy',
              tags: ['boolean algebra', 'logic gates'],
              isDownloaded: false,
              isBookmarked: false
            },
            {
              id: 'res-5',
              title: 'Boolean Algebra Practice Problems',
              type: 'practice',
              description: '100+ practice problems with step-by-step solutions',
              url: 'https://example.com/boolean-practice',
              duration: 3600, // 1 hour
              rating: 4.7,
              difficulty: 'Medium',
              tags: ['practice problems', 'solutions'],
              isDownloaded: true,
              isBookmarked: false
            },
            {
              id: 'res-6',
              title: 'Digital Logic Formula Sheet',
              type: 'formulas',
              description: 'Quick reference for all digital logic formulas',
              url: 'https://example.com/digital-formulas',
              duration: 0,
              rating: 4.4,
              difficulty: 'Easy',
              tags: ['formula sheet', 'quick reference'],
              isDownloaded: true,
              isBookmarked: true
            }
          ]
        }
      ]
    }
  ];

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'textbook':
        return <Book className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pyqs':
        return <FileText className="w-5 h-5" />;
      case 'practice':
        return <PenTool className="w-5 h-5" />;
      case 'formulas':
        return <Calculator className="w-5 h-5" />;
      case 'notes':
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'textbook':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-950/20';
      case 'video':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-950/20';
      case 'pyqs':
        return 'text-green-500 bg-green-100 dark:bg-green-950/20';
      case 'practice':
        return 'text-orange-500 bg-orange-100 dark:bg-orange-950/20';
      case 'formulas':
        return 'text-red-500 bg-red-100 dark:bg-red-950/20';
      case 'notes':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-950/20';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-950/20';
    }
  };

  const handleResourceAction = (resource: Resource, action: 'download' | 'bookmark' | 'share' | 'open') => {
    switch (action) {
      case 'download':
        // Handle download logic
        console.log('Downloading:', resource.title);
        break;
      case 'bookmark':
        // Handle bookmark logic
        console.log('Bookmarking:', resource.title);
        break;
      case 'share':
        // Handle share logic
        console.log('Sharing:', resource.title);
        break;
      case 'open':
        window.open(resource.url, '_blank');
        break;
    }
  };

  const filteredSyllabus = syllabusData.filter(item => {
    if (searchQuery) {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topics?.some(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.resources?.some(resource => 
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      if (!matchesSearch) return false;
    }
    return true;
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

  const renderResource = (resource: Resource) => {
    const isFiltered = filterType !== 'all' && resource.type !== filterType;
    if (isFiltered) return null;

    return (
      <motion.div
        key={resource.id}
        variants={itemVariants}
        className="group"
      >
        <GlassCard className="h-full hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  getResourceTypeColor(resource.type)
                )}>
                  {getResourceIcon(resource.type)}
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResourceAction(resource, 'bookmark')}
                  className={cn(
                    "p-1 h-8 w-8",
                    resource.isBookmarked && "text-yellow-500"
                  )}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  {resource.rating}
                </span>
                {resource.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(resource.duration)}
                  </span>
                )}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  getDifficultyColor(resource.difficulty)
                )}>
                  {resource.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {resource.isDownloaded && (
                  <Download className="w-3 h-3 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResourceAction(resource, 'open')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResourceAction(resource, 'download')}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResourceAction(resource, 'share')}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>
    );
  };

  const renderTopic = (topic: any, level: number = 0) => {
    const isExpanded = expandedTopics.has(topic.id);
    const hasResources = topic.resources && topic.resources.length > 0;

    return (
      <motion.div
        key={topic.id}
        variants={itemVariants}
        className={cn(
          "border-l-2 border-primary/20",
          level === 0 && "ml-0",
          level === 1 && "ml-4"
        )}
      >
        <div className="p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasResources && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTopicExpansion(topic.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <div>
                <h3 className="font-medium">{topic.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {topic.weightage}%
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    getDifficultyColor(topic.difficulty)
                  )}>
                    {topic.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedHours}h
                  </span>
                  {hasResources && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {topic.resources.length} resources
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {hasResources && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {topic.resources.map(renderResource)}
          </motion.div>
        )}
      </motion.div>
    );
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
            Study Resources
          </h1>
          <p className="text-muted-foreground">
            Comprehensive study materials for {branch.name}
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

      {/* Resource Stats */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-2">
                  <Book className="w-8 h-8 mx-auto mb-2" />
                  150+
                </div>
                <div className="text-sm text-muted-foreground">Textbooks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500 mb-2">
                  <Video className="w-8 h-8 mx-auto mb-2" />
                  200+
                </div>
                <div className="text-sm text-muted-foreground">Video Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  500+
                </div>
                <div className="text-sm text-muted-foreground">PYQ Papers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  <PenTool className="w-8 h-8 mx-auto mb-2" />
                  1000+
                </div>
                <div className="text-sm text-muted-foreground">Practice Problems</div>
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
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="textbook">Textbooks</option>
                  <option value="video">Videos</option>
                  <option value="pyqs">PYQs</option>
                  <option value="practice">Practice</option>
                  <option value="formulas">Formulas</option>
                  <option value="notes">Notes</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="duration">Duration</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Resource Categories */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Resource Categories
            </CardTitle>
            <CardDescription>
              Browse resources by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { type: 'textbook', icon: Book, label: 'Textbooks', count: 150, color: 'text-blue-500' },
                { type: 'video', icon: Video, label: 'Videos', count: 200, color: 'text-purple-500' },
                { type: 'pyqs', icon: FileText, label: 'PYQs', count: 500, color: 'text-green-500' },
                { type: 'practice', icon: PenTool, label: 'Practice', count: 1000, color: 'text-orange-500' },
                { type: 'formulas', icon: Calculator, label: 'Formulas', count: 50, color: 'text-red-500' },
                { type: 'notes', icon: FileText, label: 'Notes', count: 100, color: 'text-gray-500' }
              ].map((category) => (
                <Button
                  key={category.type}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => setFilterType(category.type as any)}
                >
                  <category.icon className={cn("w-6 h-6", category.color)} />
                  <span className="text-xs">{category.label}</span>
                  <span className="text-xs text-muted-foreground">{category.count}+</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Topics and Resources */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {filteredSyllabus.map((item) => renderTopic(item))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access frequently used resources
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
              >
                <Video className="w-6 h-6" />
                <span>Video Lectures</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <Calculator className="w-6 h-6" />
                <span>Formula Sheets</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <PenTool className="w-6 h-6" />
                <span>Practice Tests</span>
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Resources;
