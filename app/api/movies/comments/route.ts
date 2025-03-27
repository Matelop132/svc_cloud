// app/api/movies/comments/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient } from 'mongodb';

export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const comments = await db.collection('comments').find({}).toArray();

    return NextResponse.json({
      status: 200,
      data: comments
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
