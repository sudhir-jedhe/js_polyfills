import { getNote, updateNote, deleteNote } from '@/lib/notes-store';

function parseId(params) {
  const id = Number(params.id);
  return Number.isInteger(id) ? id : null;
}

// GET /api/notes/:id -> fetch a single note
export async function GET(request, { params }) {
  const id = parseId(params);
  if (id === null) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  const note = getNote(id);
  if (!note) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }

  return Response.json(note);
}

// PUT /api/notes/:id -> update title/body
export async function PUT(request, { params }) {
  const id = parseId(params);
  if (id === null) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (
    (payload.title !== undefined && typeof payload.title !== 'string') ||
    (payload.body !== undefined && typeof payload.body !== 'string')
  ) {
    return Response.json(
      { error: 'title and body, if provided, must be strings' },
      { status: 400 }
    );
  }

  const updated = updateNote(id, payload);
  if (!updated) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }

  return Response.json(updated);
}

// DELETE /api/notes/:id -> remove a note
export async function DELETE(request, { params }) {
  const id = parseId(params);
  if (id === null) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  const deleted = deleteNote(id);
  if (!deleted) {
    return Response.json({ error: 'Note not found' }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
