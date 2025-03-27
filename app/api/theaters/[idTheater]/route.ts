// app/api/theaters/[idTheater]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid theater ID',
        error: 'ID format is incorrect'
      });
    }

    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({
        status: 404,
        message: 'Theater not found',
        error: 'No theater found with the given ID'
      });
    }

    return NextResponse.json({ status: 200, data: { theater } });
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
    const { name, location } = body;

    if (!name || !location) {
      return NextResponse.json({
        status: 400,
        message: 'Missing required fields',
        error: 'name and location are required'
      });
    }

    const theater = {
      name,
      location,
      createdAt: new Date()
    };

    const result = await db.collection('theaters').insertOne(theater);

    return NextResponse.json({
      status: 201,
      message: 'Theater added successfully',
      data: { theaterId: result.insertedId }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

export async function PUT(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;
    const body = await request.json();
    const { name, location } = body;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid theater ID',
        error: 'ID format is incorrect'
      });
    }

    const updateData = { name, location, updatedAt: new Date() };
    const result = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Theater not found',
        error: 'No theater found with the given ID'
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Theater updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}

export async function DELETE(request: Request, { params }: { params: { idTheater: string } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({
        status: 400,
        message: 'Invalid theater ID',
        error: 'ID format is incorrect'
      });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: 404,
        message: 'Theater not found',
        error: 'No theater found with the given ID'
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Theater deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}
