import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ListNote } from "@/lib/type";
import { IconEye, IconEyeOff, IconPencil } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Calendar,
  Eye,
  EyeOff,
  FileText,
  MoreHorizontal,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

type NoteCardProps = {
  note: ListNote;
};

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <Badge
                variant={note.isPublished ? "default" : "secondary"}
                className="w-fit"
              >
                {note.isPublished ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/notes/${note.slug}`}>
                  <IconPencil className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/notes/${note.slug}`}>
                  <IconEye className="h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <Separator />
              {note.isPublished ? (
                <DropdownMenuItem className="text-destructive">
                  <IconEyeOff className="h-4 w-4" />
                  Un Publish
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-destructive">
                  <IconEye className="h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Link
          href={`/admin/notes/${note.slug}`}
          className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors block mb-3"
        >
          {note.title}
        </Link>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" />
              <span>
                {note?.attachments?.length} PDF
                {note?.attachments?.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(note.createdAt))} ago</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/notes/${note.slug}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex-1",
            })}
          >
            <IconPencil className="h-4 w-4 mr-1" />
            Edit
          </Link>
          <Link
            href={`/notes/${note.slug}`}
            className={buttonVariants({
              size: "sm",
              className: "flex-1",
            })}
          >
            View <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
