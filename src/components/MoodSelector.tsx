import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = [
  { name: "All", category: "all", emoji: "✨" },
  { name: "Motivated", category: "Motivation", emoji: "🚀" },
  { name: "Peaceful", category: "Mindfulness", emoji: "🧘" },
  { name: "Cheerful", category: "Humor", emoji: "😄" },
  { name: "Focused", category: "Productivity", emoji: "⚡" },
  { name: "Creative", category: "Creativity", emoji: "🎨" },
  { name: "Strong", category: "Resilience", emoji: "💪" },
];

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <h3 className="text-lg font-medium text-center mb-4 text-muted-foreground">
        How are you feeling today?
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.category}
            onClick={() => onMoodChange(mood.category)}
            variant={selectedMood === mood.category ? "zen" : "outline"}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-3 px-2"
          >
            <span className="text-lg">{mood.emoji}</span>
            <span className="text-xs">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}