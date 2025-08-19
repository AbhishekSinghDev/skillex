"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { resourcesDropdownData } from "@/lib/constant";
import { IconX } from "@tabler/icons-react";
import { ChevronDown, ExternalLink, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "../shared/logo";
import ThemeToggle from "../shared/toggle-theme";
import { Button } from "../ui/button";

export default function MobileMenu() {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(
    "resources"
  );
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = (dropdown: string) => {
    setExpandedDropdown(expandedDropdown === dropdown ? null : dropdown);
  };

  const handleLinkClick = () => {
    setOpen(false);
    setExpandedDropdown(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="md:hidden rounded-full"
        >
          <Menu className="h-4 w-4 text-black dark:text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[85%] max-w-sm p-0"
      >
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
          <Logo showBrandName />
          <div className="flex items-center">
            <ThemeToggle />
            <SheetClose asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <IconX className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className={`flex items-center py-3 px-4 rounded-lg text-base ${
                  pathname === "/"
                    ? "bg-[#7A7FEE]/10 text-[#7A7FEE]"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>

            <li className="border-b border-gray-200 dark:border-gray-800 pb-1">
              <button
                onClick={() => toggleDropdown("resources")}
                className={`flex items-center justify-between w-full py-3 px-4 rounded-lg text-base ${
                  pathname.startsWith("/resources")
                    ? "bg-[#7A7FEE]/10 text-[#7A7FEE]"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedDropdown === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedDropdown === "resources" && (
                <div className="pt-2 pb-3 px-4">
                  {resourcesDropdownData.map((column, colIndex) => (
                    <div key={colIndex} className="mb-4">
                      {column.map((item, itemIndex) =>
                        item.external ? (
                          <a
                            key={`${colIndex}-${itemIndex}`}
                            href={item.href}
                            className="flex items-center gap-3 py-3"
                            onClick={handleLinkClick}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                                item.color || "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {typeof item.icon === "string" ? (
                                <Image
                                  src={item.icon || "/placeholder.svg"}
                                  alt=""
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : item.icon ? (
                                <item.icon className="w-5 h-5 text-white" />
                              ) : null}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {item.title}
                                </h3>
                                <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                              </div>
                              {item.description && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </a>
                        ) : (
                          <Link
                            key={`${colIndex}-${itemIndex}`}
                            href={item.href}
                            className="flex items-center gap-3 py-3"
                            onClick={handleLinkClick}
                          >
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                                item.color || "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {typeof item.icon === "string" ? (
                                <Image
                                  src={item.icon || "/placeholder.svg"}
                                  alt=""
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : item.icon ? (
                                <item.icon className="w-5 h-5 text-white" />
                              ) : null}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
