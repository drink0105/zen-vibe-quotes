import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdFileDownload, MdClose } from "react-icons/md";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem("zenvibe-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("zenvibe-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
      <div className="glass-card p-4 max-w-md mx-auto relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <MdClose className="w-5 h-5 text-foreground" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <MdFileDownload className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Install ZenVibe
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add to your home screen for quick access and offline use
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                variant="zen"
                size="sm"
                className="flex-1"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
      </div>
    </div>
  );
}