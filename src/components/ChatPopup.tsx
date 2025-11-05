import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Landmark } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface ChatPopupProps {
  location: {
    id: string;
    name: string;
    position: [number, number];
    description: string;
  } | null;
  coordinates?: [number, number];
  onClose: () => void;
  language: string;
  country: string;
  derivedCountryName?: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const API_BASE = "https://6cd4e441f015.ngrok-free.app"; // наш main.py

const ChatPopup = ({ location, coordinates, onClose, language, country, derivedCountryName }: ChatPopupProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidLocation, setIsInvalidLocation] = useState(false);

  // 2. когда попап открылся и есть координаты — сразу запросим описание
  useEffect(() => {
    const fetchInitial = async () => {
      if (!coordinates) {
        // если точка выбрана из списка, не по карте
        if (location) {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `Welcome to ${location.name}. ${location.description}`,
            },
          ]);
        }
        return;
      }

      // Check if coordinates are out of bounds
      if (derivedCountryName === "Out of Bounds") {
        setIsInvalidLocation(true);
        setMessages([
          {
            id: "out-of-bounds",
            role: "assistant",
            content:
              language === "Қазақша"
                ? "Бұл орын шектен тыс. Картадан басқа нүктені таңдаңыз."
                : "This location is out of bounds. Please pick another point on the map.",
          },
        ]);
        return;
      }

      setIsInvalidLocation(false);

      setIsLoading(true);
      try {
        const initialPrompt =
          language === "Қазақша" ? "Бұл орынды келушілер үшін сипаттаңыз." : "Describe this location for a visitor.";

        const res = await fetch(`${API_BASE}/location-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: country,
            lat: coordinates[0],
            lon: coordinates[1],
            location_name: location?.name ?? null,
            language: language,
            messages: [
              {
                role: "user",
                content: initialPrompt,
              },
            ],
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "location-chat failed");

        setMessages([
          {
            id: "assistant-1",
            role: "assistant",
            content: data.answer,
          },
        ]);
      } catch (err: any) {
        console.error(err);
        setMessages([
          {
            id: "err",
            role: "assistant",
            content:
              language === "Қазақша" ? "Бұл жер тұралы ақпарат таба алмадым" : "Could not load info about this point.",
          },
        ]);
        toast({
          title: "Error",
          description: err?.message || "location-chat failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [coordinates, country, location, toast, language, derivedCountryName]);

  // 3. отправка последующих сообщений
  const handleSend = async () => {
    if (!input.trim() || !coordinates) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/location-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country,
          lat: coordinates[0],
          lon: coordinates[1],
          location_name: location?.name ?? null,
          language: language,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "location-chat failed");

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message || "location-chat failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <Card className="relative w-full max-w-3xl h-[90vh] max-h-[600px] border-2 overflow-hidden shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Landmark className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {location?.name || (language === "Қазақша" ? "Таңдалған орын" : "Selected location")}
              </h3>
              {coordinates && (
                <p className="text-xs text-muted-foreground">
                  {derivedCountryName &&
                    ` · ${
                      derivedCountryName === "Out of Bounds"
                        ? language === "Қазақша"
                          ? "Шектен тыс"
                          : "Out of Bounds"
                        : derivedCountryName
                    }`}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* messages */}
        <ScrollArea className="flex-1 h-[calc(90vh-280px)] max-h-[420px] p-6">
          <div className="space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="p-4 bg-card border rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">
                    {language === "Қазақша" ? "Не туралы сұрай аласыз:" : "What you can ask about:"}
                  </h4>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{language === "Қазақша" ? "Тарихи оқиғалар мен шайқастар" : "Historical events and battles"}</li>
                    <li>{language === "Қазақша" ? "Табиғи ерекшеліктер мен ландшафт" : "Natural features and landscape"}</li>
                    <li>{language === "Қазақша" ? "Минералдар мен геология" : "Minerals and geology"}</li>
                    <li>{language === "Қазақsha" ? "Мәдени орындар мен ескерткіштер" : "Cultural sites and monuments"}</li>
                    <li>{language === "Қазақsha" ? "Жергілікті аңыздар мен әңгімелер" : "Local legends and stories"}</li>
                    <li>{language === "Қазақsha" ? "Қоныстану тарихы" : "Settlement history"}</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="font-semibold mb-2 text-foreground">
                    {language === "Қазақша" ? "💡 Кеңес:" : "💡 Tip:"}
                  </p>
                  <p>
                    {language === "Қазақsha" 
                      ? "Нақты сұрақтар қойыңыз: 'Бұл жерде қандай минералдар табылады?' немесе 'Осы аймақтың тарихы қандай?'"
                      : "Ask specific questions like: 'What minerals are found here?' or 'What is the history of this area?'"}
                  </p>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* input */}
        <div className="flex flex-col gap-2 p-4 sm:p-6 border-t bg-background/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && !isInvalidLocation && handleSend()}
              placeholder={
                language === "Қазақsha"
                  ? "Сұрағыңызды жазыңыз..."
                  : "Type your question..."
              }
              disabled={isLoading || isInvalidLocation}
              className="text-sm"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim() || isInvalidLocation} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {language === "Қазақsha"
              ? "📱 Телефонда: Картадан нүкте таңдап, нақты сұрақтар қойыңыз"
              : "📱 On mobile: Select a point on the map and ask specific questions"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
