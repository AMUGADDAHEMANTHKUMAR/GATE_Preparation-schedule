import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const features = [
  {
    title: "Comprehensive Syllabus Coverage",
    description: "Access detailed syllabus for all 30 GATE branches with topic-wise breakdowns",
    icon: "📚"
  },
  {
    title: "Smart Progress Tracking",
    description: "Monitor your preparation with detailed analytics and performance insights",
    icon: "📊"
  },
  {
    title: "Previous Year Questions",
    description: "Practice with PYQs and get auto-updated answer keys and solutions",
    icon: "📝"
  },
  {
    title: "Personalized Study Plans",
    description: "Get customized study schedules based on your timeline and goals",
    icon: "🎯"
  },
  {
    title: "Rich Study Resources",
    description: "Access curated books, videos, and practice materials for each topic",
    icon: "📖"
  },
  {
    title: "Offline Access",
    description: "Study anywhere with offline access to your materials and progress",
    icon: "📱"
  }
];

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const steps = [
    {
      title: "Welcome to GATE Prep Master! 🎉",
      description: "Your comprehensive companion for GATE preparation across all 30 engineering branches.",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to Ace GATE?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Let's take a quick tour to help you get started with your preparation journey.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features",
      description: "Discover what makes GATE Prep Master your perfect study companion.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Get Started",
      description: "You're all set! Choose your branch and start your preparation journey.",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You're Ready!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Navigate through the app using the sidebar menu. Start by selecting your branch and creating a study plan.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Tips:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use the Progress page to track your study completion</li>
              <li>• Access PYQs for practice and revision</li>
              <li>• Customize your study plan in the Study Plan section</li>
              <li>• Explore resources for each topic in the Resources page</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                    <CardDescription>{steps[currentStep].description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep].content}
                </motion.div>
                
                <div className="flex items-center justify-between mt-8">
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index <= currentStep 
                            ? 'bg-blue-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip Tour
                    </Button>
                    <Button onClick={handleNext} className="flex items-center space-x-2">
                      <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
