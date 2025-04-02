import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = "/api/notifications";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const { data } = await response.json();
      return data;
    },
  });

  const createNotification = useMutation({
    mutationFn: async (notification: {
      type: "success" | "warning" | "info";
      title: string;
      message: string;
      transactionId?: string;
    }) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });
      if (!response.ok) {
        throw new Error("Failed to create notification");
      }
      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to create notification");
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, read: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id?: string) => {
      const url = id ? `${API_URL}?id=${id}` : API_URL;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    createNotification,
    markAsRead,
    deleteNotification,
  };
}; 