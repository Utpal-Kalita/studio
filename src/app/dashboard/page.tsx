// src/app/dashboard/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, HeartPulse, Users, MessageCircle, BookOpen } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          <section className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
            <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-foreground mb-2">
              Welcome to WellVerse, {user?.displayName || "User"}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Your space for calm, support, and growth. How are you feeling today?
            </p>
            <Button asChild className="mt-6">
              <Link href="/mood-tracking">
                Track Your Mood <HeartPulse className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Community Hub"
                description="Connect with supportive communities."
                href="/community"
                icon={Users}
                imageHint="community people"
              />
              <DashboardCard
                title="AI Companion"
                description="Chat with your empathetic AI friend."
                href="/chat"
                icon={MessageCircle}
                imageHint="friendly robot"
              />
              <DashboardCard
                title="Resource Library"
                description="Explore helpful articles and exercises."
                href="/resources"
                icon={BookOpen}
                imageHint="books library"
              />
            </div>
          </section>
          
          <section className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Image src="https://placehold.co/300x200.png" alt="Calming nature scene" width={300} height={200} className="rounded-lg shadow-md" data-ai-hint="calm nature" />
              <div>
                <h3 className="font-headline text-2xl font-semibold text-foreground mb-3">Discover Your Path to Wellness</h3>
                <p className="text-muted-foreground mb-4">
                  WellVerse offers tools and resources to help you navigate life's challenges and cultivate a healthier mindset. 
                  Start by exploring our features or checking in with your mood.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/resources">Explore Resources <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </AppShell>
    </AuthGuard>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  imageHint: string;
}

function DashboardCard({ title, description, href, icon: Icon, imageHint }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
         <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image 
          src={`https://placehold.co/400x200.png`} 
          alt={title} 
          width={400} 
          height={200} 
          className="w-full h-32 object-cover rounded-md mb-4"
          data-ai-hint={imageHint}
        />
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button variant="ghost" asChild className="w-full justify-start text-primary hover:text-primary">
          <Link href={href}>
            Go to {title} <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
