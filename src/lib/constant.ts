export const EMAIL_LOGIN_OTP_LENGTH = 6;

import { SubNavItem } from "@/components/landing-page/nav-dropdown";
import { ImageIcon, LayoutGrid, MessageSquare } from "lucide-react";

// Brand color palette
export const brandColors = {
  primary: "#7A7FEE", // Main purple/blue
  secondary: "#FF6B8B", // Pink/red accent
  tertiary: "#50C4ED", // Light blue accent
  quaternary: "#FFB347", // Orange accent
  success: "#4CAF50", // Green
  warning: "#FFC107", // Yellow/amber
  info: "#2196F3", // Blue
  dark: "#272829", // Dark background
};

// Icon background colors for different categories
export const iconColors = {
  projects: {
    clientPortals: "bg-gradient-to-br from-[#7A7FEE] to-[#9D7FEE]",
    marketplaces: "bg-gradient-to-br from-[#FF6B8B] to-[#FF8E8B]",
    saas: "bg-gradient-to-br from-[#50C4ED] to-[#7A7FEE]",
    ai: "bg-gradient-to-br from-[#9D7FEE] to-[#C77FEE]",
    mobile: "bg-gradient-to-br from-[#FF8E8B] to-[#FFB347]",
    web: "bg-gradient-to-br from-[#7A7FEE] to-[#50C4ED]",
  },
  resources: {
    blog: "bg-gradient-to-br from-[#50C4ED] to-[#7A7FEE]",
    caseStudies: "bg-gradient-to-br from-[#7A7FEE] to-[#9D7FEE]",
    documentation: "bg-gradient-to-br from-[#FFB347] to-[#FF8E8B]",
    api: "bg-gradient-to-br from-[#9D7FEE] to-[#C77FEE]",
    tutorials: "bg-gradient-to-br from-[#FF6B8B] to-[#FF8E8B]",
    community: "bg-gradient-to-br from-[#7A7FEE] to-[#50C4ED]",
  },
  services: {
    development: "bg-gradient-to-br from-[#7A7FEE] to-[#9D7FEE]",
    ai: "bg-gradient-to-br from-[#9D7FEE] to-[#C77FEE]",
    design: "bg-gradient-to-br from-[#FF6B8B] to-[#FF8E8B]",
    devops: "bg-gradient-to-br from-[#50C4ED] to-[#7A7FEE]",
    performance: "bg-gradient-to-br from-[#FFB347] to-[#FF8E8B]",
    analytics: "bg-gradient-to-br from-[#7A7FEE] to-[#50C4ED]",
  },
};

// Resources dropdown data
export const resourcesDropdownData: SubNavItem[][] = [
  [
    {
      title: "Foundation Bubble Template",
      description: "Start your Bubble project with our foundation template",
      href: "https://bubble.io/template/foundation-by-automatic-1673596403969x408542417388568600",
      icon: LayoutGrid,
      color: iconColors.resources.blog,
      external: true,
    },
    {
      title: "Favicon Generator",
      description: "Convert your images to favicons",
      href: "https://favicon.automatic.so/",
      icon: ImageIcon,
      color: iconColors.resources.tutorials,
      external: true,
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team",
      href: "https://x.com/David__Flynn",
      icon: MessageSquare,
      color: iconColors.resources.community,
      external: true,
    },
  ],
];
