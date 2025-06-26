import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { plaidClient } from '@/lib/plaid';
import { db } from '@/db/drizzle';
import { transactions, accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { pgTable, text } from 'drizzle-orm/pg-core';

// Inline definition for connected_banks
const connectedBanks = pgTable('connected_banks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  accessToken: text('access_token').notNull(),
  itemId: text('item_id').notNull(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Plaid access token for this user
    const [bank] = await db.select().from(connectedBanks).where(eq(connectedBanks.userId, user.id));
    if (!bank) {
      return NextResponse.json({ error: 'No connected bank found' }, { status: 404 });
    }

    // Fetch transactions from Plaid
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 2); // last 2 months
    const plaidRes = await plaidClient.transactionsGet({
      access_token: bank.accessToken,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: now.toISOString().slice(0, 10),
      options: { count: 100, offset: 0 },
    });

    // Filter for credit and depository accounts
    const accountsToSync = plaidRes.data.accounts.filter(
      (acc) => acc.type === 'credit' || acc.type === 'depository'
    );
    const accountIdsToSync = accountsToSync.map((acc) => acc.account_id);
    const plaidTransactions = plaidRes.data.transactions.filter((tx) =>
      accountIdsToSync.includes(tx.account_id)
    );

    // Upsert accounts if not already present
    for (const acc of accountsToSync) {
      const existing = await db.select().from(accounts).where(eq(accounts.plaidId, acc.account_id));
      if (existing.length === 0) {
        await db.insert(accounts).values({
          id: randomUUID(),
          plaidId: acc.account_id,
          name: acc.name,
          userId: user.id,
        });
      }
    }

    // Insert new transactions
    let added = 0;
    for (const tx of plaidTransactions) {
      // Find the local account id
      const [localAccount] = await db.select().from(accounts).where(eq(accounts.plaidId, tx.account_id));
      if (!localAccount) continue;
      // Check if transaction already exists (by Plaid transaction_id in notes)
      const existing = await db.select().from(transactions).where(eq(transactions.notes, tx.transaction_id));
      if (existing.length === 0) {
        await db.insert(transactions).values({
          id: randomUUID(),
          amount: Math.round(tx.amount * 100),
          payee: tx.name,
          notes: tx.transaction_id, // store Plaid transaction_id in notes
          date: new Date(tx.date),
          accountId: localAccount.id,
        });
        added++;
      }
    }

    return NextResponse.json({ success: true, added });
  } catch (error: any) {
    console.error('Error syncing transactions:', error);
    const errorMessage = error.response?.data?.error_message || error.message || 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to sync transactions: ${errorMessage}` }, { status: 500 });
  }
}