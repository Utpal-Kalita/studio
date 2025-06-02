
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
import type { Post } from './PostCard'; // Assuming Post type is exported

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

    const newPostData = {
      communityId,
      userId: user.uid,
      userName: user.displayName || "Anonymous User",
      userAvatar: user.photoURL || undefined,
      title: data.title,
      content: data.content,
      // id, createdAt, reactions, commentsCount will be handled by the mock DB or backend
    };

    try {
      // In a real app, this would be an API call. db.collection('posts').add is from our mock.
      // The mock firebase.ts needs to handle generating id, createdAt, etc.
      const { db } = await import('@/lib/firebase'); // Dynamically import to ensure client-side only
      const docRef = await db.collection('posts').add(newPostData);

      // Construct the full post object as expected by onPostCreated
      // The mock 'add' should ideally return the full post or at least the ID and timestamp
      const createdPost: Post = {
        ...newPostData,
        id: docRef.id, // Assuming mock add returns an id
        createdAt: new Date().toISOString(), // Mocking createdAt
        reactions: 0,
        commentsCount: 0,
      };
      
      onPostCreated(createdPost);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <Button type="button" variant="outline" onClick={() => reset()}>
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
