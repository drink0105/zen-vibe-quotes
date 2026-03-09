import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { 
  MdHome, 
  MdFavorite, 
  MdPlaylistAdd, 
  MdSettings,
  MdTimer,
  MdSelfImprovement
} from "react-icons/md";

interface NavigationProps {
  isPremium: boolean;
}

export function Navigation({ isPremium }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { id: "/", label: t("nav.home"), icon: MdHome },
    { id: "/favorites", label: t("nav.favorites"), icon: MdFavorite },
    { id: "/playlists", label: t("nav.playlists"), icon: MdPlaylistAdd },
    { id: "/timer", label: t("nav.timer"), icon: MdTimer },
    { id: "/checkin", label: t("nav.checkin"), icon: MdSelfImprovement },
    { id: "/settings", label: t("nav.settings"), icon: MdSettings },
  ];

  return (
    <nav className={`fixed left-0 right-0 z-50 ${isPremium ? 'bottom-0' : 'bottom-[52px]'}`} style={{ height: "50px" }}>
      <div className="glass-card mx-1 mb-1 rounded-2xl h-full overflow-hidden">
        <div className="flex flex-row flex-nowrap justify-around items-center h-full px-0.5 gap-0" style={{ flexWrap: 'nowrap' }}>
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
                  flex flex-col items-center justify-center gap-0 p-1 h-full transition-all duration-300 flex-1 min-w-0 shrink-0
                  ${isActive 
                    ? 'text-primary bg-primary/10 glow-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                style={{ fontSize: "9px", maxWidth: "16.666%", minWidth: 0 }}
              >
                <Icon style={{ height: "14px", width: "14px", flexShrink: 0 }} />
                <span className="font-medium leading-tight whitespace-nowrap overflow-hidden text-ellipsis text-[9px] w-full text-center block">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
