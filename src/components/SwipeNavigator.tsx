import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const TAB_ORDER = ["/", "/favorites", "/playlists", "/timer", "/checkin", "/settings"];

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (!isMobile) return;
      if (Math.abs(eventData.velocity) < 0.15) return;
      const idx = TAB_ORDER.indexOf(location.pathname);
      if (idx >= 0 && idx < TAB_ORDER.length - 1) {
        navigate(TAB_ORDER[idx + 1]);
      }
    },
    onSwipedRight: (eventData) => {
      if (!isMobile) return;
      if (Math.abs(eventData.velocity) < 0.15) return;
      const idx = TAB_ORDER.indexOf(location.pathname);
      if (idx > 0) {
        navigate(TAB_ORDER[idx - 1]);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 80,
  });

  return (
    <div {...handlers} className="min-h-full">
      {children}
    </div>
  );
}
