import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import { CategoryForm } from "./category-form";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory as useOpenCategory } from "../hooks/use-open-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-categories";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";

import { useConfirm } from "@/hooks/use-confirm";
import { insertCategorySchema } from "@/db/schema";
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

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  );

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const transactionsQuery = useGetTransactions({ categoryId: id || "", from: "1970-01-01" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = categoryQuery.isLoading;

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

  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: "" };

  return (
    <>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Deleting this category will unlink all associated transactions. They will not be deleted, but will be left without a category.
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
              <div className="text-muted-foreground text-sm">No transactions associated with this category.</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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
