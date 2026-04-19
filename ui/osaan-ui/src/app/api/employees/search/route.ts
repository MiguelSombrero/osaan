import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = new URLSearchParams();

    const skillId = searchParams.get('skillId');
    const minRating = searchParams.get('minRating');

    if (skillId) queryParams.set('skillId', skillId);
    if (minRating) queryParams.set('minRating', minRating);

    const queryString = queryParams.toString();
    const endpoint = `/v1/matches${queryString ? `?${queryString}` : ''}`;

    const data = await fetchWithAuth(config.competenceMatchingApiUrl, endpoint);
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
