"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ListNote } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import NoteCard from "./note-card";

const fetchNotes = async (): Promise<{ notes: ListNote[] }> => {
  const response = await fetch("/api/admin/note");

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  const data = await response.json();
  return data;
};

const ListNotes = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="text-muted-foreground">Error fetching notes</div>
      </div>
    );
  }

  if (!data?.notes?.length) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="text-muted-foreground">No notes found</div>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default ListNotes;
