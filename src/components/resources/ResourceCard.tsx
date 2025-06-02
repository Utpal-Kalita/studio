// src/components/resources/ResourceCard.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // If contentUrl is an internal link
import { ArrowUpRight, FileText, Youtube, Sparkles, ExternalLink } from "lucide-react"; // Example icons
import Image from "next/image";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Article' | 'Video' | 'Exercise' | string; // Allow other types
  topic: string;
  contentUrl: string; // URL to the resource
  icon?: string; // Lucide icon name
}

interface ResourceCardProps {
  resource: Resource;
}

const typeIconMap: { [key: string]: React.ElementType } = {
  'Article': FileText,
  'Video': Youtube,
  'Exercise': Sparkles,
  'Default': FileText,
};

const typeColorMap: { [key: string]: string } = {
  'Article': 'bg-blue-500/10 text-blue-600 border-blue-500',
  'Video': 'bg-red-500/10 text-red-600 border-red-500',
  'Exercise': 'bg-green-500/10 text-green-600 border-green-500',
  'Default': 'bg-gray-500/10 text-gray-600 border-gray-500',
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const TypeIcon = resource.type && typeIconMap[resource.type] ? typeIconMap[resource.type] : typeIconMap.Default;
  const typeColors = resource.type && typeColorMap[resource.type] ? typeColorMap[resource.type] : typeColorMap.Default;

  const handleOpenResource = () => {
    // For now, assume external link. Can be adapted for modals or internal pages.
    window.open(resource.contentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
         <Image 
            src={`https://placehold.co/400x200.png`} 
            alt={resource.title} 
            width={400} 
            height={200} 
            className="w-full h-40 object-cover rounded-md mb-4"
            data-ai-hint={`${resource.topic.toLowerCase()} ${resource.type.toLowerCase()}`}
        />
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-lg leading-tight line-clamp-2">{resource.title}</CardTitle>
            <Badge variant="outline" className={`whitespace-nowrap px-2 py-1 text-xs ${typeColors}`}>
                <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
                {resource.type}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-3">{resource.description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-4 border-t flex-col items-start gap-3">
        <Badge variant="secondary" className="text-xs">{resource.topic}</Badge>
        <Button onClick={handleOpenResource} variant="default" size="sm" className="w-full">
          Open Resource <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
