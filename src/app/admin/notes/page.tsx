import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import ListNotes from "./list-notes";

const page = async () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Notes</h1>

        <Link href="/admin/notes/create" className={buttonVariants()}>
          Create Note
        </Link>
      </div>

      <ListNotes />
    </div>
  );
};

export default page;
