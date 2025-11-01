import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Mic, Image as ImageIcon, Info } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  role: 'user' | 'assistant';
  content: string;
}

const ChatPopup = ({ location, coordinates, onClose, language }: ChatPopupProps) => {
  const { toast } = useToast();
  const [countryName, setCountryName] = useState<string>('');
  
  useEffect(() => {
    if (coordinates) {
      // Reverse geocode to get country name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&zoom=3`)
        .then(res => res.json())
        .then(data => {
          if (data.address?.country) {
            setCountryName(data.address.country);
          }
        })
        .catch(err => console.error('Error fetching country name:', err));
    }
  }, [coordinates]);
  
  const getInitialMessage = () => {
    if (coordinates) {
      const locationText = countryName 
        ? `${countryName} [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`
        : `coordinates [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`;
      return `I'm your AI guide for ${locationText}. Ask me anything about this location!`;
    }
    return `Welcome to ${location?.name}! ${location?.description}. I'm your AI guide. Ask me anything about this location's history, culture, or significance.`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update initial message when country name is fetched
  useEffect(() => {
    if (countryName && coordinates) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getInitialMessage(),
      }]);
    }
  }, [countryName]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          locationName: location?.name,
          coordinates: coordinates
        }
      });

      if (error) throw error;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8 bg-background/80 backdrop-blur-md animate-in fade-in-0 duration-300">
      <Card className="relative w-full max-w-3xl h-[90vh] max-h-[700px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border-2 overflow-hidden">
        {/* Header with enhanced gradient */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg ring-2 ring-background">
                <div className="text-3xl animate-pulse">🏛️</div>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {coordinates 
                  ? (countryName || 'Loading location...')
                  : location?.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {coordinates 
                  ? `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`
                  : 'AI Guide Active'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/20 hover:text-destructive transition-all hover:rotate-90 duration-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages with improved spacing */}
        <ScrollArea className="flex-1 h-[calc(90vh-280px)] max-h-[420px] p-6 bg-gradient-to-b from-muted/20 to-transparent">
          <div className="space-y-5">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-md transition-all hover:shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-card-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in-0 duration-300">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons with better layout */}
        <div className="grid grid-cols-3 gap-2 px-6 py-4 border-t border-border/50 bg-muted/30">
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Info</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Photo</span>
          </Button>
        </div>

        {/* Enhanced Input Area */}
        <div className="flex items-center gap-3 p-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about history, culture, or significance..."
            className="flex-1 border-2 focus:border-primary transition-all bg-background shadow-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="shrink-0 h-10 w-10 shadow-lg hover:shadow-xl transition-all hover:scale-105" 
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
