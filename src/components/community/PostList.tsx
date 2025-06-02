
// src/components/community/PostList.tsx
"use client";

import { db } from "@/lib/firebase"; // Mock
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "./PostCard";
import { Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostListProps {
  communityId: string;
  initialPosts?: Post[]; // Optional prop for pre-loaded posts
}

export default function PostList({ communityId, initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts); // Only load if initialPosts are not provided

  useEffect(() => {
    // If initialPosts are provided, we might not need to fetch again,
    // or we can fetch to update/sync. For now, if initialPosts exist, we skip fetching.
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setIsLoading(false);
      return;
    }

    // Fetch posts only if initialPosts are not provided or empty
    if (communityId) {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const allPosts = (await db.collection('posts').where().get()).docs.map((doc:any) => ({id: doc.id, ...doc.data()}) as Post);
          const communityPosts = allPosts.filter(post => post.communityId === communityId)
                                        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPosts(communityPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [communityId, initialPosts]); // Re-run if communityId or initialPosts change

  // Update posts if initialPosts prop changes from parent (e.g., after creating a new post)
   useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [initialPosts]);


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
