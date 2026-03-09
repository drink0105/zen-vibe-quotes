import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdFileDownload, MdClose } from "react-icons/md";
import { useLanguage } from "@/i18n/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      const dismissed = localStorage.getItem("zenvibe-install-dismissed");
      if (!dismissed) setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') console.log('PWA installed');
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
        <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors">
          <MdClose className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <MdFileDownload className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{t("pwa.install")}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t("pwa.desc")}</p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} variant="zen" size="sm" className="flex-1">
                {t("pwa.installBtn")}
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                {t("pwa.notNow")}
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
      </div>
    </div>
  );
}
