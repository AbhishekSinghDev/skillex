"use client";

import { resourcesDropdownData } from "@/lib/constant";
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
      </ul>
    </nav>
  );
};

export default DesktopMenu;
