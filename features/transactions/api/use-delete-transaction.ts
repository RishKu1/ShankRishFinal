import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      let beforeState = undefined;
      if (id) {
        const response = await client.api.transactions[":id"]["$get"]({ param: { id } });
        if (response.ok) {
          const { data } = await response.json();
          beforeState = data;
        }
      }
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });
      const result = await response.json();
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "info",
          title: "Transaction Deleted",
          message: `A transaction was deleted from your account.`,
          transactionId: id,
          beforeState,
        }),
      });
      return result;
    },
    onSuccess: async () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });
  return mutation;
};
