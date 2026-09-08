import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { updateCompetenceRatingBodySchema } from '@/lib/validation/schemas/competence.schema';

type Context = { params: Promise<{ employeeId: string; competenceId: string }> };

export async function DELETE(
  _request: NextRequest,
  context: Context
) {
  try {
    const { competenceId } = await context.params;
    await fetchWithAuth(
      config.competenceProfileApiUrl,
      `/v1/competences/${competenceId}`,
      { method: 'DELETE' }
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting competence:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to delete competence', details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  const rawBody = await request.json().catch(() => null);
  const parsed = updateCompetenceRatingBodySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const { competenceId } = await context.params;
    const data = await fetchWithAuth(
      config.competenceProfileApiUrl,
      `/v1/competences/${competenceId}`,
      { method: 'PATCH', body: JSON.stringify(parsed.data) }
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating competence rating:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to update competence', details: message },
      { status: 500 }
    );
  }
}
