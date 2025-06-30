import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import { useGetAccount } from "../api/use-get-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { AccountForm } from "./account-form";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";

import { useConfirm } from "@/hooks/use-confirm";
import { insertAccountSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account."
  );

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const transactionsQuery = useGetTransactions({ accountId: id || "", from: "1970-01-01" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteDialog(false);
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
  };

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" };

  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Deleting this account will unlink all associated transactions. They will not be deleted, but will be left without an account.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto border rounded p-2 mb-4">
            {transactionsQuery.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : transactionsQuery.data && transactionsQuery.data.length > 0 ? (
              <ul className="space-y-2">
                {transactionsQuery.data.map((tx) => (
                  <li key={tx.id} className="flex justify-between text-sm border-b pb-1">
                    <span>{format(new Date(tx.date), "dd MMM yyyy")}</span>
                    <span>{tx.payee}</span>
                    <span>{tx.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground text-sm">No transactions associated with this account.</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
