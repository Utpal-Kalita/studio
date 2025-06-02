
// src/app/mood-tracking/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import MoodSelector from "@/components/mood/MoodSelector";
import JournalInput from "@/components/mood/JournalInput";
import MoodCalendarView from "@/components/mood/MoodCalendarView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import type { MoodEntry } from "@/components/mood/MoodCalendarView";
// Using mock db, so direct firestore imports (Timestamp, collection, addDoc, etc.) are not needed here.
// Mock db handles these concepts internally.

export default function MoodTrackingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          // Using mock db
          const moodEntriesQuery = db.collection('moodEntries')
            .where('userId', '==', user.uid)
            .orderBy('date', 'desc') // Mock orderBy might be simplified
            .limit(30); // Mock limit might be simplified
          
          const querySnapshot = await moodEntriesQuery.get();

          const history = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
              id: doc.id, 
              ...data,
              // Mock data already provides date as ISO string or JS Date, ensure consistency
              date: typeof data.date === 'string' ? data.date : new Date(data.date).toISOString() 
            } as MoodEntry;
          });
          setMoodHistory(history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())); // Ensure sort
        } catch (error) {
          console.error("Error fetching mood history:", error);
          toast({ title: "Error", description: "Could not load mood history.", variant: "destructive" });
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [user, toast]);

  const handleSaveMood = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (!selectedMood) {
      toast({ title: "Hold on!", description: "Please select a mood first.", variant: "default" });
      return;
    }

    setIsSaving(true);
    const newEntryData = { // Omit id, mock addDoc will generate it
      userId: user.uid,
      mood: selectedMood,
      journal: journalText,
      date: new Date().toISOString(), // Store as ISO string for mock
    };

    try {
      // Using mock db's addDoc
      const docRef = await db.collection('moodEntries').addDoc(newEntryData);
      
      const addedEntry: MoodEntry = {
        id: docRef.id, // id from mock addDoc
        ...newEntryData,
      };
      setMoodHistory(prev => [addedEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Mood Saved", description: "Your mood entry has been recorded." });
      setSelectedMood(null);
      setJournalText("");
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({ title: "Error", description: "Could not save mood entry.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">How are you feeling today?</CardTitle>
              <CardDescription>Select your current mood and optionally add a journal entry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
              <JournalInput journalText={journalText} onJournalChange={setJournalText} />
              <Button onClick={handleSaveMood} disabled={isSaving || !selectedMood} className="w-full sm:w-auto">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Mood Entry
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Mood Journey</CardTitle>
              <CardDescription>Review your mood patterns and reflections over time.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <MoodCalendarView moodHistory={moodHistory} />
              )}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
