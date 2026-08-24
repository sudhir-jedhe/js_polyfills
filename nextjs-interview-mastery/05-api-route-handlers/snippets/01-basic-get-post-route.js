// app/api/tasks/route.js
// A minimal GET (list) + POST (create) Route Handler.

let tasks = [{ id: 1, title: 'Write docs', done: false }];

export async function GET() {
  return Response.json(tasks);
}

export async function POST(request) {
  const body = await request.json();

  if (!body.title || typeof body.title !== 'string') {
    return Response.json(
      { error: 'title is required and must be a string' },
      { status: 400 }
    );
  }

  const task = { id: tasks.length + 1, title: body.title, done: false };
  tasks.push(task);

  return Response.json(task, { status: 201 });
}
