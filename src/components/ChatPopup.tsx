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
  /** например: 'kz' | 'uz' | 'kg' | 'tj' | 'tm' */
  country: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const API_BASE = "https://40a587c40a6f.ngrok-free.app"; // твой FastAPI за ngrok

const ChatPopup = ({ location, coordinates, onClose, language, country }: ChatPopupProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. при первом открытии и если кликнули по карте — сразу запрос к бэку
  useEffect(() => {
    const fetchInitial = async () => {
      // если попап открыт без карты (например, из списка)
      if (!coordinates) {
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

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/location-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: country, // ⚡ берём из пропса
            lat: coordinates[0],
            lon: coordinates[1],
            location_name: location?.name ?? null,
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

    // вызов только когда есть координаты ИЛИ поменяли страну
    if (coordinates) {
      fetchInitial();
    }
  }, [coordinates, country, location, toast]);

  // 2. отправка дальнейших сообщений
  const handleSend = async () => {
    if (!input.trim()) return;

    // если вообще нет координат (например, открыли по списку) — можно просто не звать бэк
    if (!coordinates) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content: input },
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This location was opened without coordinates. Please select a point on the map.",
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/location-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country, // ⚡ снова берём из пропса
          lat: coordinates[0],
          lon: coordinates[1],
          location_name: location?.name ?? null,
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
      <Card className="relative w-full max-w-3xl h-[90vh] max-h-[700px] border-2 overflow-hidden shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-3xl">🏛️</span>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{location?.name || "Selected location"}</h3>
              {coordinates && (
                <p className="text-xs text-muted-foreground">
                  {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)} · {country.toUpperCase()}
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
        <div className="flex items-center gap-3 p-6 border-t bg-background/50">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder="Ask about history, nature, battles, minerals..."
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
