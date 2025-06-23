"use client";

import { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Filter,
  Trash2,
  Check,
  Loader2,
  ArrowRightLeft,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/features/notifications/api/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useEffect } from 'react';
import { useUndoTransaction } from '@/features/transactions/api/use-undo-transaction';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  transactionId?: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
};

const NotificationPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();
  const [openTransactionId, setOpenTransactionId] = useState<string | null>(null);
  const transactionQuery = useGetTransaction(openTransactionId || undefined);
  const undoMutation = useUndoTransaction(openTransactionId || undefined);
  const createTransactionMutation = useCreateTransaction();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    notifications
      .filter((notification: Notification) => !notification.read)
      .forEach((notification: Notification) => {
        markAsRead.mutate(notification.id);
      });
  };

  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notification.read;
    return notification.type === selectedFilter;
  });

  const handleUndo = () => {
    if (!openTransactionId) return;
    
    // Find the notification for this transaction
    const notif = filteredNotifications.find((n: Notification) => n.transactionId === openTransactionId);
    const beforeState = notif?.beforeState;
    
    if (beforeState) {
      // Prepare the data for the undo operation
      const undoData = {
        payee: beforeState.payee,
        amount: beforeState.amount,
        categoryId: beforeState.categoryId,
        date: new Date(beforeState.date),
        notes: beforeState.notes,
        accountId: beforeState.accountId,
      };
      
      undoMutation.mutate(undoData, {
        onSuccess: () => {
          setOpenTransactionId(null); // Close the modal
        }
      });
    }
  };

  const handleUndoDelete = () => {
    if (!openTransactionId) return;
    
    // Find the notification for this transaction
    const notif = filteredNotifications.find((n: Notification) => n.transactionId === openTransactionId);
    const beforeState = notif?.beforeState;
    
    if (beforeState) {
      // Prepare the data for creating the transaction
      const createData = {
        payee: beforeState.payee,
        amount: beforeState.amount,
        categoryId: beforeState.categoryId,
        date: new Date(beforeState.date),
        notes: beforeState.notes,
        accountId: beforeState.accountId,
      };
      
      createTransactionMutation.mutate(createData, {
        onSuccess: () => {
          setOpenTransactionId(null); // Close the modal
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="flex flex-col gap-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            Notifications
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Stay updated with your account activity
          </p>
        </div>
        <div className="flex justify-end items-center">
          <div className="flex gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("unread")}>
                  Unread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("success")}>
                  Success
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("warning")}>
                  Warnings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("info")}>
                  Information
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some((n: Notification) => !n.read)}
            >
              Mark all as read
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: Notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-75" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {notification.transactionId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setOpenTransactionId(notification.transactionId ? String(notification.transactionId) : null)}
                              title="View transaction details"
                            >
                              <Info className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {/* Transaction Info Modal */}
      <Dialog open={!!openTransactionId} onOpenChange={() => setOpenTransactionId(null)}>
        <DialogContent className="max-w-3xl w-full min-h-[400px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {(() => {
                // Find the notification for this transaction
                const notif = filteredNotifications.find((n: Notification) => n.transactionId === openTransactionId);
                const before = notif?.beforeState;
                const after = notif?.afterState;
                
                // If there's only beforeState, it's a deleted transaction
                if (before && !after) {
                  return (
                    <div className="space-y-2 mt-4">
                      <div className="font-semibold mb-2 text-red-600">Deleted Transaction</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border rounded text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-3 py-2 text-left font-semibold">Field</th>
                              <th className="px-3 py-2 text-left font-semibold">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { key: "payee", label: "Payee" },
                              { key: "amount", label: "Amount" },
                              { key: "account", label: "Account" },
                              { key: "categoryId", label: "Category" },
                              { key: "date", label: "Date" },
                              { key: "notes", label: "Notes" },
                            ].map((field, idx) => {
                              const formatValue = (key: string, value: any) => {
                                if (key === "date" && typeof value === "string" && value.length > 0) return format(new Date(value), "yyyy-MM-dd");
                                if (key === "amount" && value !== undefined && value !== null) return `$${(Number(value) / 1000).toFixed(2)}`;
                                return String(value ?? "");
                              };
                              return (
                                <motion.tr
                                  key={field.key}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="bg-red-50"
                                >
                                  <td className="px-3 py-2 font-medium text-muted-foreground">{field.label}</td>
                                  <td className="px-3 py-2 text-red-800">
                                    {formatValue(field.key, before[field.key])}
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {/* Undo Delete Button */}
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleUndoDelete}
                            disabled={createTransactionMutation.isPending}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            {createTransactionMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                            {createTransactionMutation.isPending ? "Restoring..." : "Restore Transaction"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // For other cases, load the current transaction
                if (transactionQuery.isLoading) return 'Loading...';
                if (transactionQuery.error) return 'Failed to load transaction.';
                if (!transactionQuery.data) return 'Transaction not found.';
                
                const currentData = transactionQuery.data;
                const fields = [
                  { key: "payee", label: "Payee" },
                  { key: "amount", label: "Amount" },
                  { key: "account", label: "Account" },
                  { key: "categoryId", label: "Category" },
                  { key: "date", label: "Date" },
                  { key: "notes", label: "Notes" },
                ];
                
                if (before && after) {
                  return (
                    <div className="space-y-2 mt-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border rounded text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-3 py-2 text-left font-semibold">Field</th>
                              <th className="px-3 py-2 text-left font-semibold">Before</th>
                              <th className="px-3 py-2 text-left font-semibold">After</th>
                              <th className="px-3 py-2 text-center font-semibold">Changed</th>
                            </tr>
                          </thead>
                          <AnimatePresence initial={false}>
                            <tbody>
                              {fields.map((field, idx) => {
                                const changed = field.key !== "account" && before[field.key] !== after[field.key];
                                // Format date and amount
                                const formatValue = (key: string, value: any) => {
                                  if (key === "date" && typeof value === "string" && value.length > 0) return format(new Date(value), "yyyy-MM-dd");
                                  if (key === "amount" && value !== undefined && value !== null) return `$${(Number(value) / 1000).toFixed(2)}`;
                                  return String(value ?? "");
                                };
                                return (
                                  <motion.tr
                                    key={field.key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={changed ? "bg-yellow-50" : "bg-white/80"}
                                  >
                                    <td className="px-3 py-2 font-medium text-muted-foreground">{field.label}</td>
                                    <motion.td
                                      className={changed ? "px-3 py-2 font-semibold text-yellow-800" : "px-3 py-2 text-muted-foreground"}
                                      animate={changed ? { scale: [1, 1.05, 1], backgroundColor: ["#FEF9C3", "#FDE68A", "#FEF9C3"] } : {}}
                                      transition={changed ? { duration: 0.6 } : {}}
                                    >
                                      {formatValue(field.key, before[field.key])}
                                    </motion.td>
                                    <motion.td
                                      className={changed ? "px-3 py-2 font-semibold text-green-800" : "px-3 py-2 text-muted-foreground"}
                                      animate={changed ? { scale: [1, 1.05, 1], backgroundColor: ["#D1FAE5", "#6EE7B7", "#D1FAE5"] } : {}}
                                      transition={changed ? { duration: 0.6 } : {}}
                                    >
                                      {formatValue(field.key, after[field.key])}
                                    </motion.td>
                                    <td className="px-3 py-2 text-center">
                                      {changed ? <ArrowRightLeft className="inline-block text-green-600 w-4 h-4 animate-pulse" /> : <span className="text-gray-300">—</span>}
                                    </td>
                                  </motion.tr>
                                );
                              })}
                            </tbody>
                          </AnimatePresence>
                        </table>
                        {/* Undo Button */}
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleUndo}
                            disabled={undoMutation.isPending}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            {undoMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                            {undoMutation.isPending ? "Reverting..." : "Undo Changes"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Only current data (created transaction)
                  return (
                    <div className="space-y-2 mt-4">
                      <div className="font-semibold mb-2">Transaction</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border rounded text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-3 py-2 text-left font-semibold">Field</th>
                              <th className="px-3 py-2 text-left font-semibold">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fields.map((field, idx) => {
                              const formatValue = (key: string, value: any) => {
                                if (key === "date" && typeof value === "string" && value.length > 0) return format(new Date(value), "yyyy-MM-dd");
                                if (key === "amount" && value !== undefined && value !== null) return `$${(Number(value) / 1000).toFixed(2)}`;
                                return String(value ?? "");
                              };
                              return (
                                <motion.tr
                                  key={field.key}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="bg-green-50"
                                >
                                  <td className="px-3 py-2 font-medium text-muted-foreground">{field.label}</td>
                                  <td className="px-3 py-2 text-green-800">
                                    {formatValue(field.key, currentData[field.key as keyof typeof currentData])}
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }
              })()}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationPage; 