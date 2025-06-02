
// src/app/community/[id]/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import PostList from "@/components/community/PostList";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; 
import { useEffect, useState } from "react";
import { Loader2, MessageSquare, Edit3, ArrowLeft, Users, ShieldAlert, CloudRain, HeartHandshake, Sunrise } from "lucide-react";
import Link from "next/link";
import type { Community } from "@/components/community/CommunityCard"; 
import type { Post } from "@/components/community/PostCard";
import Image from "next/image";
import { useParams } from 'next/navigation';
import CreatePostForm from "@/components/community/CreatePostForm";
import { useToast } from "@/hooks/use-toast";
// Removed specific firestore imports, using mock db methods

const iconMap: { [key: string]: React.ElementType } = {
  ShieldAlert,
  CloudRain,
  HeartHandshake,
  Sunrise,
  Users,
  MessageSquare,
  Default: MessageSquare,
};

export default function IndividualCommunityPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]); // initialPosts will be handled by PostList for mock
  const { toast } = useToast();

  useEffect(() => {
    if (communityId) {
      const fetchCommunityData = async () => {
        setIsLoading(true);
        try {
          // Fetch community details from mock
          const communityDocRef = db.collection("communities").doc(communityId);
          const communitySnap = await communityDocRef.get();
          if (communitySnap.exists()) {
            setCommunity({ id: communitySnap.id, ...communitySnap.data() } as Community);
          } else {
            setCommunity(null);
            toast({ title: "Not Found", description: "Community data could not be loaded.", variant: "destructive" });
          }

          // Fetch initial posts - PostList will also fetch, but this can prime it or be removed if PostList handles initial load fine
          // For mock, PostList is self-sufficient, so this explicit post fetch can be simplified or removed
          // const postsQuery = db.collection("posts").where("communityId", "==", communityId).orderBy("createdAt", "desc");
          // const postsSnapshot = await postsQuery.get();
          // const communityPostsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt).toISOString() } as Post));
          // setPosts(communityPostsData);


        } catch (error) {
          console.error("Error fetching community data:", error);
          toast({ title: "Error", description: "Could not load community data.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchCommunityData();
    }
  }, [communityId, toast]);

  const handlePostCreated = (newPost: Post) => {
    // This will add to the local state, PostList might refetch or also update if prop changes
     setPosts(prevPosts => [newPost, ...prevPosts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };


  if (isLoading && !community) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  if (!community) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="text-center py-10">
            <h1 className="text-2xl font-semibold">Community Not Found</h1>
            <p className="text-muted-foreground">The community you are looking for does not exist or could not be loaded.</p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/community">Back to Communities</Link>
            </Button>
          </div>
        </AppShell>
      </AuthGuard>
    );
  }
  
  const IconComponent = community.icon && iconMap[community.icon] ? iconMap[community.icon] : iconMap.Default;
  
  const getImageHint = () => {
    if (community.icon && iconMap[community.icon]) {
      const iconName = community.icon.toLowerCase().replace(/([A-Z])/g, ' $1').trim().split(' ')[0];
      return `${iconName} banner`;
    }
    const communityNamePart = community.name.toLowerCase().split('&')[0].trim().split(' ')[0];
    return `${communityNamePart} banner`;
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" asChild>
                <Link href="/community">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back to communities</span>
                </Link>
            </Button>
          </div>

          <section className="bg-card p-6 sm:p-8 rounded-xl shadow-lg">
             <div className="flex items-start sm:items-center gap-4 mb-4 flex-col sm:flex-row">
                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                    {IconComponent && <IconComponent size={32} />}
                </div>
                <div>
                    <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-foreground">{community.name}</h1>
                    <p className="text-muted-foreground mt-1">{community.description}</p>
                </div>
            </div>
            <Image 
              src="https://placehold.co/1200x200.png"
              alt={`${community.name} banner`}
              width={1200}
              height={200}
              className="w-full h-40 object-cover rounded-md mb-6"
              data-ai-hint={getImageHint()}
            />
            <Button className="w-full sm:w-auto" onClick={() => setIsCreatePostOpen(true)}>
              <Edit3 className="mr-2 h-4 w-4" /> Create New Post
            </Button>
          </section>
          
          {/* PostList will handle its own loading and fetching from mock based on communityId */}
          {/* Pass the locally managed posts if you want optimistic updates from CreatePostForm */}
          <PostList communityId={communityId} initialPosts={posts} />
        </div>
        <CreatePostForm 
          isOpen={isCreatePostOpen} 
          onOpenChange={setIsCreatePostOpen} 
          communityId={communityId} 
          onPostCreated={handlePostCreated} 
        />
      </AppShell>
    </AuthGuard>
  );
}
