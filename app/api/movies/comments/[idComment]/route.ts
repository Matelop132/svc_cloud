import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

export async function GET(request: Request, context: { params: Promise<{ idComment: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = await context.params; 

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function POST(request: Request, context: { params: Promise<{ idMovie: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = await context.params;
    const body = await request.json();
    const { text, user } = body;

    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    if (!text || !user) {
      return NextResponse.json({ status: 400, message: 'Missing required fields', error: 'Text and user are required' });
    }

    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }

    const comment = {
      movieId: new ObjectId(idMovie),
      text,
      user,
      createdAt: new Date(),
    };

    const result = await db.collection('comments').insertOne(comment);

    return NextResponse.json({ 
      status: 201, 
      message: 'Comment added successfully', 
      data: { _id: result.insertedId, ...comment } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ idComment: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = await context.params;
    const body = await request.json();
    const { text } = body;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    if (!text) {
      return NextResponse.json({ status: 400, message: 'Missing required field', error: 'Text is required' });
    }

    const updatedComment = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment) },
      { $set: { text, updatedAt: new Date() } }
    );

    return NextResponse.json({ status: 200, message: 'Comment updated successfully', data: updatedComment });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ idComment: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = await context.params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
