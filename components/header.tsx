"use client";

import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";
import { Filters } from "./filters";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/settings";
  const isHelpPage = pathname === "/help";
  const isAccountsPage = pathname === "/accounts";
  const isCategoriesPage = pathname === "/categories";
  const isNotificationsPage = pathname === "/notifications";

  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-4 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-6">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12",
                    userButtonBox: "hover:scale-105 transition-transform duration-200",
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
            <Loader2 className="size-8 animate-spin text-slate-800" />
          </ClerkLoading>
        </div>
        {!isSettingsPage && !isHelpPage && !isAccountsPage && !isCategoriesPage && !isNotificationsPage && (
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
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Search our knowledge base or browse categories below
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
