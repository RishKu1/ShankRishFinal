"use client";

import { Loader2, Plus, Wallet, Tags } from "lucide-react";
import { useState } from "react";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns as accountColumns } from "./colomns";
import { categoryColumns } from "./category-colomns";
import { Skeleton } from "@/components/ui/skeleton";

const AccountsPage = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  
  // Accounts hooks
  const newAccount = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  // Categories hooks
  const newCategory = useNewCategory();
  const deleteCategories = useBulkDeleteCategories();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];

  const isAccountsDisabled = accountsQuery.isLoading || deleteAccounts.isPending;
  const isCategoriesDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if (accountsQuery.isLoading || categoriesQuery.isLoading) {
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

  return (
    <div className="max-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts & Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <Wallet className="size-4" />
                Accounts
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tags className="size-4" />
                Categories
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={newAccount.onOpen} size="sm">
                  <Plus className="size-4 mr-2" />
                  Add Account
                </Button>
              </div>
          <DataTable
                columns={accountColumns}
            data={accounts}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
                disabled={isAccountsDisabled}
          />
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={newCategory.onOpen} size="sm">
                  <Plus className="size-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <DataTable
                columns={categoryColumns}
                data={categories}
                filterKey="name"
                onDelete={(row) => {
                  const ids = row.map((r) => r.original.id);
                  deleteCategories.mutate({ ids });
                }}
                disabled={isCategoriesDisabled}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
