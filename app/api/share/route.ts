import { NextRequest, NextResponse } from 'next/server';
import { generateId, put } from './store';

const MAX_BYTES = 50_000;

export async function POST(request: NextRequest) {
  const body = await request.text();
  if (body.length === 0 || body.length > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Invalid payload size' },
      { status: 413 }
    );
  }
  try {
    JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400 });
  }

  const id = generateId();
  try {
    await put(id, body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Storage failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ id });
}
