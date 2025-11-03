import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdSettings, MdLightMode, MdDarkMode, MdStars, MdRefresh } from "react-icons/md";
import { useState } from "react";

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  isPremium: boolean;
  onPremiumChange: (premium: boolean) => void;
  backgroundTheme: string;
  onBackgroundThemeChange: (theme: string) => void;
  appVersion: string;
  onVersionChange: (version: string) => void;
  testFreemiumMode: boolean;
  onTestFreemiumModeChange: (enabled: boolean) => void;
}

export default function SettingsPage({ 
  theme, 
  onThemeChange, 
  isPremium, 
  onPremiumChange,
  backgroundTheme,
  onBackgroundThemeChange,
  appVersion,
  onVersionChange,
  testFreemiumMode,
  onTestFreemiumModeChange
}: SettingsPageProps) {
  const [newVersion, setNewVersion] = useState(appVersion);

  const backgroundGradients = [
    { name: "Default", class: "default-gradient", tier: "free", id: "default" },
    { name: "Ocean", class: "from-[#3B82F6] to-[#14B8A6]", tier: "free", id: "ocean" },
    { name: "Sunset", class: "from-[#F97316] to-[#8B5CF6]", tier: "free", id: "sunset" },
    { name: "Forest", class: "from-green-400 to-green-600", tier: "premium", id: "forest" },
    { name: "Purple", class: "from-purple-400 to-purple-600", tier: "premium", id: "purple" },
    { name: "Rose", class: "from-pink-400 to-rose-500", tier: "premium", id: "rose" },
    { name: "Emerald", class: "from-emerald-400 to-emerald-600", tier: "premium", id: "emerald" },
    { name: "Amber", class: "from-amber-400 to-orange-500", tier: "premium", id: "amber" },
    { name: "Indigo", class: "from-indigo-400 to-blue-500", tier: "premium", id: "indigo" },
  ];

  const handleVersionUpdate = () => {
    onVersionChange(newVersion);
    // In a real app, this would update the manifest.json
    console.log(`Version updated to ${newVersion}`);
  };

  const availableGradients = isPremium ? backgroundGradients : backgroundGradients.filter(g => g.tier === "free");

  return (
    <div className="min-h-screen pb-[180px] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdSettings className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your ZenVibe experience
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Theme</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => onThemeChange('light')}
              variant={theme === 'light' ? "zen" : "outline"}
              className="flex-1"
            >
              <MdLightMode className="w-4 h-4 mr-2" />
              Light
            </Button>
            <Button
              onClick={() => onThemeChange('dark')}
              variant={theme === 'dark' ? "zen" : "outline"}
              className="flex-1"
            >
              <MdDarkMode className="w-4 h-4 mr-2" />
              Dark
            </Button>
          </div>
        </div>

        {/* Background Themes */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Background Themes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a background theme that applies across all screens
          </p>
          <div className="grid grid-cols-2 gap-3">
            {availableGradients.map((gradient) => (
              <div
                key={gradient.id}
                onClick={() => onBackgroundThemeChange(gradient.id)}
                className={`h-20 rounded-lg ${
                  gradient.id === "default" 
                    ? `bg-gradient-to-br ${theme === 'light' ? 'from-[#FFF7ED] to-[#FFDAB9]' : 'from-[#1A202C] to-[#000000]'}` 
                    : `bg-gradient-to-br ${gradient.class}`
                } flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition-transform border-2 ${
                  backgroundTheme === gradient.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                } ${gradient.id === "default" ? 'text-foreground' : 'text-white'}`}
              >
                {gradient.name}
                {gradient.tier === "premium" && (
                  <MdStars className="w-4 h-4 ml-2" />
                )}
              </div>
            ))}
          </div>
          {!isPremium && (
            <p className="text-sm text-muted-foreground mt-4">
              Upgrade to Premium to unlock 6 additional background themes
            </p>
          )}
        </div>

        {/* Version Management */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">App Version</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update version number for Play Console submissions
          </p>
          <div className="flex gap-3">
            <Input
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              placeholder="1.0.0"
              className="flex-1"
            />
            <Button 
              onClick={handleVersionUpdate}
              variant="zen"
              className="px-4"
            >
              <MdRefresh className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current version: {appVersion} • Use semantic versioning (major.minor.patch)
          </p>
        </div>

        {/* Test Freemium Mode */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Developer Testing</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Test Freemium Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable premium features for testing</p>
              <p className="text-xs text-muted-foreground mt-1">Resets on app restart</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={testFreemiumMode}
                onChange={(e) => onTestFreemiumModeChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Premium Status */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Premium Status</h3>
          {isPremium && !testFreemiumMode ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg text-white">
              <MdStars className="w-6 h-6" />
              <div>
                <p className="font-semibold">Premium Active</p>
                <p className="text-sm opacity-90">Enjoy all premium features!</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Unlock unlimited favorites, playlists, alarms, and premium content
              </p>
              <Button 
                onClick={() => onPremiumChange(true)} 
                variant="zen"
                className="px-8"
              >
                <MdStars className="w-4 h-4 mr-2" />
                Upgrade to Premium - $2.99
              </Button>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">About ZenVibe</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Version: 1.0.0</p>
            <p>500+ motivational quotes and affirmations</p>
            <p>6 categories: Motivation, Mindfulness, Humor, Productivity, Creativity, Resilience</p>
            <p>Fully offline experience</p>
            <p className="pt-2">
              <a href="/privacy.html" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}