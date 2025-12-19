import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = new URLSearchParams();

    // Forward pagination and filter params
    const query = searchParams.get('query');
    const page = searchParams.get('page');
    const size = searchParams.get('size');
    const sort = searchParams.get('sort');

    if (query) queryParams.set('query', query);
    if (page) queryParams.set('page', page);
    if (size) queryParams.set('size', size);
    if (sort) queryParams.set('sort', sort);

    const queryString = queryParams.toString();
    const endpoint = `/v1/skills${queryString ? `?${queryString}` : ''}`;

    const data = await fetchWithAuth(config.skillCatalogApiUrl, endpoint);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to fetch skills', details: message },
      { status: 500 }
    );
  }
}
