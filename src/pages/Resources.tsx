import { useState, useEffect } from "react";
import { ExternalLink, BookOpen, Video, FileText, BookImage, MountainSnow } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTouchHover } from "@/hooks/useTouchHover";

const Resources = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "English";
  });
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "political";
  });
  const { handleClick, isHovered } = useTouchHover("resources");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("mapStyle", mapStyle);
  }, [mapStyle]);

  const resources = [
    {
      category: "Historical Sites",
      icon: MountainSnow,
      items: [
        { name: "UNESCO World Heritage Sites in Central Asia", url: "#" },
        { name: "Ancient Silk Road Trading Posts", url: "#" },
        { name: "Archaeological Discoveries", url: "#" },
      ],
    },
    {
      category: "Cultural Resources",
      icon: BookImage,
      items: [
        { name: "Traditional Music and Dance", url: "#" },
        { name: "Nomadic Heritage and Lifestyle", url: "#" },
        { name: "Central Asian Cuisine Guide", url: "#" },
      ],
    },
    {
      category: "Educational Materials",
      icon: FileText,
      items: [
        { name: "History Timeline of Central Asia", url: "#" },
        { name: "Language Learning Resources", url: "#" },
        { name: "Cultural Etiquette Guide", url: "#" },
      ],
    },
    {
      category: "Multimedia",
      icon: Video,
      items: [
        { name: "Documentary Collection", url: "#" },
        { name: "Virtual Museum Tours", url: "#" },
        { name: "Photo Galleries", url: "#" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} mapStyle={mapStyle} onMapStyleChange={setMapStyle} />

      <div className="flex-1 flex flex-col pt-24 pb-16 px-3 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted/40 animate-gradient bg-[length:400%_400%]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore curated materials about Central Asian culture and heritage
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {resources.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.category}
                  className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{section.category}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-between h-auto py-3 px-4 text-left hover:bg-primary/10 gap-3 ${
                            isHovered(`${section.category}-${item.name}`) ? "bg-primary/10" : ""
                          }`}
                          onClick={(e) =>
                            handleClick(e, `${section.category}-${item.name}`, () => {
                              window.open(item.url, "_blank", "noopener,noreferrer");
                            })
                          }
                        >
                          <span className="text-foreground break-words flex-1 min-w-0">{item.name}</span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 border border-border/50 text-center space-y-4">
            <h3 className="text-2xl font-bold">Want to Contribute?</h3>
            <p className="text-muted-foreground">
              If you have resources or information to share about Central Asian culture, we'd love to hear from you.
            </p>
            <Button size="lg" className="shadow-lg" asChild>
              <a href="mailto:centralasiamapper@gmail.com">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Resources;
