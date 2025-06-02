
// src/hooks/useAuth.ts
"use client";

import type { User } from '@/lib/firebase'; // Using our mock User type
import { auth as mockAuthService, db as mockDbService, GoogleAuthProvider as MockGoogleAuthProvider } from '@/lib/firebase'; // Using mock services
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Simulating Firebase Auth User type for consistency if needed, but User from lib/firebase is primary
// import type { User as FirebaseUser } from 'firebase/auth'; 

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
    setLoading(true);
    const unsubscribe = mockAuthService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // In mock, authUser is already our extended User type potentially.
        // If it had separate Firestore doc, we'd fetch it here.
        // For this mock, we assume authUser has all details or we fetch from mockUsers.
        const userRef = mockDbService.collection('users').doc(authUser.uid);
        const userSnap = await userRef.get(); // This uses mock get
        if (userSnap.exists()) {
          setUser({ ...authUser, ...userSnap.data() } as User);
        } else {
           setUser(authUser as User); // Fallback if not in mock 'users' collection, should be rare
        }
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
      await mockAuthService.signInWithEmailAndPassword(email, pass);
      // User state will be set by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome back!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ title: "Sign In Failed", description: error.message || "Mock sign-in failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      // createUserWithEmailAndPassword in mock already handles display name and mock user doc creation
      await mockAuthService.createUserWithEmailAndPassword(email, pass, displayName);
      toast({ title: "Signed Up", description: "Welcome to WellVerse!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: "Sign Up Failed", description: error.message || "Mock sign-up failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // The mock GoogleAuthProvider is not actually used by mockAuthService.signInWithPopup
      await mockAuthService.signInWithPopup(new MockGoogleAuthProvider());
      // User state will be set by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({ title: "Google Sign In Failed", description: error.message || "Mock Google sign-in failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await mockAuthService.signOut();
      // User state will be set by onAuthStateChanged to null
      toast({ title: "Signed Out", description: "See you soon!" });
      router.push('/login');
    } catch (error: any)
     {
      console.error("Sign out error:", error);
      toast({ title: "Sign Out Failed", description: error.message || "Mock sign-out failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<Pick<User, 'displayName' | 'photoURL' | 'bio'>>) => {
    const currentUser = mockAuthService.currentUser; // Get current user from mock
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await mockAuthService.updateProfile(currentUser, profileData);
      // Manually update local user state to reflect changes immediately
      setUser(prevUser => prevUser ? { ...prevUser, ...profileData } as User : null);
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({ title: "Profile Update Failed", description: error.message || "Mock profile update failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, updateUserProfile };
}
