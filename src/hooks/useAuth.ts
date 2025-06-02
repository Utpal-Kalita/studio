
// src/hooks/useAuth.ts
"use client";

import type { User } from '@/lib/firebase'; // Our custom User type
import { auth, db, GoogleAuthProvider as FirebaseGoogleAuthProvider } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  updateProfile as firebaseUpdateProfile,
  type User as FirebaseUser // Firebase's User type
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseAuthUser: FirebaseUser | null) => {
      if (firebaseAuthUser) {
        const userRef = doc(db, 'users', firebaseAuthUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser({ ...firebaseAuthUser, ...userSnap.data() } as User);
        } else {
          // This case might happen if user was created but Firestore doc failed
          // Or if user signed in with Google for first time and doc is created in signInWithGoogle
          setUser(firebaseAuthUser as User); // Use as User, bio might be missing initially
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
      await signInWithEmailAndPassword(auth, email, pass);
      // User state will be set by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome back!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ title: "Sign In Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseAuthUser = userCredential.user;
      await firebaseUpdateProfile(firebaseAuthUser, { displayName });
      
      const userRef = doc(db, 'users', firebaseAuthUser.uid);
      await setDoc(userRef, {
        uid: firebaseAuthUser.uid,
        email: firebaseAuthUser.email,
        displayName: displayName,
        photoURL: firebaseAuthUser.photoURL || `https://placehold.co/100x100.png?text=${displayName.charAt(0)}`,
        bio: '',
      });
      // User state will be set by onAuthStateChanged
      toast({ title: "Signed Up", description: "Welcome to WellVerse!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new FirebaseGoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseAuthUser = userCredential.user;

      const userRef = doc(db, 'users', firebaseAuthUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseAuthUser.uid,
          email: firebaseAuthUser.email,
          displayName: firebaseAuthUser.displayName,
          photoURL: firebaseAuthUser.photoURL || `https://placehold.co/100x100.png?text=${firebaseAuthUser.displayName?.charAt(0)}`,
          bio: '',
        });
      }
      // User state will be set by onAuthStateChanged
      toast({ title: "Signed In", description: "Welcome!" });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({ title: "Google Sign In Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // User state will be set by onAuthStateChanged to null
      toast({ title: "Signed Out", description: "See you soon!" });
      router.push('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData: Partial<Pick<User, 'displayName' | 'photoURL' | 'bio'>>) => {
    if (!auth.currentUser) { // Check auth.currentUser instead of local user state
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Update Firebase Auth profile (displayName, photoURL)
      const authProfileUpdates: { displayName?: string | null; photoURL?: string | null } = {};
      if (profileData.displayName !== undefined) authProfileUpdates.displayName = profileData.displayName;
      if (profileData.photoURL !== undefined) authProfileUpdates.photoURL = profileData.photoURL;
      if (Object.keys(authProfileUpdates).length > 0) {
        await firebaseUpdateProfile(auth.currentUser, authProfileUpdates);
      }

      // Update Firestore user document (bio, and potentially displayName/photoURL if you keep them synced)
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, profileData); // This will update only the fields provided in profileData
      
      // Manually update local user state to reflect changes immediately
      setUser(prevUser => prevUser ? { ...prevUser, ...profileData } as User : null);
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
