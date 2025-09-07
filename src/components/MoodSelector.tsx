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
  { name: "All", category: "all", icon: MdAutoAwesome, gradient: "gradient-default" },
  { name: "Motivated", category: "Motivation", icon: MdRocket, gradient: "gradient-motivation" },
  { name: "Peaceful", category: "Mindfulness", icon: MdSelfImprovement, gradient: "gradient-mindfulness" },
  { name: "Cheerful", category: "Humor", icon: MdEmojiEmotions, gradient: "gradient-humor" },
  { name: "Focused", category: "Productivity", icon: MdBolt, gradient: "gradient-productivity" },
  { name: "Creative", category: "Creativity", icon: MdPalette, gradient: "gradient-creativity" },
  { name: "Strong", category: "Resilience", icon: MdFitnessCenter, gradient: "gradient-resilience" },
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
          const isSelected = selectedMood === mood.category;
          
          return (
            <Button
              key={mood.category}
              onClick={() => onMoodChange(mood.category)}
              variant={isSelected ? "zen" : "glass"}
              size="sm"
              className={`
                flex flex-col items-center gap-2 h-auto py-4 px-3 tilt-3d
                ${isSelected ? `${mood.gradient} glow-primary text-white` : ''}
                transition-all duration-300 hover:scale-105
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{mood.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}