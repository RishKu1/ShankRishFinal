import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransactions = ({ accountId = "", categoryId = "", from = "", to = "" } = {}) => {
  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId, categoryId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: { from, to, accountId, categoryId },
      });
      if (!response.ok) {
        throw new Error("Faild to fetch transactions");
      }
      const { data } = await response.json();
      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }));
    },
  });
  return query;
};
