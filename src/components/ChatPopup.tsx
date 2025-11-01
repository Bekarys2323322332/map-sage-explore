import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Mic, Image as ImageIcon, Info } from "lucide-react";
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
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ASSISTANT_BASE_URL = "http://localhost:8010";

function mapCountryNameToCode(name?: string): string {
  if (!name) return "kz";
  const n = name.toLowerCase();
  if (n.includes("kazak")) return "kz";
  if (n.includes("uzbek")) return "uz";
  if (n.includes("kyrgyz")) return "kg";
  if (n.includes("tajik")) return "tj";
  if (n.includes("turkmen")) return "tm";
  return "kz";
}

const ChatPopup = ({ location, coordinates, onClose, language }: ChatPopupProps) => {
  const { toast } = useToast();

  const [countryName, setCountryName] = useState<string>("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // 👈 ПУСТО, без локального "I'm your AI guide"
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1) тянем название страны
  useEffect(() => {
    if (!coordinates) return;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&zoom=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.address?.country) {
          setCountryName(data.address.country);
        }
      })
      .catch((err) => {
        console.error("Error fetching country name:", err);
      });
  }, [coordinates]);

  // 2) СРАЗУ после появления координат → запрос к ассистенту
  useEffect(() => {
    const start = async () => {
      if (!coordinates) return;

      const [lat, lon] = coordinates;
      const countryCode = mapCountryNameToCode(countryName);

      setIsLoading(true);
      try {
        console.log("→ calling assistant/start", {
          country: countryCode,
          lat,
          lon,
          location_name: location?.name ?? null,
        });

        const res = await fetch(`${ASSISTANT_BASE_URL}/assistant/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: countryCode,
            lat,
            lon,
            location_name: location?.name ?? null,
          }),
        });

        const data = await res.json();
        console.log("← assistant/start response", data);

        if (!res.ok) {
          throw new Error(data.detail || "assistant/start failed");
        }

        setThreadId(data.thread_id);
        setMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.answer || "I found this location in the database, but there is no detailed description.",
          },
        ]);
      } catch (err: any) {
        console.error("assistant/start error", err);
        setMessages([
          {
            id: "err",
            role: "assistant",
            content: "I could not load information for this point (assistant/start failed). Check backend.",
          },
        ]);
        toast({
          title: "Backend error",
          description: err?.message || "assistant/start failed",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // вызываем, когда появились координаты
    if (coordinates) {
      start();
    } else {
      // если координат нет — просто покажем приветствие
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: location ? `Welcome to ${location.name}! ${location.description}` : "Choose a point on the map.",
        },
      ]);
    }
  }, [coordinates, countryName, location, toast]);

  // 3) отправка последующих сообщений
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!threadId) {
      toast({
        title: "Assistant not ready",
        description: "No active thread. Click on the map again.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${ASSISTANT_BASE_URL}/assistant/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();
      console.log("← assistant/continue response", data);

      if (!res.ok) {
        throw new Error(data.detail || "assistant/continue failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer || "I have no additional information.",
        },
      ]);
    } catch (err: any) {
      console.error("assistant/continue error", err);
      toast({
        title: "Error",
        description: err?.message || "assistant/continue failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-md">
      <Card className="relative w-full max-w-3xl h-[90vh] max-h-[700px] border-2 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <div className="text-3xl">🏛️</div>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{location?.name || countryName || "Selected location"}</h3>
              {coordinates && (
                <p className="text-xs text-muted-foreground">
                  {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
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
                <div className="px-4 py-3 rounded-2xl bg-card border">
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

        {/* bottom */}
        <div className="flex items-center gap-3 p-6 border-t bg-background/50">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask about this place..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
