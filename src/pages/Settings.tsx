import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings,
  Moon,
  Sun,
  Monitor,
  Bell,
  BookOpen,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  BarChart3,
  Palette,
  Database,
  Info
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';

const AppSettings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    theme, 
    notifications, 
    studyPreferences,
    setTheme,
    toggleNotifications,
    updateNotificationSettings,
    updateStudyPreferences,
    resetToDefaults
  } = useSettingsStore();
  const { exportProgress, importProgress, resetAllProgress } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'study' | 'data'>('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'data', label: 'Data & Backup', icon: Database }
  ];

  const handleExportData = () => {
    exportProgress();
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importProgress(data);
          } catch (error) {
            console.error('Failed to import data:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetAll = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  const renderGeneralSettings = () => (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize the app's appearance and theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((themeOption) => (
              <Button
                key={themeOption.id}
                variant={theme === themeOption.id ? 'default' : 'outline'}
                onClick={() => setTheme(themeOption.id as any)}
                className="flex flex-col items-center gap-2 h-16"
              >
                <themeOption.icon className="w-5 h-5" />
                <span className="text-xs">{themeOption.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );

  const renderNotificationSettings = () => (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Enable Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive study reminders and updates
            </p>
          </div>
          <Button
            variant={notifications.enabled ? 'default' : 'outline'}
            onClick={toggleNotifications}
            size="sm"
          >
            {notifications.enabled ? 'On' : 'Off'}
          </Button>
        </div>

        {notifications.enabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Study Reminders</h4>
                <p className="text-sm text-muted-foreground">
                  Daily study session reminders
                </p>
              </div>
              <Button
                variant={notifications.studyReminders ? 'default' : 'outline'}
                onClick={() => updateNotificationSettings({ studyReminders: !notifications.studyReminders })}
                size="sm"
              >
                {notifications.studyReminders ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Progress Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Weekly progress summaries
                </p>
              </div>
              <Button
                variant={notifications.progressUpdates ? 'default' : 'outline'}
                onClick={() => updateNotificationSettings({ progressUpdates: !notifications.progressUpdates })}
                size="sm"
              >
                {notifications.progressUpdates ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );

  const renderStudySettings = () => (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Study Preferences
        </CardTitle>
        <CardDescription>
          Customize your study experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Daily Study Goal (hours)</label>
          <input
            type="number"
            value={studyPreferences.dailyGoal}
            onChange={(e) => updateStudyPreferences({ dailyGoal: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-md bg-background"
            min="1"
            max="12"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Show progress animations</h4>
            <p className="text-sm text-muted-foreground">
              Animate progress bars and transitions
            </p>
          </div>
          <Button
            variant={studyPreferences.showAnimations ? 'default' : 'outline'}
            onClick={() => updateStudyPreferences({ showAnimations: !studyPreferences.showAnimations })}
            size="sm"
          >
            {studyPreferences.showAnimations ? 'On' : 'Off'}
          </Button>
        </div>
      </CardContent>
    </GlassCard>
  );

  const renderDataSettings = () => (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Manage your study data and backups
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button
            variant="outline"
            onClick={handleImportData}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
          <div className="space-y-2">
            <Button
              variant="destructive"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Progress
            </Button>
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'study':
        return renderStudySettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold gradient-text">Settings</h1>
            <p className="text-muted-foreground">Configure your preferences</p>
          </div>
          
          <GlassCard>
            <CardContent className="p-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="w-full justify-start mb-1"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </CardContent>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <GlassCard className="p-6 max-w-md">
            <h3 className="text-lg font-bold mb-2">Reset All Progress?</h3>
            <p className="text-muted-foreground mb-4">
              This will permanently delete all your study progress and settings. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleResetAll}
              >
                Reset All Data
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AppSettings;
