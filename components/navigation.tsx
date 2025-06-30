"use client";

import { useState } from "react";
import { useMedia } from "react-use";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Tags, 
  Settings, 
  HelpCircle, 
  Bell,
  Menu,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";

import { Button } from "./ui/button";
import { NavButton } from "./nav-button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useTheme } from "@/providers/theme-provider";

const routes = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    href: "/accounts",
    label: "Accounts",
    icon: Wallet,
  },
  {
    href: "/help",
    label: "Help",
    icon: HelpCircle,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  }
];

const quickActions = [
  {
    label: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);
  const { theme, toggleTheme } = useTheme();

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                <route.icon className="size-4 mr-2" />
                {route.label}
              </Button>
            ))}
            <Separator className="my-2" />
            {quickActions.map((action) => (
              <Button
                key={action.href}
                variant="ghost"
                onClick={() => onClick(action.href)}
                className="w-full justify-start"
              >
                <action.icon className="size-4 mr-2" />
                {action.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-white/20"
            >
              {theme === "fancy" ? <Sun className="size-4 mr-2" /> : <Moon className="size-4 mr-2" />}
              Change Background
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-4">
      <div className="flex items-center gap-x-2">
        {routes.map((route) => (
          <NavButton
            key={route.href}
            href={route.href}
            label={route.label}
            icon={route.icon}
            isActive={pathname === route.href}
          />
        ))}
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-x-2">
        {quickActions.map((action) => (
          <Button
            key={action.href}
            variant="ghost"
            size="sm"
            onClick={() => onClick(action.href)}
            className="text-white hover:bg-white/20"
          >
            <action.icon className="size-4 mr-2" />
            {action.label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-white hover:bg-white/20"
        >
          {theme === "fancy" ? <Sun className="size-4 mr-2" /> : <Moon className="size-4 mr-2" />}
          Change Background
        </Button>
      </div>
    </nav>
  );
};
