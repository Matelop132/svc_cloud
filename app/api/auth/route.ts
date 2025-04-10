import { NextResponse } from 'next/server';
import { registerUser, loginUser, getUser } from './authService';
import { authMiddleware } from './authMiddleware';

export async function POST(request: Request) {
  const { action, email, password } = await request.json();

  if (action === 'register') {
    return registerUser(email, password);
  } else if (action === 'login') {
    return loginUser(email, password);
  }

  return NextResponse.json({ status: 400, message: 'Invalid action' });
}

export async function GET(request: Request) {
  return authMiddleware(request, getUser);
}
