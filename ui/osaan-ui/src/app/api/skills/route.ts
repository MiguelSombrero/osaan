import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/session';

const SKILL_CATALOG_API_URL =
  process.env.SKILL_CATALOG_API_URL || 'http://localhost:8092';

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
    const url = `${SKILL_CATALOG_API_URL}/v1/admin/skills${
      queryString ? `?${queryString}` : ''
    }`;

    const accessToken = await getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch skills', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
