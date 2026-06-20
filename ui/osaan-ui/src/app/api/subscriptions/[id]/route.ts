import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await fetchWithAuth<void>(
      config.competenceMatchingApiUrl,
      `/v1/subscriptions/${id}`,
      { method: 'DELETE' }
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to delete subscription', details: message },
      { status: 500 }
    );
  }
}
