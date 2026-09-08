import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { getSkillsParamsSchema } from '@/lib/validation/schemas/skill.schema';

export async function GET(request: NextRequest) {
  const raw = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = getSkillsParamsSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const queryParams = new URLSearchParams();
    if (parsed.data.query) queryParams.set('query', parsed.data.query);
    if (parsed.data.page !== undefined) queryParams.set('page', String(parsed.data.page));
    if (parsed.data.size !== undefined) queryParams.set('size', String(parsed.data.size));
    if (parsed.data.sort) queryParams.set('sort', parsed.data.sort);

    const queryString = queryParams.toString();
    const endpoint = `/v1/skills${queryString ? `?${queryString}` : ''}`;

    const data = await fetchWithAuth(config.skillCatalogApiUrl, endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to fetch skills', details: message },
      { status: 500 }
    );
  }
}
