// src/components/profile/ProfileForm.tsx
"use client";

import type { User } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UploadCloud } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50, "Display name too long"),
  bio: z.string().max(160, "Bio can be up to 160 characters").optional(),
  // photoURL: z.string().url("Invalid URL for photo").optional(), // For URL input, file upload is more complex
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  currentUser: User;
}

export default function ProfileForm({ currentUser }: ProfileFormProps) {
  const { updateUserProfile, loading } = useAuth();
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentUser.displayName || '',
      bio: currentUser.bio || '',
      // photoURL: currentUser.photoURL || '',
    }
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    // For photoURL, if implementing direct URL input:
    // await updateUserProfile({ displayName: data.displayName, bio: data.bio, photoURL: data.photoURL });
    // For now, photoURL is not directly editable via this form text input.
    await updateUserProfile({ displayName: data.displayName, bio: data.bio });
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
          <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} data-ai-hint="person avatar" />
          <AvatarFallback className="text-3xl">{getInitials(currentUser.displayName)}</AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline" size="sm" disabled> {/* File upload not implemented */}
          <UploadCloud className="mr-2 h-4 w-4" />
          Change Picture (Soon)
        </Button>
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={currentUser.email || ''} disabled className="bg-muted/50 cursor-not-allowed" />
        <p className="text-xs text-muted-foreground">Email address cannot be changed here.</p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="displayName">Display Name</Label>
        <Input id="displayName" {...register("displayName")} aria-invalid={errors.displayName ? "true" : "false"} />
        {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea id="bio" {...register("bio")} placeholder="Tell us a little about yourself..." rows={3} aria-invalid={errors.bio ? "true" : "false"} />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
      </div>
      
      {/* 
      If allowing direct photo URL update:
      <div className="space-y-1">
        <Label htmlFor="photoURL">Photo URL</Label>
        <Input id="photoURL" {...register("photoURL")} placeholder="https://example.com/image.png" aria-invalid={errors.photoURL ? "true" : "false"} />
        {errors.photoURL && <p className="text-sm text-destructive">{errors.photoURL.message}</p>}
      </div>
      */}

      <Button type="submit" className="w-full" disabled={loading || !isDirty}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
