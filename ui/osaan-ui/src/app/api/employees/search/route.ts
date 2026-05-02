import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = new URLSearchParams();

    const skillName = searchParams.get('skillName');
    const minRating = searchParams.get('minRating');

    if (skillName) queryParams.set('skillName', skillName);
    if (minRating) queryParams.set('rating', minRating);

    const queryString = queryParams.toString();
    const endpoint = `/v1/competences/search${queryString ? `?${queryString}` : ''}`;

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
