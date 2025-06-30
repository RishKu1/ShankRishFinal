"use client";

import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { formatDateRange } from "@/lib/utils";
import { DataCard, DataCardLoading } from "./data-card";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const to = useSearchParams().get("to") || "";
  const from = useSearchParams().get("from") || "";

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      </motion.div>
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
          variant="success"
        dateRange={dateRangeLabel}
      />
      </motion.div>
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
          variant="danger"
        dateRange={dateRangeLabel}
      />
      </motion.div>
    </div>
  );
};
