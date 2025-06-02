// src/components/mood/MoodSelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Laugh, Angry, AlertCircle } from "lucide-react"; // Example icons
import type React from "react";

interface MoodOption {
  name: string;
  icon: React.ElementType;
  colorClasses: string; // Tailwind classes for bg/text/border
}

const moodOptions: MoodOption[] = [
  { name: "Happy", icon: Laugh, colorClasses: "bg-yellow-400/20 text-yellow-600 border-yellow-500 hover:bg-yellow-500/30" },
  { name: "Okay", icon: Smile, colorClasses: "bg-green-400/20 text-green-600 border-green-500 hover:bg-green-500/30" },
  { name: "Meh", icon: Meh, colorClasses: "bg-blue-400/20 text-blue-600 border-blue-500 hover:bg-blue-500/30" },
  { name: "Sad", icon: Frown, colorClasses: "bg-indigo-400/20 text-indigo-600 border-indigo-500 hover:bg-indigo-500/30" },
  { name: "Anxious", icon: AlertCircle, colorClasses: "bg-purple-400/20 text-purple-600 border-purple-500 hover:bg-purple-500/30"},
  { name: "Angry", icon: Angry, colorClasses: "bg-red-400/20 text-red-600 border-red-500 hover:bg-red-500/30" },
];

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-3">Select Your Mood:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {moodOptions.map((mood) => (
          <Button
            key={mood.name}
            variant={selectedMood === mood.name ? "default" : "outline"}
            className={`flex flex-col items-center justify-center h-24 p-3 transition-all duration-150 ease-in-out transform hover:scale-105
              ${selectedMood === mood.name ? `${mood.colorClasses.replace('hover:','')} shadow-lg scale-105 ring-2 ring-offset-2 ring-primary` : mood.colorClasses}
              ${selectedMood === mood.name ? 'text-primary-foreground' : ''}
            `}
            onClick={() => onSelectMood(mood.name)}
          >
            <mood.icon size={32} className="mb-1.5" />
            <span className="text-sm font-medium">{mood.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
