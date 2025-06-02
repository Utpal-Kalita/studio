// src/hooks/useAuth.ts
"use client";

import type { User } from '@/lib/firebase';
import { auth, GoogleAuthProvider, db } from '@/lib/firebase'; // Using mock
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthHook {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (profileData: Partial<Pick<User, 'displayName' | 'photoURL' | 'bio'>>) => Promise<void>;
}

export function useAuth(): AuthHook {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // In a real app, you might fetch additional user data from Firestore here
        // For mock, we assume authUser contains all necessary info or it's already in mockDb.users
        let userData = authUser;
        const userDoc = await db.collection('users').doc(authUser.uid).get();
        if (userDoc.exists) {
          userData = { ...authUser, ...userDoc.data() } as User;
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: authUser } = await auth.signInWithEmailAndPassword(email, pass);
      // setUser(authUser); // Managed by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome back!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ title: "Sign In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      const { user: authUser } = await auth.createUserWithEmailAndPassword(email, pass);
      // In a real app, you'd update the profile and create a user doc in Firestore
      await auth.updateProfile(authUser, { displayName });
      await db.collection('users').doc(authUser.uid).set({ uid: authUser.uid, email, displayName, photoURL: authUser.photoURL || `https://placehold.co/100x100.png?text=${displayName.charAt(0)}`, bio: '' });
      // setUser({ ...authUser, displayName }); // Managed by onAuthStateChanged
      toast({ title: "Signed Up", description: "Welcome to WellVerse!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider(); // In real Firebase, this is `new firebase.auth.GoogleAuthProvider()`
      const { user: authUser } = await auth.signInWithPopup(provider);
      // Check if user exists in Firestore, if not, create them
      const userDoc = await db.collection('users').doc(authUser.uid).get();
      if (!userDoc.exists) {
        await db.collection('users').doc(authUser.uid).set({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL || `https://placehold.co/100x100.png?text=${authUser.displayName?.charAt(0)}`,
          bio: '',
        });
      }
      // setUser(authUser); // Managed by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({ title: "Google Sign In Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      // setUser(null); // Managed by onAuthStateChanged
      toast({ title: "Signed Out", description: "See you soon!" });
      router.push('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<Pick<User, 'displayName' | 'photoURL' | 'bio'>>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await auth.updateProfile(user, profileData); // Updates auth profile
      await db.collection('users').doc(user.uid).update(profileData); // Updates Firestore profile
      setUser(prevUser => prevUser ? { ...prevUser, ...profileData } : null);
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({ title: "Profile Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, updateUserProfile };
}
