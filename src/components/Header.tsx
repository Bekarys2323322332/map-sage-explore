import { Map } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              TengriMap
            </h1>
          </div>

          {/* Language selector */}
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </header>
  );
};

export default Header;
