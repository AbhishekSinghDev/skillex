"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ListCourse } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./course-card";

const fetchCourses = async (): Promise<{ courses: ListCourse[] }> => {
  const response = await fetch("/api/admin/course");

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data = await response.json();
  return data;
};

const ListCourses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Error fetching courses</div>
      </div>
    );
  }

  if (!data?.courses?.length) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">No courses found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {data.courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default ListCourses;
