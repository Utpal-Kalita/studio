
// src/components/community/PostCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquareText } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';

export interface Post {
  id: string;
  communityId: string;
  userId: string;
  userName: string;
  userAvatar?: string; // Optional
  title: string;
  content: string;
  createdAt: string; // ISO string date
  reactions: number;
  commentsCount: number; // Added comments count
  // comments: Comment[]; // Future feature
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="shadow-lg bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userAvatar || `https://placehold.co/40x40.png?text=${getInitials(post.userName)}`} alt={post.userName} data-ai-hint="avatar person" />
            <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{post.userName}</p>
            <p className="text-xs text-muted-foreground">
              Posted {formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <CardTitle className="font-headline text-xl text-primary">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 whitespace-pre-line line-clamp-4">{post.content}</p>
        {/* Could add a "Read More" if content is long */}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" disabled>
            <ThumbsUp className="mr-2 h-4 w-4" /> {post.reactions} Likes (Soon)
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" disabled>
            <MessageSquareText className="mr-2 h-4 w-4" /> {post.commentsCount} Comments (Soon)
          </Button>
        </div>
        {/* <Button variant="link" size="sm" className="text-primary">Read More</Button> */}
      </CardFooter>
    </Card>
  );
}
