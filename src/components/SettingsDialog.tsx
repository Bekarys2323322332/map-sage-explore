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
import { useTranslation } from "@/hooks/useTranslation";

interface SettingsDialogProps {
  language: string;
  onLanguageChange: (language: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}

const SettingsDialog = ({ language, onLanguageChange, mapStyle, onMapStyleChange }: SettingsDialogProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation(language);

  const languages = [
    { code: "en", name: "English" },
    { code: "kk", name: "Қазақша" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="shadow-lg h-12 w-12">
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[10000] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("settings")}
          </DialogTitle>
          <DialogDescription>{t("customize")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-6 w-6 text-primary" /> : <Sun className="h-6 w-6 text-primary" />}
              <Label htmlFor="theme-toggle" className="text-lg font-medium cursor-pointer">
                {t("dark_mode")}
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="scale-125"
            />
          </div>

          {/* Map Style Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Map className="h-6 w-6 text-primary" />
              <Label className="text-lg font-medium">{t("map_style")}</Label>
            </div>
            <RadioGroup value={mapStyle} onValueChange={onMapStyleChange}>
              <div className="flex items-center space-x-3 py-2">
                <RadioGroupItem value="satellite" id="satellite" className="h-5 w-5" />
                <Label htmlFor="satellite" className="cursor-pointer text-base">
                  {t("satellite")}
                </Label>
              </div>
              <div className="flex items-center space-x-3 py-2">
                <RadioGroupItem value="political" id="political" className="h-5 w-5" />
                <Label htmlFor="political" className="cursor-pointer text-base">
                  {t("political")}
                </Label>
              </div>
              <div className="flex items-center space-x-3 py-2">
                <RadioGroupItem value="topographical" id="topographical" className="h-5 w-5" />
                <Label htmlFor="topographical" className="cursor-pointer text-base">
                  {t("topographical")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <Label className="text-lg font-medium">{t("language")}</Label>
            </div>
            <RadioGroup value={language} onValueChange={onLanguageChange}>
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-3 py-2">
                  <RadioGroupItem value={lang.name} id={lang.code} className="h-5 w-5" />
                  <Label htmlFor={lang.code} className="cursor-pointer text-base">
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
