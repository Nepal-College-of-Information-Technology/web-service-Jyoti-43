import { connectMongoDB, Task } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const task = await Task.findByIdAndUpdate(params.id, data, { new: true });
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const task = await Task.findByIdAndDelete(params.id);
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}