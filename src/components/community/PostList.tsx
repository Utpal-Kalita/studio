
// src/components/community/PostList.tsx
"use client";

import { db } from "@/lib/firebase"; // Using mock db
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "./PostCard";
import { Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed specific firestore imports like Timestamp, collection, query, where, orderBy, getDocs

interface PostListProps {
  communityId: string;
  initialPosts?: Post[]; // This can be used for optimistic updates from parent
}

export default function PostList({ communityId, initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts || initialPosts.length === 0);

  useEffect(() => {
    // If initialPosts are provided (e.g., from parent after creating a new post), use them.
    if (initialPosts && initialPosts.length > 0) {
       const formattedInitialPosts = initialPosts.map(post => ({
        ...post,
        createdAt: typeof post.createdAt === 'string' ? post.createdAt : new Date(post.createdAt).toISOString(),
      })).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(formattedInitialPosts);
      setIsLoading(false); // Assuming if initialPosts are there, loading is done for them
      return; // Don't fetch if initialPosts are provided and non-empty
    }

    // Otherwise, fetch from mock db
    if (communityId) {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          // Using mock db's where, orderBy, and get
          const postsQuery = db.collection("posts")
            .where("communityId", "==", communityId)
            .orderBy("createdAt", "desc"); // Mock orderBy logic will apply
            
          const postsSnapshot = await postsQuery.get();
          const communityPosts = postsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Ensure createdAt is a string for consistency with PostCard
              createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt).toISOString(),
            } as Post;
          });
           setPosts(communityPosts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [communityId, initialPosts]); // Re-run if communityId changes or initialPosts are updated

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="text-center py-10 shadow">
        <CardHeader>
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl">No Posts Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Be the first to share something in this community!</p>
          <p className="text-sm text-muted-foreground mt-2">Check the mock data in src/lib/firebase.ts if you expect posts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
