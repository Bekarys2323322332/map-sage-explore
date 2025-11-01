import { useState } from 'react';
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
  
  const getInitialMessage = () => {
    if (coordinates) {
      return `I'm your AI guide for the coordinates [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]. Ask me anything about this location!`;
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 bg-foreground/20 backdrop-blur-sm">
      <Card className="relative w-full max-w-2xl h-[600px] shadow-[var(--shadow-card)] animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-primary/20 flex items-center justify-center">
              <div className="text-2xl">🏛️</div>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {coordinates 
                  ? `Location [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`
                  : location?.name}
              </h3>
              <p className="text-sm text-muted-foreground">AI Cultural Guide</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[380px] p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-2 px-6 py-3 border-t border-b border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <Info className="mr-2 h-4 w-4" />
            More Info
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Mic className="mr-2 h-4 w-4" />
            Audio Guide
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Photo
          </Button>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-6">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about this location..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="icon" className="shrink-0" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
