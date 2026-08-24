// app/api/tasks/[id]/route.js
// Reading a dynamic route param and returning proper 404s.

let tasks = [{ id: 1, title: 'Write docs', done: false }];

export async function GET(request, { params }) {
  const id = Number(params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return Response.json({ error: 'Task not found' }, { status: 404 });
  }

  return Response.json(task);
}

export async function DELETE(request, { params }) {
  const id = Number(params.id);
  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    return Response.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks = tasks.filter((t) => t.id !== id);
  return new Response(null, { status: 204 });
}
