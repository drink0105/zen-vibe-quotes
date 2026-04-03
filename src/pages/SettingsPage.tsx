import { Button } from "@/components/ui/button";
import { MdSettings, MdLightMode, MdDarkMode, MdStars, MdRecordVoiceOver, MdVolumeUp, MdLanguage } from "react-icons/md";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CheckInHistory } from "@/components/CheckInHistory";
import { getVoicesForLanguage, getDefaultVoiceForLanguage } from "@/hooks/useSpeakQuote";
import { useLanguage } from "@/i18n/LanguageContext";

interface CheckInData {
  date: string;
  morning: boolean;
  evening: boolean;
  reflection: string;
}

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  backgroundTheme: string;
  onBackgroundThemeChange: (theme: string) => void;
  appVersion: string;
  onVersionChange: (version: string) => void;
}

export default function SettingsPage({ 
  theme, 
  onThemeChange, 
  backgroundTheme,
  onBackgroundThemeChange,
  appVersion,
  onVersionChange,
}: SettingsPageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [newVersion, setNewVersion] = useState(appVersion);
  
  const [selectedVoice, setSelectedVoice] = useLocalStorage<string>("zenvibe-selected-voice", "");
  const [voiceSpeed, setVoiceSpeed] = useLocalStorage<number>("zenvibe-voice-speed", 1);
  const [voicePitch, setVoicePitch] = useLocalStorage<number>("zenvibe-voice-pitch", 1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const [checkIns] = useLocalStorage<CheckInData[]>("zenvibe-checkins", []);
  const [streak] = useLocalStorage<number>("zenvibe-streak", 0);

  useEffect(() => {
    const loadVoices = () => {
      const voices = getVoicesForLanguage(language);
      setAvailableVoices(voices);
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  useEffect(() => {
    if (availableVoices.length > 0 && !selectedVoice) {
      const defaultVoice = getDefaultVoiceForLanguage(language);
      if (defaultVoice) setSelectedVoice(defaultVoice.name);
    }
  }, [availableVoices.length, language]);

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(t("settings.testVoiceText"));
      
      let voice: SpeechSynthesisVoice | null = null;
      if (selectedVoice) {
        voice = availableVoices.find(v => v.name === selectedVoice) || null;
      }
      if (!voice) {
        voice = getDefaultVoiceForLanguage(language);
      }
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';
      }
      
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      
      speechSynthesis.speak(utterance);
    }
  };

  const getVoiceDisplayName = (voice: SpeechSynthesisVoice) => {
    if (language === 'zh') {
      const langMap: Record<string, string> = {
        'zh-CN': '普通话',
        'zh-TW': '台湾',
        'zh-HK': '香港',
      };
      const accent = langMap[voice.lang] || voice.lang;
      return `${voice.name} (${accent})`;
    }
    const langMap: Record<string, string> = {
      'en-US': 'US', 'en-GB': 'UK', 'en-AU': 'AU', 'en-IN': 'IN',
      'en-ZA': 'ZA', 'en-IE': 'IE', 'en-NZ': 'NZ',
    };
    const accent = langMap[voice.lang] || voice.lang.replace('en-', '');
    return `${voice.name} (${accent})`;
  };

  const activeVoiceName = selectedVoice 
    ? selectedVoice 
    : (getDefaultVoiceForLanguage(language)?.name || t("settings.voiceDefault"));

  const backgroundGradients = [
    { name: t("bg.default"), class: "default-gradient", id: "default" },
    { name: t("bg.ocean"), class: "from-[#3B82F6] to-[#14B8A6]", id: "ocean" },
    { name: t("bg.sunset"), class: "from-[#F97316] to-[#8B5CF6]", id: "sunset" },
    { name: t("bg.forest"), class: "from-green-400 to-green-600", id: "forest" },
    { name: t("bg.purple"), class: "from-purple-400 to-purple-600", id: "purple" },
    { name: t("bg.rose"), class: "from-pink-400 to-rose-500", id: "rose" },
    { name: t("bg.emerald"), class: "from-emerald-400 to-emerald-600", id: "emerald" },
    { name: t("bg.amber"), class: "from-amber-400 to-orange-500", id: "amber" },
    { name: t("bg.indigo"), class: "from-indigo-400 to-blue-500", id: "indigo" },
  ];

  return (
    <div className="min-h-screen pb-[130px] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdSettings className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>

        {/* Language Toggle */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdLanguage className="w-5 h-5" />
            {t("settings.language")}
          </h3>
          <div className="flex gap-4">
            <Button
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? "zen" : "outline"}
              className="flex-1"
            >
              English
            </Button>
            <Button
              onClick={() => setLanguage('zh')}
              variant={language === 'zh' ? "zen" : "outline"}
              className="flex-1"
            >
              中文
            </Button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("settings.theme")}</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => onThemeChange('light')}
              variant={theme === 'light' ? "zen" : "outline"}
              className="flex-1"
            >
              <MdLightMode className="w-4 h-4 mr-2" />
              {t("settings.light")}
            </Button>
            <Button
              onClick={() => onThemeChange('dark')}
              variant={theme === 'dark' ? "zen" : "outline"}
              className="flex-1"
            >
              <MdDarkMode className="w-4 h-4 mr-2" />
              {t("settings.dark")}
            </Button>
          </div>
        </div>

        {/* Voice & Audio */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdRecordVoiceOver className="w-5 h-5" />
            {t("settings.voiceAudio")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{t("settings.voiceAudioDesc")}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("settings.voice")}
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="glass-button w-full p-3 rounded-lg border text-foreground"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {getVoiceDisplayName(voice)}
                  </option>
                ))}
              </select>
            </div>

            <TouchSafeSlider
              label={`${t("settings.voiceSpeed")}: ${voiceSpeed}x`}
              min={0.5} max={2} step={0.1}
              value={voiceSpeed}
              onChange={(v) => setVoiceSpeed(v)}
            />
            <TouchSafeSlider
              label={`${t("settings.voicePitch")}: ${voicePitch}x`}
              min={0.5} max={2} step={0.1}
              value={voicePitch}
              onChange={(v) => setVoicePitch(v)}
            />

            <Button onClick={testVoice} variant="outline" size="sm">
              <MdVolumeUp className="w-4 h-4 mr-2" />
              {t("settings.testVoice")}
            </Button>
          </div>
        </div>

        {/* Background Themes */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("settings.bgThemes")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("settings.bgThemesDesc")}</p>
          <div className="grid grid-cols-2 gap-3">
            {backgroundGradients.map((gradient) => (
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
              </div>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("settings.about")}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t("settings.version")}</p>
            <p>{t("settings.quotesCount")}</p>
            <p>{t("settings.categories")}</p>
            <p>{t("settings.offline")}</p>
            <p className="pt-2">
              <a href="/privacy.html" className="text-primary hover:underline">{t("settings.privacy")}</a>
            </p>
          </div>
        </div>

        <CheckInHistory checkIns={checkIns} streak={streak} compact />
      </div>
    </div>
  );
}
