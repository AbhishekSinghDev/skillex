import { auth } from "@/server/auth";
import { IconLogin, IconPlayerPlay } from "@tabler/icons-react";
import { headers } from "next/headers";
import Link from "next/link";
import Logo from "../shared/logo";
import ThemeToggle from "../shared/toggle-theme";
import UserDropdown from "../shared/user-dropdown";
import { Button } from "../ui/button";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-xs">
      <div className="py-4 max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Logo showBrandName />

          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <DesktopMenu />

            {/* Theme Toggle Button */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {session?.user ? (
              <UserDropdown />
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/login">
                    Login <IconLogin />
                  </Link>
                </Button>
                <Button className="hidden md:flex" asChild>
                  <Link href="/signup">
                    Get Started <IconPlayerPlay />
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
