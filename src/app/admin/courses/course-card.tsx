import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ListCourse } from "@/lib/type";
import { constructFileUrl } from "@/lib/utils";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { ArrowRight, MoreHorizontal, School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CourseCard = {
  course: ListCourse;
};

const CourseCard = ({ course }: CourseCard) => {
  const thumbnailUrl = constructFileUrl(course.fileKey);

  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.slug}`}>
                <IconPencil />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.slug}`}>
                <IconEye />
                Preview
              </Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.slug}/delete`}>
                <IconTrash className="text-primary" />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        alt={course.title}
        src={thumbnailUrl}
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {course.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">
              {course.duration} mins
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-muted-foreground text-sm">{course.level}</p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${course.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
