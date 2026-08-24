// app/actions/update-profile.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function updateProfile(userId: string, formData: FormData) {
  await db.user.update({
    where: { id: userId },
    data: { name: formData.get('name') as string },
  })

  revalidatePath(`/profile/${userId}`) // this route's Full Route Cache is invalidated
}

// app/profile/[id]/page.tsx
import { updateProfile } from '@/app/actions/update-profile'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id: params.id } })

  return (
    <form action={updateProfile.bind(null, params.id)}>
      <input name="name" defaultValue={user?.name} />
      <button type="submit">Save</button>
    </form>
  )
}
