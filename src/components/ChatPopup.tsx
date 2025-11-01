import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Mic, Image as ImageIcon, Info } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface ChatPopupProps {
  location: {
    id: string;
    name: string;
    position: [number, number];
    description: string;
  };
  onClose: () => void;
  language: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatPopup = ({ location, onClose, language }: ChatPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to ${location.name}! ${location.description}. I'm your AI guide. Ask me anything about this location's history, culture, or significance.`,
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response about ${location.name}. In the full version, this would connect to an AI service to provide detailed historical and cultural insights.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput('');
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
              <h3 className="text-xl font-bold text-foreground">{location.name}</h3>
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
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this location..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPopup;
