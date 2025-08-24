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
import NotesForm from "./notes-form";

const NotesCreatePage = () => {
  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href="/admin/notes"
          className={buttonVariants({
            size: "icon",
            variant: "outline",
          })}
        >
          <IconArrowLeft />
        </Link>

        <h1 className="text-2xl font-bold">Create Note</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the note.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotesForm />
        </CardContent>
      </Card>
    </>
  );
};

export default NotesCreatePage;
