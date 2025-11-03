import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
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

const API_BASE = "https://73914f615f22.ngrok-free.app"; // наш main.py

const ChatPopup = ({ location, coordinates, onClose, language, country, derivedCountryName }: ChatPopupProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setMessages([
          {
            id: "out-of-bounds",
            role: "assistant",
            content: "This location is out of bounds. Please pick another point on the map.",
          },
        ]);
        return;
      }

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
            messages: [
              {
                role: "user",
                content: "Describe this location for a visitor.",
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
            content: "Could not load info about this point.",
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center sm:p-4 bg-background/80 backdrop-blur-md">
      <Card className="relative w-full sm:max-w-3xl h-full sm:h-[90vh] sm:max-h-[700px] border-0 sm:border-2 overflow-hidden shadow-2xl sm:rounded-lg">
        {/* header */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">🏛️</span>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl font-bold truncate">{location?.name || "Selected location"}</h3>
              {coordinates && (
                <p className="text-xs text-muted-foreground truncate">
                  {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
                  {derivedCountryName && ` · ${derivedCountryName}`}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* messages */}
        <ScrollArea className="flex-1 h-[calc(100vh-180px)] sm:h-[calc(90vh-280px)] sm:max-h-[420px] p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-sm sm:text-base ${
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
                <div className="bg-card border rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
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
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-6 border-t bg-background/50">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask about this location..."
            disabled={isLoading}
            className="text-sm sm:text-base"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
