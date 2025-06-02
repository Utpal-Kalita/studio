// src/app/profile/page.tsx
"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";
import ProfileForm from "@/components/profile/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  if (!user) {
    // AuthGuard should handle this, but as a fallback
    return (
      <AuthGuard>
        <AppShell>
          <p>User not found.</p>
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Profile</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm currentUser={user} />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
