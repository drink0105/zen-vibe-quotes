import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { MdMenuBook } from "react-icons/md";

/**
 * Subtle "Explore Blogs" CTA that appears once the user scrolls past
 * the Quote of the Day on the Home screen.
 */
export function BlogsCTA() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after the user scrolls past ~280px (below Quote of the Day).
      setVisible(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`flex items-center justify-center px-4 pb-6 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Button
        variant="zen"
        size="lg"
        onClick={() => navigate("/blogs")}
        className="gap-2"
      >
        <MdMenuBook className="w-5 h-5" />
        {t("blogs.explore")}
      </Button>
    </div>
  );
}
