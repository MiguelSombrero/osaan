import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { employeeSearchQuerySchema } from '@/lib/validation/schemas/manager.schema';

export async function GET(request: NextRequest) {
  const raw = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = employeeSearchQuerySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const queryParams = new URLSearchParams({
      skillName: parsed.data.skillName,
      rating: String(parsed.data.minRating),
    });
    const endpoint = `/v1/competences/search?${queryParams.toString()}`;

    const data = await fetchWithAuth(config.competenceProfileApiUrl, endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching employees:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to search employees', details: message },
      { status: 500 }
    );
  }
}
