import { useState, useEffect } from "react";
import { MapPin, Globe, Users, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";

const About = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "English";
  });
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "political";
  });
  const { t } = useTranslation(language);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("mapStyle", mapStyle);
  }, [mapStyle]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} mapStyle={mapStyle} onMapStyleChange={setMapStyle} />

      <div className="flex-1 flex flex-col pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-muted/40 animate-gradient bg-[length:400%_400%]" />

        <div className="relative z-10 max-w-4xl mx-auto w-full space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent overflow-visible">
              {t("about_nomadland")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("about_description")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{t("our_mission")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("mission_description")}
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">{t("interactive_experience")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("interactive_description")}
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">{t("cultural_connection")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("cultural_description")}
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{t("educational_insight")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t("educational_description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default About;
