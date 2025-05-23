import { connectMongoDB, Task } from '../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectMongoDB();
    const tasks = await Task.find();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const task = new Task(data);
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}