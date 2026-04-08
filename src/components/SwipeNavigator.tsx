import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const TAB_ORDER = ["/", "/favorites", "/playlists", "/timer", "/checkin", "/settings"];

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isMobile) return;
      const idx = TAB_ORDER.indexOf(location.pathname);
      if (idx < TAB_ORDER.length - 1) {
        setSwipeDir("left");
        navigate(TAB_ORDER[idx + 1]);
        setTimeout(() => setSwipeDir(null), 300);
      }
    },
    onSwipedRight: () => {
      if (!isMobile) return;
      const idx = TAB_ORDER.indexOf(location.pathname);
      if (idx > 0) {
        setSwipeDir("right");
        navigate(TAB_ORDER[idx - 1]);
        setTimeout(() => setSwipeDir(null), 300);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50,
  });

  return (
    <div {...handlers} className="min-h-full">
      <div
        className={
          swipeDir === "left"
            ? "animate-slide-in-right"
            : swipeDir === "right"
            ? "animate-slide-in-left"
            : ""
        }
      >
        {children}
      </div>
    </div>
  );
}
