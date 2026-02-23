import { Button } from "@/components/ui/button";
import { 
  MdRocket, 
  MdSelfImprovement, 
  MdEmojiEmotions, 
  MdBolt, 
  MdPalette, 
  MdFitnessCenter,
  MdAutoAwesome 
} from "react-icons/md";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = [
  { id: "all", label: "All", icon: MdAutoAwesome, gradient: "gradient-default" },
  { id: "motivation", label: "Motivated", icon: MdRocket, gradient: "gradient-motivation" },
  { id: "mindfulness", label: "Peaceful", icon: MdSelfImprovement, gradient: "gradient-mindfulness" },
  { id: "humor", label: "Cheerful", icon: MdEmojiEmotions, gradient: "gradient-humor" },
  { id: "productivity", label: "Focused", icon: MdBolt, gradient: "gradient-productivity" },
  { id: "creativity", label: "Creative", icon: MdPalette, gradient: "gradient-creativity" },
  { id: "resilience", label: "Strong", icon: MdFitnessCenter, gradient: "gradient-resilience" },
];

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <h3 className="text-lg font-medium text-center mb-6 text-foreground">
        How are you feeling today?
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;

          return (
            <Button
              key={mood.id}
              onClick={() => onMoodChange(mood.id)}
              variant={isSelected ? "zen" : "glass"}
              size="sm"
              className={`
                flex flex-col items-center gap-2 h-auto py-4 px-3 tilt-3d
                ${isSelected ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground' : 'text-foreground'}
                transition-all duration-300 hover:scale-105 dark:hover:text-white dark:active:text-white
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{mood.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

