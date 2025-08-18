import Logo from "../shared/logo";
import ThemeToggle from "../shared/toggle-theme";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-xs">
      <div className="py-4 max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Logo showBrandName />

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <DesktopMenu />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
