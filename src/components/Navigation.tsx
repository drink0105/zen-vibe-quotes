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

interface NavigationProps {
  isPremium: boolean;
}

export function Navigation({ isPremium }: NavigationProps) {
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
    <nav className={`fixed left-0 right-0 z-50 ${isPremium ? 'bottom-0' : 'bottom-[60px]'}`} style={{ height: "56px" }}>
      <div className="glass-card mx-1 mb-1 rounded-2xl h-full">
        <div className="flex justify-around items-center h-full px-0.5">
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
                  flex flex-col items-center gap-0 p-0.5 h-full transition-all duration-300 flex-1 min-w-0
                  ${isActive 
                    ? 'text-primary bg-primary/10 glow-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                style={{ fontSize: "9px" }}
              >
                <Icon style={{ height: "20px", width: "20px", flexShrink: 0 }} />
                <span className="font-medium leading-tight whitespace-nowrap text-[8px] sm:text-[9px]">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}