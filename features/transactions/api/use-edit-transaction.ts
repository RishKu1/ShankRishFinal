import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];
type SingleTransactionResponseType = InferResponseType<typeof client.api.transactions[":id"]["$get"], 200>["data"];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      let beforeState: SingleTransactionResponseType | undefined = undefined;
      if (id) {
        const res = await client.api.transactions[":id"]["$get"]({ param: { id } });
        if (res.ok) {
          const { data } = await res.json();
          beforeState = data;

          // Compare beforeState to the new json, ignoring properties not in json
          const hasChanges = Object.keys(json).some(
            key => beforeState && (beforeState as any)[key] !== json[key as keyof typeof json]
          );

          if (!hasChanges) {
            // This will be caught by onError and show a custom message
            throw new Error("No changes detected");
          }
        }
      }

      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });
      const afterData = await response.json();
      // afterData.data is the new state
      // Send notification with before/after
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "info",
          title: "Transaction Updated",
          message: `A transaction was updated in your account.`,
          transactionId: id,
          beforeState,
          afterState: 'data' in afterData ? afterData.data : undefined,
        }),
      });
      return afterData;
    },
    onSuccess: async () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      if (error.message === "No changes detected") {
        toast.info("No changes were made");
      } else {
      toast.error("Failed to edit transaction");
      }
    },
  });
  return mutation;
};
