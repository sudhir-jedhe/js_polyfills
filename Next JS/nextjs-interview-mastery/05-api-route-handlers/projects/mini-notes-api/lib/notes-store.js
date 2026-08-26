// In-memory data store for the mini-notes-api demo.
// Not persistent, not concurrency-safe across serverless instances —
// intentionally simple so the Route Handler logic is the focus.

let notes = [
  { id: 1, title: 'Welcome', body: 'This is your first note.', createdAt: new Date().toISOString() },
];
let nextId = 2;

export function listNotes() {
  return notes;
}

export function getNote(id) {
  return notes.find((n) => n.id === id) ?? null;
}

export function createNote({ title, body }) {
  const note = {
    id: nextId++,
    title,
    body: body ?? '',
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  return note;
}

export function updateNote(id, updates) {
  const note = getNote(id);
  if (!note) return null;

  if (typeof updates.title === 'string') note.title = updates.title;
  if (typeof updates.body === 'string') note.body = updates.body;

  return note;
}

export function deleteNote(id) {
  const before = notes.length;
  notes = notes.filter((n) => n.id !== id);
  return notes.length < before;
}
