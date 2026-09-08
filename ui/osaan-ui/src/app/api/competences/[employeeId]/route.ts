import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { createCompetencesBodySchema } from '@/lib/validation/schemas/competence.schema';

export async function GET(
  _request: NextRequest,
  _context: { params: Promise<{ employeeId: string }> }
) {
  try {
    const data = await fetchWithAuth(
      config.competenceProfileApiUrl,
      `/v1/competences`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching competence profile:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to fetch competence profile', details: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  _context: { params: Promise<{ employeeId: string }> }
) {
  const rawBody = await request.json().catch(() => null);
  const parsed = createCompetencesBodySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWithAuth(
      config.competenceProfileApiUrl,
      `/v1/competences`,
      {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating competences:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to create competences', details: message },
      { status: 500 }
    );
  }
}
