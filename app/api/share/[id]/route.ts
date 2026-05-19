import { NextRequest, NextResponse } from 'next/server';
import { get, isValidId } from '../store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const data = await get(id);
  if (data === null) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
