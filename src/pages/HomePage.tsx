import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Target, TrendingUp, Users, Award } from 'lucide-react';
import { branches } from '@/data/branches';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  },
};

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Comprehensive Syllabus",
    description: "Complete coverage of all 30 GATE branches with detailed topic breakdowns"
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Smart Study Plans",
    description: "Personalized study schedules based on your timeline and goals"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Progress Tracking",
    description: "Monitor your preparation with detailed analytics and insights"
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Previous Year Questions",
    description: "Access to PYQs with auto-updating answer keys and solutions"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Study Resources",
    description: "Curated books, videos, and practice materials for each topic"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Mock Tests",
    description: "Practice with realistic mock tests and performance analysis"
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const { setCurrentBranch } = useProgressStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  
  // Debug logging
  console.log('HomePage rendering, branches:', branches.length);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBranchSelect = (branchCode: string) => {
    setSelectedBranch(branchCode);
    setCurrentBranch(branchCode as any);
    
    toast({
      title: "Branch Selected!",
      description: `You've selected ${getBranchByCode(branchCode)?.name}. Let's start your GATE preparation journey!`,
    });

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const getBranchByCode = (code: string) => {
    return branches.find(branch => branch.code === code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
              GATE Prep Master
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your comprehensive companion for GATE preparation across all 30 engineering branches
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">30</div>
                <div className="text-sm text-gray-600">Branches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={cardVariants}>
                <GlassCard className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Branch Selection Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Choose Your Branch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Select your engineering branch to start your personalized GATE preparation journey
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Branch Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredBranches.map((branch, index) => (
              <motion.div
                key={branch.code}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
                    selectedBranch === branch.code 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                  onClick={() => handleBranchSelect(branch.code)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-4">{branch.icon}</div>
                    <CardTitle className="text-lg font-bold">{branch.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Code: {branch.code} • {branch.totalMarks} marks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {branch.description}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button 
                        variant="gradient" 
                        size="sm"
                        className="w-full"
                      >
                        Start Preparation
                      </Button>
                    </div>
                  </CardContent>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredBranches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No branches found matching your search.</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gray-50 dark:bg-gray-800 py-12 mt-16"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 GATE Prep Master. Your complete GATE preparation companion.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default HomePage;
