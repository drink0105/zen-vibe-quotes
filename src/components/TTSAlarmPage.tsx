import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  MdAlarm, 
  MdAdd, 
  MdDelete, 
  MdAccessTime
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
  const [newAlarmTime, setNewAlarmTime] = useState("08:00");
  const [newAlarmLabel, setNewAlarmLabel] = useState("");
  
  // Read voice settings from shared storage (set in Settings page)
  const [selectedVoice] = useLocalStorage<string>("zenvibe-selected-voice", "");
  const [voiceSpeed] = useLocalStorage<number>("zenvibe-voice-speed", 1);
  const [voicePitch] = useLocalStorage<number>("zenvibe-voice-pitch", 1);

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


  return (
    <div className={`min-h-screen ${isPremium ? 'pb-[80px]' : 'pb-[130px]'} px-4 py-8`}>
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

            <p className="text-xs text-muted-foreground mb-4">
              Voice settings can be configured in Settings → Voice & Audio
            </p>

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
