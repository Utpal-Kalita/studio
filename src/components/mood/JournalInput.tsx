// src/components/mood/JournalInput.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JournalInputProps {
  journalText: string;
  onJournalChange: (text: string) => void;
}

export default function JournalInput({ journalText, onJournalChange }: JournalInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="journalEntry" className="text-lg font-medium text-foreground">Journal (Optional)</Label>
      <Textarea
        id="journalEntry"
        value={journalText}
        onChange={(e) => onJournalChange(e.target.value)}
        placeholder="Write about your day, feelings, or anything on your mind..."
        rows={5}
        className="bg-background/50 focus:bg-background transition-colors"
      />
      <p className="text-xs text-muted-foreground">
        Your journal entries are private and associated with your mood log.
      </p>
    </div>
  );
}
