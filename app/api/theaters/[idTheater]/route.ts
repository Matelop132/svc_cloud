import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

export async function GET(request: Request, context: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = await context.params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });

    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const theaterData = await request.json();

    const result = await db.collection('theaters').insertOne(theaterData);

    return NextResponse.json({ 
      status: 201, 
      message: 'Theater added successfully', 
      data: { _id: result.insertedId, ...theaterData } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = await context.params;
    const theaterData = await request.json();

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('theaters').updateOne(
      { _id: new ObjectId(idTheater) },
      { $set: theaterData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Theater updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ idTheater: string }> }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = await context.params;

    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Theater deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
