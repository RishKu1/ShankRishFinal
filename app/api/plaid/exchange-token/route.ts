import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { plaidClient } from '@/lib/plaid';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { pgTable, text } from 'drizzle-orm/pg-core';

// Inline definition for connected_banks since it's not in the main schema file
const connectedBanks = pgTable('connected_banks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  accessToken: text('access_token').notNull(),
  itemId: text('item_id').notNull(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { public_token } = await request.json();

    if (!public_token) {
      return NextResponse.json({ error: 'Public token is required' }, { status: 400 });
    }

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Upsert the new bank connection for the user
    await db
      .insert(connectedBanks)
      .values({
        id: randomUUID(),
        userId: user.id,
        accessToken,
        itemId,
      })
      .onConflictDoUpdate({
        target: connectedBanks.userId,
        set: { accessToken, itemId },
      });

    return NextResponse.json({
      success: true,
      item_id: itemId,
    });
  } catch (error: any) {
    console.error('Error exchanging token:', error);
    return NextResponse.json(
      { error: `Failed to exchange token: ${error.message}` },
      { status: 500 }
    );
  }
} 