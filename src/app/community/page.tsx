
// src/app/community/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import CommunityCard from "@/components/community/CommunityCard";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";
import type { Community } from "@/components/community/CommunityCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image"; // Make sure Image is imported

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        // Using mock db
        const communitySnapshot = await db.collection('communities').get();
        const fetchedCommunities = communitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Community));
        setCommunities(fetchedCommunities);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          <section className="relative bg-card p-6 sm:p-10 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <Image
                  src="https://placehold.co/1200x300.png"
                  data-ai-hint="support group"
                  alt="Abstract background"
                  layout="fill"
                  objectFit="cover"
                />
            </div>
            <div className="relative z-10"> {/* Ensures text content is on top */}
                <div className="flex items-center mb-4">
                    <Users className="h-10 w-10 text-primary mr-3" />
                    <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-foreground">Community Hub</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-6">
                Find your space. Connect with others who understand. Share, listen, and grow together.
                </p>
                <Input
                type="search"
                placeholder="Search communities (e.g., Anxiety, Self-Growth)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-lg bg-background/70 focus:bg-background"
                />
            </div>
          </section>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredCommunities.length > 0 ? (
            <ScrollArea className="h-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">No communities found matching your search.</p>
               <p className="text-sm text-muted-foreground">Check the mock data in src/lib/firebase.ts if you expect to see communities.</p>
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}
