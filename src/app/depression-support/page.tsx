// src/app/depression-support/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import PostList from "@/components/community/PostList";
import ResourceCard from "@/components/resources/ResourceCard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader2, CloudRain, Users, BookOpen, Edit3, ShieldAlert } from "lucide-react";
import type { Resource } from "@/components/resources/ResourceCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const DEPRESSION_COMMUNITY_ID = "depression";

export default function DepressionSupportPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  useEffect(() => {
    const fetchDepressionResources = async () => {
      setIsLoadingResources(true);
      try {
        const allResources = (await db.collection('resources').where().get()).docs.map((doc: any) => ({ id: doc.id, ...doc.data() }) as Resource);
        const depressionRelatedTopics = ['depression', 'mood', 'sadness', 'low mood', 'well-being'];
        const fetchedResources = allResources.filter(res =>
          depressionRelatedTopics.some(topic => res.topic.toLowerCase().includes(topic))
        );
        setResources(fetchedResources);
      } catch (error) {
        console.error("Error fetching depression resources:", error);
      } finally {
        setIsLoadingResources(false);
      }
    };
    fetchDepressionResources();
  }, []);

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          <section className="relative bg-card p-6 sm:p-10 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image src="https://placehold.co/1200x300.png" data-ai-hint="hope comfort" alt="Abstract background" layout="fill" objectFit="cover" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <CloudRain className="h-10 w-10 text-primary mr-3" />
                <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-foreground">Depression &amp; Low Mood Support</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                A supportive space for understanding and managing depression and low mood. You're not alone in this.
              </p>
            </div>
          </section>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <CardTitle className="font-headline text-2xl">Support Community</CardTitle>
              </div>
              <CardDescription>Share your journey, find compassion, and connect with others navigating similar feelings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full sm:w-auto mb-6">
                <Edit3 className="mr-2 h-4 w-4" /> Create New Post (Coming Soon)
              </Button>
              <PostList communityId={DEPRESSION_COMMUNITY_ID} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-primary" />
                <CardTitle className="font-headline text-2xl">Helpful Resources</CardTitle>
              </div>
              <CardDescription>Discover articles, self-help tools, and insights for managing depression and improving well-being.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingResources ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No specific resources found for depression support. General resources are available in the main library.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-destructive/5 text-destructive-foreground shadow-lg">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2"><ShieldAlert className="h-5 w-5"/>Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                WellVerse is a support tool and not a replacement for professional medical advice or emergency services.
                If you are in crisis or need immediate help, please contact emergency services or a qualified healthcare professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
