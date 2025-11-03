import { useState, useEffect } from "react";
import { MapPin, Globe, Users, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "English";
  });
  const [mapStyle, setMapStyle] = useState(() => {
    return localStorage.getItem("mapStyle") || "political";
  });

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
              About TengriMap
            </h1>
            <p className="text-xl text-muted-foreground">Exploring the Rich Cultural Heritage of Central Asia</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                TengriMap is dedicated to showcasing the diverse cultural heritage, history, and traditions of Central
                Asia's five nations: Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, and Turkmenistan.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold">Interactive Experience</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Explore each country through an interactive map, discovering historical sites, cultural landmarks, and
                the rich traditions that have shaped this fascinating region.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">Cultural Connection</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Connect with the stories, people, and heritage of the Silk Road, understanding how these nations have
                contributed to global culture and history.
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Educational Resource</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Learn about the unique characteristics of each country, from ancient civilizations to modern-day
                cultural practices, through our AI-powered chatbot and comprehensive information.
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
