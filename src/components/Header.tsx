import { Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import SettingsDialog from "./SettingsDialog";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}

const Header = ({ language, onLanguageChange, mapStyle, onMapStyleChange }: HeaderProps) => {
  const { t } = useTranslation(language);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Map className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              TengriMap
            </h1>
          </Link>

          {/* Navigation and Settings */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="lg" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/about">{t("about")}</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/resources">{t("resources")}</Link>
              </Button>
            </nav>
            <SettingsDialog
              language={language}
              onLanguageChange={onLanguageChange}
              mapStyle={mapStyle}
              onMapStyleChange={onMapStyleChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
