
// src/components/community/CreatePostForm.tsx
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Post } from './PostCard';
import { db } from '@/lib/firebase'; // Using mock db
// No serverTimestamp from firestore needed for mock

const postSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title must be 100 characters or less." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }).max(2000, { message: "Content must be 2000 characters or less." }),
});

type PostFormInputs = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  onPostCreated: (newPost: Post) => void;
}

export default function CreatePostForm({ isOpen, onOpenChange, communityId, onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const postCreationTime = new Date(); 

    const newPostDataForMock = {
      communityId,
      userId: user.uid,
      userName: user.displayName || "Anonymous User",
      userAvatar: user.photoURL || `https://placehold.co/40x40.png?text=${(user.displayName || "A").charAt(0)}`,
      title: data.title,
      content: data.content,
      createdAt: postCreationTime.toISOString(), // Store as ISO string for mock
      reactions: 0,
      commentsCount: 0,
    };

    try {
      // Using mock db's addDoc
      const docRef = await db.collection('posts').addDoc(newPostDataForMock);
      
      const createdPostForUI: Post = {
        ...newPostDataForMock,
        id: docRef.id, // id from mock addDoc response
      };
      
      onPostCreated(createdPostForUI);
      toast({ title: "Post Created!", description: "Your post has been successfully shared." });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ title: "Error", description: "Could not create post. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) reset(); 
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PlusCircle className="mr-2 h-6 w-6 text-primary" />
            Create a New Post
          </DialogTitle>
          <DialogDescription>
            Share your thoughts, experiences, or questions with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter a descriptive title"
              className={errors.title ? 'border-destructive' : ''}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="What's on your mind?"
              rows={6}
              className={errors.content ? 'border-destructive' : ''}
              aria-invalid={errors.content ? "true" : "false"}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
