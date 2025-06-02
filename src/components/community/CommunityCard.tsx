// src/components/community/CommunityCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Users, ShieldAlert, CloudRain, HeartHandshake, Sunrise, MessageSquare } from 'lucide-react'; // Example icons
import Image from "next/image";

export interface Community {
  id: string;
  name: string;
  description: string;
  icon?: string; // Lucide icon name as string
  memberCount?: number; // Optional
  postCount?: number; // Optional
}

interface CommunityCardProps {
  community: Community;
}

const iconMap: { [key: string]: React.ElementType } = {
  ShieldAlert,
  CloudRain,
  HeartHandshake,
  Sunrise,
  Users,
  MessageSquare,
  Default: Users,
};


export default function CommunityCard({ community }: CommunityCardProps) {
  const IconComponent = community.icon && iconMap[community.icon] ? iconMap[community.icon] : iconMap.Default;

  const getImageHint = () => {
    let hintPart = community.name.toLowerCase().split('&')[0].trim().split(' ')[0]; // Default to first word of name
    if (community.icon && iconMap[community.icon]) {
      hintPart = community.icon.toLowerCase().replace(/([A-Z])/g, '$1').trim().split(' ')[0];
      if (hintPart === "shieldalert") hintPart = "shield";
      if (hintPart === "cloudrain") hintPart = "cloud";
      if (hintPart === "heartHandshake") hintPart = "heart";
      if (hintPart === "messagesquare") hintPart = "message";
    }
    return `${hintPart} abstract`;
  }

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <IconComponent size={28} />
          </div>
          <CardTitle className="font-headline text-xl">{community.name}</CardTitle>
        </div>
         <Image 
            src={`https://placehold.co/400x150.png`}
            alt={community.name}
            width={400}
            height={150}
            className="w-full h-32 object-cover rounded-md"
            data-ai-hint={getImageHint()}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-3">{community.description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Button asChild variant="ghost" className="w-full justify-start text-primary hover:text-primary">
          <Link href={`/community/${community.id}`}>
            Enter Community <ArrowRight className="ml-auto h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
