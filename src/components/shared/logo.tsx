import { cn } from "@/lib/utils";
import { IconBracketsContain } from "@tabler/icons-react";
import Link from "next/link";

interface LogoProps {
  showBrandName?: boolean;
  href?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  brandName?: string;
  iconSize?: number;
}

const Logo = ({
  showBrandName = false,
  href = "/",
  className,
  iconClassName,
  textClassName,
  brandName = "Skillex",
  iconSize = 24,
}: LogoProps) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <IconBracketsContain
        size={iconSize}
        className={cn("flex-shrink-0 text-primary", iconClassName)}
      />
      {showBrandName && (
        <span className={cn("font-semibold text-xl truncate", textClassName)}>
          {brandName}
        </span>
      )}
    </Link>
  );
};

export default Logo;
