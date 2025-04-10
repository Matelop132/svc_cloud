import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function registerUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword };

  const result = await db.collection('users').insertOne(user);
  return NextResponse.json({ status: 201, message: 'User registered', userId: result.insertedId });
}

export async function loginUser(email: string, password: string) {
  const user = await db.collection('users').findOne({ email });
  if (!user) return NextResponse.json({ status: 401, message: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ status: 401, message: 'Invalid password' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  return NextResponse.json({ status: 200, message: 'Login successful', token });
}

export async function getUser(userId: string) {
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  return user ? NextResponse.json({ status: 200, user }) : NextResponse.json({ status: 404, message: 'User not found' });
}
