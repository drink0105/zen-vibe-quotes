import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { blogs } from "@/data/blogs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdArrowBack, MdMenuBook } from "react-icons/md";

export default function BlogsPage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-[130px]">
      <header className="px-4 pt-6 pb-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          aria-label={t("blogs.back")}
        >
          <MdArrowBack className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <MdMenuBook className="w-6 h-6 text-primary" />
            {t("blogs.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("blogs.subtitle")}
          </p>
        </div>
      </header>

      <div className="px-4 space-y-4">
        {blogs.map((blog) => {
          const content = blog[language] ?? blog.en;
          return (
            <Card
              key={blog.id}
              className="glass-card tilt-3d cursor-pointer transition-transform hover:scale-[1.01]"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground mb-2 leading-snug">
                  {content.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {content.excerpt}
                </p>
                <Button
                  variant="zen"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blogs/${blog.id}`);
                  }}
                >
                  {t("blogs.readMore")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
