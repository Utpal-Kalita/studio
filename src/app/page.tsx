
// src/app/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { CheckCircle, Users, MessageCircle, TrendingUp, BookOpen, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/20 to-secondary/40">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Logo iconSize={32} textSize="text-3xl" />
        <nav className="space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center py-20 sm:py-28">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8">
            Welcome to <span className="bg-gradient-to-r from-primary via-accent to-primary/80 bg-clip-text text-transparent">WellVerse</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/75 max-w-2xl mx-auto mb-12">
            Your companion for mental wellness. Find support, track your mood, and discover resources to help you on your journey.
          </p>
          <Button 
            size="lg" 
            asChild 
            className="shadow-lg hover:shadow-primary/30 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </section>

        <section className="py-20 sm:py-28">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl sm:text-5xl font-semibold text-foreground">Features to Support You</h2>
            <p className="text-md sm:text-lg text-foreground/70 mt-3 max-w-xl mx-auto">Explore how WellVerse can help you navigate your mental wellness journey with ease and clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Community Support", description: "Connect with others in themed support groups. Share experiences and find understanding." },
              { icon: MessageCircle, title: "AI Companion", description: "Chat with an empathetic AI designed to listen and support you without judgment." },
              { icon: TrendingUp, title: "Mood Tracking", description: "Log your daily mood and journal entries to understand your emotional patterns over time." },
              { icon: BookOpen, title: "Resource Library", description: "Access a curated collection of articles, exercises, and videos for self-help." },
              { icon: CheckCircle, title: "Safe & Secure", description: "Your privacy is important. We provide a secure platform for your wellness journey." },
               { icon: ShieldAlert, title: "Addiction Support", description: "Dedicated spaces and resources for addiction recovery and digital detox." },
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
              >
                <CardHeader className="p-6">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5 mx-auto ring-2 ring-primary/20">
                    <feature.icon size={32} />
                  </div>
                  <CardTitle className="text-center font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-center text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="py-20 text-center">
          <Image 
            src="https://placehold.co/800x450.png" 
            alt="WellVerse app interface illustration or calming wellness visual" 
            width={800} 
            height={450} 
            className="mx-auto rounded-lg shadow-xl"
            data-ai-hint="app interface wellness" 
          />
        </section>

      </main>

      <footer className="py-8 text-center border-t border-border/50 mt-12">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} WellVerse. Remember, this is a support tool, not a clinical product.
        </p>
      </footer>
    </div>
  );
}
