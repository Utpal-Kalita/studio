// src/app/mood-tracking/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import MoodSelector from "@/components/mood/MoodSelector";
import JournalInput from "@/components/mood/JournalInput";
import MoodCalendarView from "@/components/mood/MoodCalendarView"; // Will be simplified for now
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase"; // Using mock
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import type { MoodEntry } from "@/components/mood/MoodCalendarView"; // Ensure this type is defined

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
      // Fetch mood history (mocked)
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          // In a real app, this would be a Firestore query
          // const querySnapshot = await db.collection('moodEntries').where('userId', '==', user.uid).orderBy('date', 'desc').limit(30).get();
          // const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MoodEntry));
          // For mock:
          const allEntries = (await db.collection('moodEntries').where().get()).docs.map((doc: any) => ({ id: doc.id, ...doc.data()}) as MoodEntry);
          const userEntries = allEntries.filter(entry => entry.userId === user.uid)
                                       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                       .slice(0,30);
          setMoodHistory(userEntries);
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
    const newEntry: Omit<MoodEntry, 'id'> = {
      userId: user.uid,
      mood: selectedMood,
      journal: journalText,
      date: new Date().toISOString(),
    };

    try {
      // In a real app, this adds to Firestore
      const docRef = await db.collection('moodEntries').add(newEntry);
      setMoodHistory(prev => [{...newEntry, id: docRef.id } as MoodEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Mood Saved", description: "Your mood entry has been recorded." });
      setSelectedMood(null); // Reset form
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
