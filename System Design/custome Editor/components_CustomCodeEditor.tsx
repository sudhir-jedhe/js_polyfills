import React, { useState, useRef, useEffect } from 'react'
import { Editor, EditorProps, OnMount, useMonaco } from '@monaco-editor/react'
import { Loader2, Save, Play, Share2, Download, Upload } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface CustomCodeEditorProps extends Omit<EditorProps, 'onMount'> {
  onMount?: OnMount
  onSave?: (value: string) => void
  onRun?: (value: string) => void
  onShare?: () => void
  onLoad?: (file: File) => void
}

const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  language = 'javascript',
  theme: initialTheme = 'vs-dark',
  value,
  onChange,
  onMount,
  onSave,
  onRun,
  onShare,
  onLoad,
  ...props
}) => {
  const [isReady, setIsReady] = useState(false)
  const [theme, setTheme] = useState(initialTheme)
  const [showMinimap, setShowMinimap] = useState(true)
  const editorRef = useRef<any>(null)
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
      // Set up linting for JavaScript
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })

      // Enable type checking for TypeScript
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2015,
        allowNonTsExtensions: true,
      })
    }
  }, [monaco])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        if (onSave && editorRef.current) {
          onSave(editorRef.current.getValue())
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSave])

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    setIsReady(true)
    if (onMount) {
      onMount(editor, monaco)
    }

    // Add custom actions
    editor.addAction({
      id: 'save-code',
      label: 'Save Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        if (onSave) {
          onSave(editor.getValue())
        }
      },
    })

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        if (onRun) {
          onRun(editor.getValue())
        }
      },
    })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const toggleMinimap = () => {
    setShowMinimap(!showMinimap)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onLoad) {
      onLoad(file)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
        <div className="flex items-center space-x-4">
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vs-dark">Dark</SelectItem>
              <SelectItem value="vs-light">Light</SelectItem>
              <SelectItem value="hc-black">High Contrast</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="minimap-toggle"
              checked={showMinimap}
              onCheckedChange={toggleMinimap}
            />
            <Label htmlFor="minimap-toggle">Minimap</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={() => onSave && onSave(editorRef.current?.getValue())}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={() => onRun && onRun(editorRef.current?.getValue())}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={() => editorRef.current?.getAction('editor.action.downloadEditor').run()}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".js,.py,.ts"
          />
        </div>
      </div>
      <div className="relative flex-grow">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: showMinimap },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 5,
            glyphMargin: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
          }}
          {...props}
        />
      </div>
    </div>
  )
}

export default CustomCodeEditor

