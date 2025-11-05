import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  MdAlarm, 
  MdAdd, 
  MdDelete, 
  MdVolumeUp, 
  MdAccessTime,
  MdRecordVoiceOver
} from "react-icons/md";

interface TTSAlarm {
  id: string;
  time: string;
  enabled: boolean;
  voice: string;
  label: string;
  speed?: number;
  pitch?: number;
}

interface TTSAlarmPageProps {
  isPremium: boolean;
  onPremiumUpgrade: () => void;
}

export function TTSAlarmPage({ isPremium, onPremiumUpgrade }: TTSAlarmPageProps) {
  const [alarms, setAlarms] = useLocalStorage<TTSAlarm[]>("tts-alarms", []);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState("08:00");
  const [newAlarmLabel, setNewAlarmLabel] = useState("");
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        // Get device default voice (usually first in list)
        const defaultVoice = voices.find(v => v.default) || voices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const addAlarm = () => {
    if (!isPremium && alarms.length >= 1) {
      alert("Free tier allows only 1 alarm. Upgrade to Premium for unlimited alarms!");
      return;
    }

    const newAlarm: TTSAlarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      enabled: true,
      voice: selectedVoice,
      label: newAlarmLabel || `Alarm ${alarms.length + 1}`,
      speed: voiceSpeed,
      pitch: voicePitch,
    };

    setAlarms([...alarms, newAlarm]);
    setNewAlarmLabel("");
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "You are capable of achieving great things today!"
      );
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`min-h-screen ${isPremium ? 'pb-[100px]' : 'pb-[160px]'} px-4 py-8`}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdAlarm className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Daily Affirmation Alarms</h1>
          <p className="text-muted-foreground">
            Wake up to motivational affirmations every day
          </p>
        </div>

        {/* Add New Alarm */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdAdd className="w-5 h-5" />
            Add New Alarm
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MdAccessTime className="w-4 h-4" />
                Time
              </label>
              <input
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
                className="glass-button w-full p-3 rounded-lg border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Label (Optional)
              </label>
              <input
                type="text"
                value={newAlarmLabel}
                onChange={(e) => setNewAlarmLabel(e.target.value)}
                placeholder="Morning motivation"
                className="glass-button w-full p-3 rounded-lg border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MdRecordVoiceOver className="w-4 h-4" />
                Voice {!isPremium && "(Premium only)"}
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={!isPremium}
                className="glass-button w-full p-3 rounded-lg border text-foreground"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {isPremium && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice Speed: {voiceSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice Pitch: {voicePitch}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            <Button
              onClick={testVoice}
              variant="outline"
              size="sm"
            >
              <MdVolumeUp className="w-4 h-4 mr-2" />
              Test Voice
            </Button>

            <Button onClick={addAlarm} variant="zen" className="w-full">
              <MdAdd className="w-4 h-4 mr-2" />
              Add Alarm
            </Button>
          </div>
        </div>

        {/* Existing Alarms */}
        <div className="space-y-4">
          {alarms.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <MdAlarm className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No alarms set yet</p>
            </div>
          ) : (
            alarms.map((alarm) => (
              <div key={alarm.id} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${alarm.enabled ? 'bg-primary text-white glow-primary' : 'bg-muted'}
                    `}>
                      <MdAlarm className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{alarm.time}</p>
                      <p className="text-sm text-muted-foreground">{alarm.label}</p>
                      <p className="text-xs text-muted-foreground">{alarm.voice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleAlarm(alarm.id)}
                      variant={alarm.enabled ? "zen" : "outline"}
                      size="sm"
                    >
                      {alarm.enabled ? "ON" : "OFF"}
                    </Button>
                    <Button
                      onClick={() => deleteAlarm(alarm.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <MdDelete className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Premium upsell */}
        {!isPremium && (
          <div className="glass-card p-6 mt-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">Go Premium</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock unlimited alarms, all voice options, and access to 80 premium affirmations
            </p>
            <Button 
              onClick={onPremiumUpgrade}
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Upgrade for $2.99
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
