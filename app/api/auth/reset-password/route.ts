import { NextResponse } from 'next/server';
import { completePasswordReset } from '@/lib/auth/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, login, newPassword } = body;

    if (!key || !login || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Key, login, and new password are required.' },
        { status: 400 }
      );
    }

    const result = await completePasswordReset(key, login, newPassword);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('[/api/auth/reset-password] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing password reset.' },
      { status: 500 }
    );
  }
}
