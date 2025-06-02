// src/components/mood/MoodCalendarView.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { Smile, Meh, Frown, Laugh, Angry, AlertCircle, Info } from "lucide-react"; // Example icons

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  journal?: string;
  date: string; // ISO string date
}

interface MoodCalendarViewProps {
  moodHistory: MoodEntry[];
}

const moodVisuals: { [key: string]: { icon: React.ElementType; color: string } } = {
  "Happy": { icon: Laugh, color: "text-yellow-500" },
  "Okay": { icon: Smile, color: "text-green-500" },
  "Meh": { icon: Meh, color: "text-blue-500" },
  "Sad": { icon: Frown, color: "text-indigo-500" },
  "Anxious": { icon: AlertCircle, color: "text-purple-500" },
  "Angry": { icon: Angry, color: "text-red-500" },
  "Default": { icon: Info, color: "text-muted-foreground" }
};

export default function MoodCalendarView({ moodHistory }: MoodCalendarViewProps) {
  if (!moodHistory || moodHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No mood entries yet.</p>
        <p className="text-sm text-muted-foreground">Start tracking your mood to see your journey here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4 bg-background/30">
      <div className="space-y-4">
        {moodHistory.map((entry) => {
          const visual = moodVisuals[entry.mood] || moodVisuals["Default"];
          const IconComponent = visual.icon;
          return (
            <Card key={entry.id} className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <IconComponent size={24} className={visual.color} />
                    <CardTitle className={`text-xl font-semibold ${visual.color}`}>{entry.mood}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {format(parseISO(entry.date), "MMM d, yyyy - h:mm a")}
                  </Badge>
                </div>
              </CardHeader>
              {entry.journal && (
                <CardContent>
                  <CardDescription className="text-sm text-foreground/80 whitespace-pre-wrap">{entry.journal}</CardDescription>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
