// src/app/signup/page.tsx
import SignupForm from '@/components/auth/SignupForm';
import { Logo } from '@/components/layout/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="absolute top-6 left-6">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Join WellVerse Today</CardTitle>
          <CardDescription>Create an account to start your wellness journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
