import { NextResponse } from 'next/server';
import { initiatePasswordReset } from '@/lib/auth/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = await initiatePasswordReset(email);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('[/api/auth/forgot-password] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing password reset.' },
      { status: 500 }
    );
  }
}
