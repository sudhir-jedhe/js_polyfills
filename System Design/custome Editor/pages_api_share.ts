import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'
import { nanoid } from 'nanoid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    const { snippetId } = req.body

    try {
      const snippet = await prisma.snippet.findUnique({
        where: { id: snippetId },
        include: { user: true },
      })

      if (!snippet || snippet.user.email !== session.user.email) {
        return res.status(404).json({ message: 'Snippet not found' })
      }

      const shareId = nanoid(10)
      await prisma.sharedSnippet.create({
        data: {
          shareId,
          snippet: { connect: { id: snippetId } },
        },
      })

      const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${shareId}`
      res.status(200).json({ shareUrl })
    } catch (error) {
      console.error('Error sharing snippet:', error)
      res.status(500).json({ message: 'Error sharing snippet' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

