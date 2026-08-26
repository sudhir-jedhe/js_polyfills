import { listNotes, createNote } from '@/lib/notes-store';

// GET /api/notes  -> list all notes
export async function GET() {
  return Response.json(listNotes());
}

// POST /api/notes -> create a note
// Body: { title: string, body?: string }
export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const { title, body } = payload ?? {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    return Response.json(
      { error: 'title is required and must be a non-empty string' },
      { status: 400 }
    );
  }

  const note = createNote({ title: title.trim(), body });
  return Response.json(note, { status: 201 });
}
