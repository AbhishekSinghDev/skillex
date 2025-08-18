"use client";

import { resourcesDropdownData } from "@/lib/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown from "./nav-dropdown";

const DesktopMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-6">
        <li className="hidden md:block">
          <NavDropdown
            trigger="Resources"
            items={resourcesDropdownData}
            columns={2}
            className={
              pathname.startsWith("/resources")
                ? "text-[#7A7FEE] dark:text-[#7A7FEE]"
                : ""
            }
          />
        </li>
        <li>
          <Link
            href="/portfolio"
            className={`transition-colors ${
              pathname === "/portfolio"
                ? "text-[#7A7FEE] dark:text-[#7A7FEE]"
                : "text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE]"
            }`}
          >
            Portfolio
          </Link>
        </li>
        <li>
          <Link
            href="/start"
            className={`transition-colors ${
              pathname === "/start"
                ? "text-[#7A7FEE] dark:text-[#7A7FEE]"
                : "text-black dark:text-white hover:text-[#7A7FEE] dark:hover:text-[#7A7FEE]"
            }`}
          >
            Start Project
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default DesktopMenu;
