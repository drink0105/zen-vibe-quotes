import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MdHome, 
  MdFavorite, 
  MdPlaylistAdd, 
  MdSettings,
  MdTimer,
  MdNotifications
} from "react-icons/md";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { id: "/", label: "Home", icon: MdHome },
    { id: "/favorites", label: "Favorites", icon: MdFavorite },
    { id: "/playlists", label: "Playlists", icon: MdPlaylistAdd },
    { id: "/timer", label: "Timer", icon: MdTimer },
    { id: "/alarms", label: "Alarms", icon: MdNotifications },
    { id: "/settings", label: "Settings", icon: MdSettings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card m-4 rounded-2xl">
        <div className="flex flex-wrap justify-around items-center py-3 px-2 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 p-3 h-auto transition-all duration-300 min-w-[60px]
                  ${isActive 
                    ? 'text-primary bg-primary/10 glow-primary scale-110' 
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-glow-pulse' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}