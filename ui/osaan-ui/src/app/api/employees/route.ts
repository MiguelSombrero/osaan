import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchWithAuth } from '@/lib/server-api';
import { config } from '@/lib/config';
import { createEmployeeSchema } from '@/lib/validation/schemas/employee.schema';

export async function POST(request: NextRequest) {
  const rawBody = await request.json().catch(() => null);
  const parsed = createEmployeeSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: z.flattenError(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWithAuth(config.employeeApiUrl, '/v1/admin/employees', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Failed to create employee', details: message },
      { status: 500 }
    );
  }
}
