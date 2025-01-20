import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Layout from '../components/Layout'
import CustomCodeEditor from '../components/CustomCodeEditor'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [code, setCode] = useState<string>('// Write your code here')
  const [output, setOutput] = useState<string>('')
  const [language, setLanguage] = useState<string>('javascript')
  const [title, setTitle] = useState<string>('')
  const [consoleInput, setConsoleInput] = useState<string>('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      fetchSnippet(router.query.id as string)
    }
  }, [router.query.id])

  const fetchSnippet = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/snippet/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const snippet = await response.json()
        setCode(snippet.code)
        setLanguage(snippet.language)
        setTitle(snippet.title)
      }
    } catch (error) {
      console.error('Error fetching snippet:', error)
      toast({
        title: "Error",
        description: "Failed to fetch snippet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const runCode = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ language, code, input: consoleInput })
      })
      const data = await response.json()
      setOutput(data.output)
    } catch (error) {
      console.error('Error running code:', error)
      toast({
        title: "Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      })
    }
  }, [language, code, consoleInput])

  const saveCode = useCallback(async () => {
    if (!user) {
      router.push('/login')
      return
    }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, language, code })
      })
      toast({
        title: "Success",
        description: "Code saved successfully",
      })
    } catch (error) {
      console.error('Error saving code:', error)
      toast({
        title: "Error",
        description: "Failed to save code. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, router, title, language, code])

  const shareCode = useCallback(async () => {
    if (!user) {
      router.push('/login')
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ snippetId: router.query.id })
      })
      const data = await response.json()
      toast({
        title: "Code Shared",
        description: `Share URL: ${data.shareUrl}`,
      })
    } catch (error) {
      console.error('Error sharing code:', error)
      toast({
        title: "Error",
        description: "Failed to share code. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, router])

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setCode(e.target.result as string)
        setTitle(file.name)
        setLanguage(file.name.split('.').pop() || 'javascript')
      }
    }
    reader.readAsText(file)
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Online Code Editor</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Snippet Title"
                className="flex-grow"
              />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[500px] border rounded-md overflow-hidden">
              <CustomCodeEditor
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                onSave={saveCode}
                onRun={runCode}
                onShare={shareCode}
                onLoad={handleFileUpload}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Console Input:</h2>
              <Textarea
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                className="w-full h-32"
                placeholder="Enter console input here..."
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Output:</h2>
              <Textarea
                value={output}
                readOnly
                className="w-full h-64 p-2 bg-gray-100 dark:bg-gray-800 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

