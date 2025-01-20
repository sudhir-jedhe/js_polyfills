import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    // Save snippet
    const { title, language, code } = req.body

    try {
      const snippet = await prisma.snippet.create({
        data: {
          title,
          language,
          code,
          user: { connect: { email: session.user.email } },
        },
      })

      res.status(201).json(snippet)
    } catch (error) {
      console.error('Error saving snippet:', error)
      res.status(500).json({ message: 'Error saving snippet' })
    }
  } else if (req.method === 'GET') {
    // Get user's snippets
    try {
      const snippets = await prisma.snippet.findMany({
        where: {
          user: { email: session.user.email },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json(snippets)
    } catch (error) {
      console.error('Error fetching snippets:', error)
      res.status(500).json({ message: 'Error fetching snippets' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

