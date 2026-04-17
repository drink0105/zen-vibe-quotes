import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { blogs } from "@/data/blogs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdArrowBack } from "react-icons/md";

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();

  const blog = blogs.find((b) => String(b.id) === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background pb-[130px] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-muted-foreground mb-4">{t("blogs.notFound")}</p>
        <Button onClick={() => navigate("/blogs")} variant="zen">
          {t("blogs.backToList")}
        </Button>
      </div>
    );
  }

  const content = blog[language] ?? blog.en;
  // Update document title for SEO when viewing a post
  useEffect(() => {
    const previous = document.title;
    document.title = `${content.title} – ZenVibe`;
    return () => {
      document.title = previous;
    };
  }, [content.title]);

  // Render body: split paragraphs, render "## " lines as headings.
  const blocks = content.body.split(/\n\n+/);

  return (
    <div className="min-h-screen bg-background pb-[130px]">
      <header className="px-4 pt-6 pb-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/blogs")}
          aria-label={t("blogs.back")}
        >
          <MdArrowBack className="w-5 h-5" />
        </Button>
        <span className="text-sm text-muted-foreground">{t("blogs.title")}</span>
      </header>

      <article className="px-4 mt-2">
        <Card className="glass-card">
          <CardContent className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {content.title}
            </h1>
            <div className="space-y-4">
              {blocks.map((block, idx) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl font-semibold text-foreground mt-6"
                    >
                      {block.replace(/^##\s+/, "")}
                    </h2>
                  );
                }
                return (
                  <p
                    key={idx}
                    className="text-base text-muted-foreground leading-relaxed whitespace-pre-line"
                  >
                    {block}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
