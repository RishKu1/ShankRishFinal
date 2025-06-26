"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Plus, RefreshCcw } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { transactions as transactionSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { columns } from "./colomns";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { convertAmountToMiliunits } from "@/lib/utils";
import { BankConnection } from '@/components/bank-connection';

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: [],
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results);
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionQuery = useGetTransactions();
  const transactions = transactionQuery.data || [];

  const isDisabled = transactionQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/plaid/sync-transactions", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Synced ${data.added} new transactions from Plaid.`);
        transactionQuery.refetch();
      } else {
        toast.error(data.error || "Failed to sync transactions");
      }
    } catch (err) {
      toast.error("Failed to sync transactions");
    } finally {
      setIsSyncing(false);
    }
  };

  if (transactionQuery.isLoading) {
    return (
      <div>
        <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              onClick={newTransaction.onOpen}
              size="sm"
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Bank Account</CardTitle>
          <CardDescription>
            Connect your bank account to automatically sync transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankConnection
            isConnected={isBankConnected}
            onConnectionChange={setIsBankConnected}
          />
          <Button
            className="mt-4"
            onClick={handleSync}
            disabled={isSyncing}
            variant="default"
          >
            {isSyncing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
            {isSyncing ? "Syncing..." : "Sync Transactions"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
