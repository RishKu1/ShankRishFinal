import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/db/drizzle';
import { connectedBanks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }
    const [bank] = await db.select().from(connectedBanks).where(eq(connectedBanks.userId, user.id));
    return NextResponse.json({ connected: !!bank });
  } catch (error) {
    return NextResponse.json({ connected: false }, { status: 500 });
  }
} 