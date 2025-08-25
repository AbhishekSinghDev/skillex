"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  IconBook,
  IconDashboard,
  IconDeviceIpadHorizontalPlus,
  IconDeviceTvOld,
  IconHome,
  IconVideoPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logout from "./logout";

const UserDropdown = () => {
  const pathName = usePathname();
  const { data: session } = authClient.useSession();

  const isAdmin = session?.user.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={
              session?.user?.image ??
              `https://avatar.vercel.sh/${session?.user?.email}`
            }
            alt={session?.user?.name}
          />
          <AvatarFallback className="rounded-lg">
            {session?.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={
                  session?.user?.image ??
                  `https://avatar.vercel.sh/${session?.user?.email}`
                }
                alt={session?.user?.name}
              />
              <AvatarFallback className="rounded-lg">
                {session?.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {session?.user?.name}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/"
              className={cn(pathName === "/" && "font-bold bg-accent")}
            >
              <IconHome className={cn(pathName === "/" && "text-foreground")} />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/notes"
              className={cn(pathName === "/notes" && "font-bold bg-accent")}
            >
              <IconBook
                className={cn(pathName === "/notes" && "text-foreground")}
              />
              Notes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/courses"
              className={cn(pathName === "/courses" && "font-bold bg-accent")}
            >
              <IconDeviceTvOld
                className={cn(pathName === "/courses" && "text-foreground")}
              />
              Courses
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <span>Admin</span>
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <IconDashboard />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/notes/create">
                  <IconDeviceIpadHorizontalPlus />
                  Create Note
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/courses/create">
                  <IconVideoPlus />
                  Create Course
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
