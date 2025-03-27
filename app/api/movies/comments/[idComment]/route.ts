// app/api/movies/comments/[idComment]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix'); 
    const { idComment } = params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid comment ID',
        error: 'ID format is incorrect'
      });
    }

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });

    if (!comment) {
      return NextResponse.json({
        status: 404,
        message: 'Comment not found',
        error: 'No comment found with the given ID'
      });
    }

    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix'); 
    const body = await request.json();
    const { movieId, userId, commentText } = body;

    if (!movieId || !userId || !commentText) {
      return NextResponse.json({
        status: 400,
        message: 'Missing required fields',
        error: 'movieId, userId, and commentText are required'
      });
    }

    const comment = {
      movieId,
      userId,
      commentText,
      createdAt: new Date()
    };

    const result = await db.collection('comments').insertOne(comment);

    return NextResponse.json({
      status: 201,
      message: 'Comment added successfully',
      data: { commentId: result.insertedId }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

export async function PUT(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix'); 
    const { idComment } = params;
    const body = await request.json();
    const { commentText } = body;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid comment ID',
        error: 'ID format is incorrect'
      });
    }

    const updateData = { commentText, updatedAt: new Date() };
    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Comment not found',
        error: 'No comment found with the given ID'
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Comment updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { idComment: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix'); 
    const { idComment } = params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid comment ID',
        error: 'ID format is incorrect'
      });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Comment not found',
        error: 'No comment found with the given ID'
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
