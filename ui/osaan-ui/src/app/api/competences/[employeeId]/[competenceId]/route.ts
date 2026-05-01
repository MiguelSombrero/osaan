import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

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
  try {
    const { competenceId } = await context.params;
    const body = await request.json();
    const data = await fetchWithAuth(
      config.competenceProfileApiUrl,
      `/v1/competences/${competenceId}`,
      { method: 'PATCH', body: JSON.stringify(body) }
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
