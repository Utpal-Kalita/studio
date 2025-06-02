
// src/components/community/PostList.tsx
"use client";

import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "./PostCard";
import { Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, query, where, orderBy, getDocs, type Timestamp } from "firebase/firestore";

interface PostListProps {
  communityId: string;
  initialPosts?: Post[];
}

export default function PostList({ communityId, initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      // Ensure dates are ISO strings if they might be Timestamps from initial props
      const formattedInitialPosts = initialPosts.map(post => ({
        ...post,
        createdAt: typeof post.createdAt === 'string' ? post.createdAt : (post.createdAt as unknown as Timestamp).toDate().toISOString(),
      })).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(formattedInitialPosts);
      setIsLoading(false);
      return;
    }

    if (communityId && !initialPosts) { // Only fetch if no initialPosts
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const postsCol = collection(db, "posts");
          const q = query(postsCol, where("communityId", "==", communityId), orderBy("createdAt", "desc"));
          const postsSnapshot = await getDocs(q);
          const communityPosts = postsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
            } as Post;
          });
          setPosts(communityPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
          // Optionally set an error state to display to the user
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  }, [communityId, initialPosts]);

   useEffect(() => {
    if (initialPosts) {
      const formattedInitialPosts = initialPosts.map(post => ({
        ...post,
        createdAt: typeof post.createdAt === 'string' ? post.createdAt : (post.createdAt as unknown as Timestamp).toDate().toISOString(),
      })).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(formattedInitialPosts);
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
          <p className="text-sm text-muted-foreground mt-2">Ensure your Firestore 'posts' collection has entries for this community or that your security rules allow access.</p>
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
