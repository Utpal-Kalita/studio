// src/components/resources/ResourceFilter.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter, Tag } from "lucide-react";

export interface FilterState {
  searchTerm: string;
  topic: string; // 'all' or specific topic
  type: string;  // 'all' or specific type
}

interface ResourceFilterProps {
  topics: string[];
  types: string[];
  currentFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function ResourceFilter({ topics, types, currentFilters, onFilterChange }: ResourceFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...currentFilters, searchTerm: e.target.value });
  };

  const handleTopicChange = (value: string) => {
    onFilterChange({ ...currentFilters, topic: value });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({ ...currentFilters, type: value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end p-4 bg-background/50 rounded-lg border">
      <div className="space-y-1.5">
        <Label htmlFor="searchResources" className="flex items-center text-sm font-medium text-muted-foreground">
          <Search className="h-4 w-4 mr-2"/>
          Search Resources
        </Label>
        <Input
          id="searchResources"
          type="search"
          placeholder="Keywords, title..."
          value={currentFilters.searchTerm}
          onChange={handleSearchChange}
          className="bg-background focus:bg-background/80"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="topicFilter" className="flex items-center text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4 mr-2"/>
            Filter by Topic
        </Label>
        <Select value={currentFilters.topic} onValueChange={handleTopicChange}>
          <SelectTrigger id="topicFilter" className="bg-background focus:bg-background/80">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            {topics.map(topic => (
              <SelectItem key={topic} value={topic} className="capitalize">
                {topic === "all" ? "All Topics" : topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="typeFilter" className="flex items-center text-sm font-medium text-muted-foreground">
            <ListFilter className="h-4 w-4 mr-2"/>
            Filter by Type
        </Label>
        <Select value={currentFilters.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="typeFilter" className="bg-background focus:bg-background/80">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => (
              <SelectItem key={type} value={type} className="capitalize">
                {type === "all" ? "All Types" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
