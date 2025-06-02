// src/components/chat/ChatInterface.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { generateEmpatheticResponse } from '@/ai/flows/generate-empathetic-response'; // GenAI Flow
import { useAuth } from '@/hooks/useAuth'; // To get user avatar/initials

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  avatar?: string;
  initials?: string;
}

export default function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const userAvatar = user?.photoURL || undefined;
  const userInitials = getInitials(user?.displayName);
  const aiAvatar = "https://placehold.co/40x40.png?text=AI"; // Placeholder AI avatar


  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      avatar: userAvatar,
      initials: userInitials,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateEmpatheticResponse({ userInput: newUserMessage.text });
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        sender: 'ai',
        avatar: aiAvatar,
        initials: 'AI',
      };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a little trouble responding right now. Please try again in a moment.",
        sender: 'ai',
        avatar: aiAvatar,
        initials: 'AI',
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                 <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={msg.avatar} data-ai-hint="robot avatar" />
                    <AvatarFallback>{msg.initials}</AvatarFallback>
                  </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 shadow-md text-sm sm:text-base
                  ${msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-card text-card-foreground border border-border rounded-bl-none'
                  }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={msg.avatar} data-ai-hint="person avatar" />
                    <AvatarFallback>{msg.initials}</AvatarFallback>
                  </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="h-8 w-8 self-start">
                <AvatarImage src={aiAvatar} data-ai-hint="robot avatar"/>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-card text-card-foreground border border-border rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-3 sm:p-4 bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-background/50 focus:bg-background transition-colors"
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} aria-label="Send message">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
