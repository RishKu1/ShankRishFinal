"use client";

import { IconType } from "react-icons";
import { VariantProps, cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { CountUp } from "./count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useTheme } from "@/providers/theme-provider";

const boxVariant = (theme: "original" | "fancy") =>
  cva("shrink-0 rounded-md p-3", {
    variants: {
      variant: {
        default:
          theme === "fancy" ? "bg-purple-200/20" : "bg-blue-200/20",
        success: "bg-emerald-500/20",
        danger:
          theme === "fancy" ? "bg-orange-500/20" : "bg-rose-500/20",
        warning: "bg-pink-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

const iconVariant = (theme: "original" | "fancy") =>
  cva("size-6", {
    variants: {
      variant: {
        default:
          theme === "fancy" ? "fill-purple-600" : "fill-blue-500",
        success: "fill-emerald-500",
        danger:
          theme === "fancy" ? "fill-orange-600" : "fill-rose-500",
        warning: "fill-pink-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

type BoxVariantProps = VariantProps<ReturnType<typeof boxVariant>>;
type IconVariantProps = VariantProps<ReturnType<typeof iconVariant>>;

interface DataCardProps extends BoxVariantProps, IconVariantProps {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        y: -5, 
        boxShadow: "0px 15px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {dateRange}
            </CardDescription>
          </div>
          <motion.div
            className={cn(boxVariant(theme)({ variant }))}
            whileHover={title !== "Remaining" && title !== "Income" && title !== "Expenses" ? { rotate: 20, scale: 1.25 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Icon className={cn(iconVariant(theme)({ variant }))} />
          </motion.div>
        </CardHeader>
        <CardContent>
          <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
            <CountUp
              preserveValue
              start={0}
              end={value}
              decimals={2}
              decimalPlaces={2}
              formattingFn={formatCurrency}
            />
          </h1>
          <p
            className={cn(
              "text-muted-foreground text-sm line-clamp-1",
              percentageChange > 0 && "text-emerald-500",
              percentageChange < 0 && "text-rose-500"
            )}
          >
            {formatPercentage(percentageChange, { addPrefix: true })} from last
            period
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  );
};
