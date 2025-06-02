// src/app/chat/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import ChatInterface from "@/components/chat/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ChatPage() {
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex flex-col h-[calc(100vh-var(--header-height)-var(--footer-height)-4rem)]"> {/* Adjust height based on your AppShell header/footer */}
          <Card className="flex-grow flex flex-col shadow-xl overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-2xl">AI Companion</CardTitle>
                  <CardDescription>Your empathetic friend, here to listen.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
               <div className="p-4 text-center bg-secondary/30 border-b">
                  <Image src="https://placehold.co/150x150.png" alt="Friendly AI avatar" width={80} height={80} className="mx-auto rounded-full mb-2 shadow-md" data-ai-hint="friendly robot" />
                  <p className="text-sm text-muted-foreground">
                    This is a supportive chat space. The AI is here to listen, not to give medical advice.
                  </p>
               </div>
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

// Define CSS variables for header/footer height if not already globally available
// e.g., in globals.css:
// :root {
//   --header-height: 60px;
//   --footer-height: 50px;
// }
// This is a conceptual comment as direct CSS modification here is not standard.
// The h-[calc(...)] will work if these vars are set or if you use fixed pixel values.
// For simplicity, ensure AppShell's main content area allows for this height.
