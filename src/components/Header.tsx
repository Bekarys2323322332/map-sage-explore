import { Map } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import SettingsDialog from "./SettingsDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useTouchHover } from "@/hooks/useTouchHover";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}

const Header = ({ language, onLanguageChange, mapStyle, onMapStyleChange }: HeaderProps) => {
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const { handleClick, isHovered } = useTouchHover("header");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={logoDark} 
              alt="NomadLand" 
              className="h-8 sm:h-10 w-auto hidden dark:block"
            />
            <img 
              src={logoLight} 
              alt="NomadLand" 
              className="h-8 sm:h-10 w-auto block dark:hidden"
            />
          </Link>

          {/* Navigation and Settings */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                className={isHovered("nav-home") ? "bg-accent/10" : ""}
                onClick={(e) => handleClick(e, "nav-home", () => navigate("/"))}
              >
                {t("home")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className={isHovered("nav-about") ? "bg-accent/10" : ""}
                onClick={(e) => handleClick(e, "nav-about", () => navigate("/about"))}
              >
                {t("about")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className={isHovered("nav-resources") ? "bg-accent/10" : ""}
                onClick={(e) => handleClick(e, "nav-resources", () => navigate("/resources"))}
              >
                {t("resources")}
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
