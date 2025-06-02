// src/components/chat/ChatInterface.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, User, Bot, Mic, MicOff, Volume2 } from 'lucide-react';
import { generateEmpatheticResponse } from '@/ai/flows/generate-empathetic-response';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  avatar?: string;
  initials?: string;
}

// SpeechRecognition and SpeechSynthesis types might not be globally available in all Node environments
// We declare them here to satisfy TypeScript, actual availability checked at runtime.
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance | undefined;
    speechSynthesis: SpeechSynthesis | undefined;
  }
}


export default function ChatInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setSpeechRecognitionSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    setSpeechSynthesisSupported(!!(window.SpeechSynthesisUtterance && window.speechSynthesis));
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const userAvatar = user?.photoURL || undefined;
  const userInitials = getInitials(user?.displayName);
  const aiAvatar = "https://placehold.co/40x40.png";


  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const speakText = useCallback((text: string) => {
    if (!speechSynthesisSupported || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    try {
      const utterance = new window.SpeechSynthesisUtterance(text);
      // You could add options here like:
      // utterance.voice = window.speechSynthesis.getVoices()[0]; // Select a voice
      // utterance.pitch = 1;
      // utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      toast({ title: "Speech Error", description: "Could not speak the response.", variant: "destructive"});
    }
  }, [speechSynthesisSupported, toast]);

  const processAndSendMessage = async (text: string) => {
    if (text.trim() === '' || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      avatar: userAvatar,
      initials: userInitials,
    };
    setMessages(prev => [...prev, newUserMessage]);
    if (inputValue === text) setInputValue(''); // Clear input field only if it was typed
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
      speakText(aiResponse.response);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorText = "I'm having a little trouble responding right now. Please try again in a moment.";
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'ai',
        avatar: aiAvatar,
        initials: 'AI',
      };
      setMessages(prev => [...prev, errorAiMessage]);
      speakText(errorText);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = () => {
    processAndSendMessage(inputValue);
  };


  const toggleListening = () => {
    if (!speechRecognitionSupported) {
      toast({ title: "Feature Not Supported", description: "Speech recognition is not supported by your browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) { // Should be caught by speechRecognitionSupported but as a safeguard
         toast({ title: "Error", description: "Speech recognition API not found.", variant: "destructive"});
         return;
      }
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast({ title: "Listening...", description: "Speak now.", duration: 3000});
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript); // Show transcript in input field
        processAndSendMessage(transcript); // Send transcript to AI
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        let errorMessage = "Speech recognition error.";
        if (event.error === 'no-speech') {
            errorMessage = "No speech was detected. Please try again.";
        } else if (event.error === 'audio-capture') {
            errorMessage = "No microphone was found. Ensure that a microphone is installed and that microphone access is allowed.";
        } else if (event.error === 'not-allowed') {
            errorMessage = "Microphone access was denied. Please allow access in your browser settings.";
        }
        toast({ title: "Recognition Error", description: errorMessage, variant: "destructive"});
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        toast({ title: "Recognition Error", description: "Could not start voice recognition.", variant: "destructive"});
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    // Cleanup speech recognition instance if component unmounts
    return () => {
      recognitionRef.current?.abort();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


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
          {isLoading && messages[messages.length -1]?.sender === 'user' && ( // Show loader only if user sent the last message and we are waiting for AI
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
            placeholder={isListening ? "Listening..." : "Type your message or use mic..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-background/50 focus:bg-background transition-colors"
            disabled={isLoading && !isListening}
            aria-label="Chat message input"
          />
          {speechRecognitionSupported && (
            <Button type="button" size="icon" onClick={toggleListening} disabled={isLoading && !isListening} variant={isListening ? "destructive" : "outline"} aria-label={isListening ? "Stop listening" : "Start listening"}>
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} aria-label="Send message">
            {isLoading && !isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        {!speechRecognitionSupported && (
            <p className="text-xs text-muted-foreground text-center pt-1">Voice input not supported by your browser.</p>
        )}
        {!speechSynthesisSupported && (
            <p className="text-xs text-muted-foreground text-center pt-1">Voice output not supported by your browser.</p>
        )}
      </div>
    </div>
  );
}
