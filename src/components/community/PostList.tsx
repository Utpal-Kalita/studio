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
}

export default function PostList({ communityId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (communityId) {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          // In a real app, this would be a Firestore query with where('communityId', '==', communityId)
          // const querySnapshot = await db.collection('posts').where('communityId', '==', communityId).orderBy('createdAt', 'desc').get();
          // const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
          
          // Mock implementation:
          const allPosts = (await db.collection('posts').where().get()).docs.map((doc:any) => ({id: doc.id, ...doc.data()}) as Post);
          const communityPosts = allPosts.filter(post => post.communityId === communityId)
                                        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPosts(communityPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
          // Handle error
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [communityId]);

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
