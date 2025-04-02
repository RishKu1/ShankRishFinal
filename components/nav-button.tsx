"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
  const pathname = usePathname();

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
};
