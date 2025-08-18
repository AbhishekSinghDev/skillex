import { Brackets } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  showBrandName?: boolean;
}

const Logo = ({ showBrandName }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <Brackets />
      {showBrandName && <span className="font-bold text-xl">Skillex</span>}
    </Link>
  );
};

export default Logo;
