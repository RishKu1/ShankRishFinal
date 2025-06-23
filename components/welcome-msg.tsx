"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

export const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();
  const { theme } = useTheme();
  
  const currentTime = new Date().getHours();
  const getGreeting = () => {
    if (currentTime < 12) return "Good Morning";
    if (currentTime < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl p-8 mb-6 shadow-2xl",
        theme === "fancy"
          ? "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"
          : "bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30" />
      <motion.div
        className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
            {getGreeting()}
          </span>
        </motion.div>

        <motion.h2
          className="text-3xl lg:text-5xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLoaded ? user?.firstName : "User"}
          <span className="inline-block ml-3 animate-bounce">👋</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/90 mb-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Ready to conquer your financial goals today? Let's make every penny
          count! 💪
        </motion.p>

        <motion.div
          className="flex items-center gap-6 text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Track Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Smart Budgeting</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Daily Insights</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
