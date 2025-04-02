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
  Loader2
} from "lucide-react";

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

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const NotificationPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();

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
                        <h4 className="font-semibold">{notification.title}</h4>
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
    </div>
  );
};

export default NotificationPage; 