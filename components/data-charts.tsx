"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { Chart, ChartLoading } from "./chart";
import { SpendingPie, SpendingPieLoading } from "./spending-pie";
import { motion } from "framer-motion";

const chartVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20,
      staggerChildren: 0.2,
    } 
  },
};

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }
  console.log(data);
  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-6 gap-8"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="col-span-1 lg:col-span-3 xl:col-span-4"
        variants={chartVariants}
      >
        <Chart data={data?.days} />
      </motion.div>
      <motion.div
        className="col-span-1 lg:col-span-3 xl:col-span-2"
        variants={chartVariants}
      >
        <SpendingPie data={data?.categories} />
      </motion.div>
    </motion.div>
  );
};
