import { Settings, Moon, Sun, Globe, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

interface SettingsDialogProps {
  language: string;
  onLanguageChange: (language: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}

const SettingsDialog = ({
  language,
  onLanguageChange,
  mapStyle,
  onMapStyleChange,
}: SettingsDialogProps) => {
  const { theme, setTheme } = useTheme();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'kk', name: 'Қазақша' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-lg">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your TengriMap experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <Label htmlFor="theme-toggle" className="text-base font-medium">
                Dark Mode
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          {/* Map Style Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Map className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Map Style</Label>
            </div>
            <RadioGroup value={mapStyle} onValueChange={onMapStyleChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="political" id="political" />
                <Label htmlFor="political" className="cursor-pointer">
                  Political
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satellite" id="satellite" />
                <Label htmlFor="satellite" className="cursor-pointer">
                  Satellite
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="topographical" id="topographical" />
                <Label htmlFor="topographical" className="cursor-pointer">
                  Topographical
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Language</Label>
            </div>
            <RadioGroup value={language} onValueChange={onLanguageChange}>
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.name} id={lang.code} />
                  <Label htmlFor={lang.code} className="cursor-pointer">
                    {lang.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
