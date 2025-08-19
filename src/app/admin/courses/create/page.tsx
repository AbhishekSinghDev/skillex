import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import BasicCourseForm from "./basic-course-form";

const CourseCreationPage = () => {
  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            size: "icon",
            variant: "outline",
          })}
        >
          <IconArrowLeft />
        </Link>

        <h1 className="text-2xl font-bold">Create Course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BasicCourseForm />
        </CardContent>
      </Card>
    </>
  );
};

export default CourseCreationPage;
