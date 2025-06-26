import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { plaidClient } from '@/lib/plaid';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const createTokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: 'FinanceFlow',
      products: ['transactions'] as any,
      country_codes: ['US'] as any,
      language: 'en',
      account_filters: {
        depository: {
          account_subtypes: ['checking', 'savings'] as any,
        },
      },
    });

    return NextResponse.json({
      link_token: createTokenResponse.data.link_token,
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
} 