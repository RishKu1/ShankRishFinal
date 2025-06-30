"use client";

import { DataGrid } from "@/components/data-grid";
import { DataCharts } from "@/components/data-charts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Overview
          </CardTitle>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="w-full lg:w-auto"
          >
            <Printer className="size-4 mr-2" />
            Print
          </Button>
        </CardHeader>
        <CardContent>
          <div id="printable-area">
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <DataGrid />
            </motion.div>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DataCharts />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
