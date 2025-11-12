import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function SettingsPage({ theme, onThemeChange }: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>
        
        <div className="max-w-md mx-auto space-y-6">
          {/* Theme Toggle */}
          <div className="quote-card">
            <h3 className="text-lg font-semibold mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Theme</span>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'zen' : 'outline'}
                  size="sm"
                  onClick={() => onThemeChange('light')}
                  className="flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'zen' : 'outline'}
                  size="sm"
                  onClick={() => onThemeChange('dark')}
                  className="flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </Button>
              </div>
            </div>
          </div>
          
          {/* App Info */}
          <div className="quote-card">
            <h3 className="text-lg font-semibold mb-4">About ZenVibe</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Version 1.0.0</p>
              <p>Your daily dose of motivation and mindfulness</p>
              <p>© 2024 ZenVibe. All rights reserved.</p>
            </div>
          </div>
          
          {/* Premium section (placeholder) */}
          <div className="quote-card gradient-motivation">
            <h3 className="text-lg font-semibold mb-2 text-black">Go Premium</h3>
            <p className="text-black/80 text-sm mb-4">
              Unlock unlimited quotes, custom themes, and advanced features
            </p>
            <Button variant="outline" className="bg-white/20 border-black/30 text-black hover:bg-white/30">
              Coming Soon - $2.99
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}