import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useSettingsStore } from '@/stores/settingsStore';
import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import Dashboard from '@/pages/Dashboard';
import StudyPlanPage from '@/pages/StudyPlan';
import Progress from '@/pages/Progress';
import Resources from '@/pages/Resources';
import AppSettings from '@/pages/Settings';
import PyqBrowser from '@/pages/PyqBrowser';
import PyqDetail from '@/pages/PyqDetail';
import SolveMode from '@/pages/SolveMode';
import { WelcomeModal } from '@/components/WelcomeModal';

function App() {
  const { theme, setTheme, showWelcomeModal, setShowWelcomeModal } = useSettingsStore();
  
  // Debug logging
  console.log('App rendering, theme:', theme, 'showWelcomeModal:', showWelcomeModal);

  useEffect(() => {
    // Apply theme on mount
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <ThemeProvider defaultTheme={theme} storageKey="gate-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/study-plan" element={<Layout><StudyPlanPage /></Layout>} />
          <Route path="/progress" element={<Layout><Progress /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/pyq" element={<Layout><PyqBrowser /></Layout>} />
          <Route path="/pyq/:id" element={<Layout><PyqDetail /></Layout>} />
          <Route path="/solve/:id" element={<Layout><SolveMode /></Layout>} />
          <Route path="/settings" element={<Layout><AppSettings /></Layout>} />
        </Routes>
        
        <Toaster />
        
        {showWelcomeModal && (
          <WelcomeModal 
            open={showWelcomeModal} 
            onClose={() => setShowWelcomeModal(false)} 
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
