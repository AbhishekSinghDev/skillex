"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconEye, IconHeart, IconMessageCircle } from "@tabler/icons-react";

const NotesContent = () => {
  // Mock notes data - replace with actual API call in the future
  const mockNotes = [
    {
      id: "1",
      title: "React Best Practices Guide",
      author: "Alex Morgan",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "24.3k",
      likes: "1.8k",
      comments: 96,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Advanced TypeScript Patterns",
      author: "Jamie Chen",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "18.7k",
      likes: "1.2k",
      comments: 42,
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      title: "Node.js Performance Optimization",
      author: "Sam Wilson",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "32.1k",
      likes: "2.4k",
      comments: 118,
      createdAt: "2024-01-13",
    },
    {
      id: "4",
      title: "CSS Grid vs Flexbox",
      author: "Taylor Reed",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "15.9k",
      likes: "980",
      comments: 64,
      createdAt: "2024-01-12",
    },
    {
      id: "5",
      title: "Database Design Fundamentals",
      author: "Jordan Lee",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "28.5k",
      likes: "2.1k",
      comments: 93,
      createdAt: "2024-01-11",
    },
    {
      id: "6",
      title: "GraphQL vs REST API",
      author: "Casey Kim",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "19.2k",
      likes: "1.5k",
      comments: 72,
      createdAt: "2024-01-10",
    },
    {
      id: "7",
      title: "Docker Container Best Practices",
      author: "Riley Johnson",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "22.8k",
      likes: "1.7k",
      comments: 81,
      createdAt: "2024-01-09",
    },
    {
      id: "8",
      title: "Modern JavaScript Features",
      author: "Quinn Parker",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "26.4k",
      likes: "2.2k",
      comments: 104,
      createdAt: "2024-01-08",
    },
    {
      id: "9",
      title: "Authentication & Security",
      author: "Morgan Davis",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "31.7k",
      likes: "2.8k",
      comments: 147,
      createdAt: "2024-01-07",
    },
    {
      id: "10",
      title: "Microservices Architecture",
      author: "Blake Wilson",
      authorAvatar: "/note-thumbnail-placeholder.webp",
      thumbnail: "/note-thumbnail-placeholder.webp",
      views: "29.3k",
      likes: "2.5k",
      comments: 129,
      createdAt: "2024-01-06",
    },
  ];

  const tabs = [
    { value: "featured", label: "Featured" },
    { value: "recent", label: "Recent" },
    { value: "popular", label: "Popular" },
  ];

  return (
    <>
      <div className="max-w-full mx-auto lg:px-8 lg:py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Discover Notes
          </h1>
          <p className="text-muted-foreground">
            Explore a variety of notes shared by{" "}
            <span className="font-semibold">Youth AF</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="featured">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-8">
              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-105 p-0 gap-0"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardHeader className="px-4 pt-4 pb-2">
                      <CardTitle className="line-clamp-2 leading-snug text-base">
                        {note.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-4 py-0">
                      {/* Author */}
                      <div className="flex items-center gap-2 mb-4">
                        <img
                          src={note.authorAvatar}
                          alt={note.author}
                          className="w-6 h-6 rounded-full bg-muted"
                        />
                        <span className="text-sm text-muted-foreground">
                          {note.author}
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="px-4 pb-4 pt-0">
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <IconEye className="size-4" />
                            <span>{note.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconHeart className="size-4" />
                            <span>{note.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconMessageCircle className="size-4" />
                            <span>{note.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default NotesContent;
