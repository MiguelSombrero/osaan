import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await fetchWithAuth(
      config.employeeApiUrl,
      '/v1/admin/employees',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to create employee', details: message },
      { status: 500 }
    );
  }
}
