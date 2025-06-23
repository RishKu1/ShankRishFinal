"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

interface NavButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export const NavButton = ({
  href,
  label,
  icon: Icon,
  isActive,
}: NavButtonProps) => {
  const { theme } = useTheme();

  if (theme === "original") {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-white hover:bg-white/20 hover:text-white transition-all duration-200",
          isActive && "bg-white/20 text-white",
          "flex items-center gap-x-2 px-4 py-2"
        )}
      >
        <Icon className="size-4" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-white hover:text-white transition-all duration-300 relative overflow-hidden group",
          isActive
            ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white shadow-lg backdrop-blur-sm"
            : "hover:bg-white/10",
          "flex items-center gap-x-2 px-4 py-2 rounded-xl"
        )}
      >
        {/* Animated background for active state */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl" />
        )}

        <div className="relative z-10 flex items-center gap-x-2">
          <Icon
            className={cn(
              "size-4 transition-transform duration-200",
              isActive && "scale-110"
            )}
          />
          <span className="font-medium">{label}</span>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </Link>
    </motion.div>
  );
};
