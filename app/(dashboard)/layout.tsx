"use client";

import { Header } from "@/components/header";
import React from "react";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const ThemedLayout = ({ children }: Props) => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen relative">
      <AnimatePresence>
        <motion.div
          key={theme}
          className={`absolute inset-0 ${
            theme === "fancy"
              ? "bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30"
              : "bg-white"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>
      <div className="relative z-10">
        <Header />
        <main className="px-3 lg:px-14">{children}</main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <ThemedLayout>{children}</ThemedLayout>
    </ThemeProvider>
  );
};

export default DashboardLayout;
