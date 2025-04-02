import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

type TransactionResponse = {
  data: {
    id: string;
    amount: number;
    [key: string]: any;
  };
} | {
  error: string;
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<TransactionResponse, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });
      const data = await response.json();
      if ('error' in data) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: async (data) => {
      if ('error' in data) return;
      
      // Create a notification for the transaction
      const amount = convertAmountFromMiliunits(data.data.amount);
      const type = data.data.amount > 0 ? "success" : "warning";
      const title = data.data.amount > 0 ? "Transaction Successful" : "Transaction Processed";
      const message = data.data.amount > 0
        ? `Your payment of $${amount.toFixed(2)} has been processed successfully`
        : `A payment of $${amount.toFixed(2)} has been processed`;

      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          message,
          transactionId: data.data.id,
        }),
      });

      toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to create transaction");
    },
  });
  return mutation;
};
