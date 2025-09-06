import { Heart, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center gap-1 p-3 h-auto ${
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}