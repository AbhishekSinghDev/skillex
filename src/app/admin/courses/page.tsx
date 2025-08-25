import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ListCourses from "./list-courses";

const CoursePage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        <ListCourses />
      </div>
    </div>
  );
};

export default CoursePage;
