import { NextApiRequest, NextApiResponse } from 'next'
import { VM } from 'vm2'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { language, code, input } = req.body

  if (!language || !code) {
    return res.status(400).json({ message: 'Language and code are required' })
  }

  try {
    let output = ''
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: (...args: any[]) => {
            output += args.join(' ') + '\n'
          },
        },
        input: input,
      },
    })

    // Wrap the code in a try-catch block to capture runtime errors
    const wrappedCode = `
      try {
        ${code}
      } catch (error) {
        console.log('Runtime error:', error.message);
      }
    `

    vm.run(wrappedCode)

    res.status(200).json({ output })
  } catch (error) {
    console.error('Error executing code:', error)
    res.status(500).json({ message: 'Error executing code', error: error.message })
  }
}

