// app/todos/actions.ts — Server Action module
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } })
  revalidatePath('/todos')
}

// app/todos/page.tsx — Server Component
import { deleteTodo } from './actions'
import { TodoRow } from './TodoRow'

export default async function TodosPage() {
  const todos = await db.todo.findMany()

  return (
    <ul>
      {todos.map((todo) => (
        // Passing a Server Action reference as a prop — this DOES cross
        // the serialization boundary, unlike a plain function.
        <TodoRow key={todo.id} todo={todo} onDelete={deleteTodo} />
      ))}
    </ul>
  )
}

// app/todos/TodoRow.tsx — Client Component
;('use client')

export function TodoRow({
  todo,
  onDelete,
}: {
  todo: { id: string; title: string }
  onDelete: (id: string) => Promise<void>
}) {
  return (
    <li>
      {todo.title}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  )
}
