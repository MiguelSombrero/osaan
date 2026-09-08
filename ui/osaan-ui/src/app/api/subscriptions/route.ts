import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { subscriptionDraftSchema } from '@/lib/validation/schemas/subscription.schema';
import type { Subscription } from '@/types/subscription';

export async function GET() {
  try {
    const data = await fetchWithAuth<Subscription[]>(
      config.competenceMatchingApiUrl,
      '/v1/subscriptions'
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions', details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.json().catch(() => null);
  const parsed = subscriptionDraftSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const created = await fetchWithAuth<Subscription>(
      config.competenceMatchingApiUrl,
      '/v1/subscriptions',
      {
        method: 'POST',
        body: JSON.stringify({ skill: parsed.data.skill, rating: parsed.data.rating }),
      }
    );
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to create subscription', details: message },
      { status: 500 }
    );
  }
}
