"use client";

import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";
  const isHelpPage = pathname === "/help";
  const isAccountsPage = pathname === "/accounts";
  const isNotificationsPage = pathname === "/notifications";

  return (
    <header
      className={cn(
        "px-4 py-8 lg:px-4 pb-36 relative overflow-hidden",
        theme === "fancy"
          ? "bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500"
          : "bg-gradient-to-b from-blue-700 to-blue-500"
      )}
    >
      {theme === "fancy" && (
        <>
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </>
      )}

      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-6">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <div className="relative">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt",
                  theme === "fancy"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500"
                    : "bg-gradient-to-r from-blue-600 to-blue-400"
                )}
              />
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12",
                    userButtonBox:
                      "hover:scale-105 transition-transform duration-200",
                  },
                }}
                userProfileProps={{
                  appearance: {
                    elements: {
                      rootBox: "shadow-xl",
                      card: "shadow-xl",
                    },
                  },
                }}
              />
            </div>
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-white" />
          </ClerkLoading>
        </div>
        {!isSettingsPage &&
          !isHelpPage &&
          !isAccountsPage &&
          !isNotificationsPage && (
            <>
              <WelcomeMsg />
              <Filters />
            </>
          )}
        {isHelpPage && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              How can we help you?
            </h1>
            <p
              className={cn(
                "text-lg max-w-2xl mx-auto",
                theme === "fancy" ? "text-white/80" : "text-blue-100"
              )}
            >
              Search our knowledge base or browse categories below
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
