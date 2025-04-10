import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function authMiddleware(request: Request, next: Function) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ status: 401, message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; 

    if (!decoded.userId) {
      return NextResponse.json({ status: 401, message: 'Invalid token structure' });
    }

    return next(decoded.userId);
  } catch {
    return NextResponse.json({ status: 401, message: 'Invalid token' });
  }
}
