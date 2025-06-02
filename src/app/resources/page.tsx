
// src/app/resources/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import ResourceCard from "@/components/resources/ResourceCard";
import ResourceFilter, { type FilterState } from "@/components/resources/ResourceFilter";
import { db } from "@/lib/firebase"; 
import { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import type { Resource } from "@/components/resources/ResourceCard";
import Image from "next/image";
// Removed firestore imports, db is now mock

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ searchTerm: "", topic: "all", type: "all" });

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        // Using mock db
        const resourceSnapshot = await db.collection('resources').get();
        const fetchedResources = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
        setResources(fetchedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const topics = ["all", ...new Set(resources.map(r => r.topic).filter(Boolean))];
  const types = ["all", ...new Set(resources.map(r => r.type).filter(Boolean))];


  const filteredResources = resources.filter(resource => {
    const searchMatch = resource.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                        (resource.description && resource.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    const topicMatch = filters.topic === "all" || resource.topic === filters.topic;
    const typeMatch = filters.type === "all" || resource.type === filters.type;
    return searchMatch && topicMatch && typeMatch;
  });

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          <section className="relative bg-card p-6 sm:p-10 rounded-xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <Image src="https://placehold.co/1200x300.png" data-ai-hint="library books" alt="Abstract background" layout="fill" objectFit="cover" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center mb-4">
                    <BookOpen className="h-10 w-10 text-primary mr-3" />
                    <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-foreground">Resource Library</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-6">
                Explore a curated collection of articles, exercises, and videos to support your mental wellness journey.
                </p>
                <ResourceFilter 
                  topics={topics} 
                  types={types} 
                  currentFilters={filters} 
                  onFilterChange={setFilters} 
                />
            </div>
          </section>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 bg-card rounded-xl shadow">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-xl font-semibold text-foreground">No Resources Found</p>
              <p className="text-muted-foreground mt-2">
                We couldn&apos;t find any resources matching your current filters. Try adjusting your search or check the mock data.
              </p>
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}
