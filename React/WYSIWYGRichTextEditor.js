"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/ui/icons"

const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']
const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72']

export default function WYSIWYGRichTextEditor() {
  const [html, setHtml] = useState('')
  const [showIframe, setShowIframe] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')
  const [iframeWidth, setIframeWidth] = useState('100%')
  const [iframeHeight, setIframeHeight] = useState('400px')
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [inlineToolbar, setInlineToolbar] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html
    }
  }, [])

  const handleChange = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      setHtml(newHtml)
      setUndoStack([...undoStack, newHtml])
      setRedoStack([])
    }
  }

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    handleChange()
  }

  const handleColorChange = (type: 'foreColor' | 'backColor', e: React.ChangeEvent<HTMLInputElement>) => {
    execCommand(type, e.target.value)
  }

  const insertTable = () => {
    const table = '<table border="1"><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>'
    execCommand('insertHTML', table)
  }

  const mergeCells = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const startCell = range.startContainer.parentElement
      const endCell = range.endContainer.parentElement
      if (startCell && endCell && startCell.tagName === 'TD' && endCell.tagName === 'TD') {
        const startRow = startCell.parentElement
        const endRow = endCell.parentElement
        if (startRow && endRow && startRow === endRow) {
          const colspan = endCell.cellIndex - startCell.cellIndex + 1
          startCell.setAttribute('colspan', colspan.toString())
          for (let i = startCell.cellIndex + 1; i <= endCell.cellIndex; i++) {
            startRow.deleteCell(startCell.cellIndex + 1)
          }
          handleChange()
        }
      }
    }
  }

  const insertIframe = () => {
    if (iframeUrl) {
      const iframe = `<iframe src="${iframeUrl}" width="${iframeWidth}" height="${iframeHeight}" frameborder="0"></iframe>`
      execCommand('insertHTML', iframe)
      setShowIframe(false)
    }
  }

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const current = undoStack.pop()
      if (current) {
        setRedoStack([...redoStack, current])
        const previous = undoStack[undoStack.length - 1]
        if (editorRef.current && previous) {
          editorRef.current.innerHTML = previous
          setHtml(previous)
        }
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack.pop()
      if (next && editorRef.current) {
        setUndoStack([...undoStack, next])
        editorRef.current.innerHTML = next
        setHtml(next)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          execCommand('insertImage', event.target.result.toString())
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      setSelectedImage(target as HTMLImageElement)
    } else {
      setSelectedImage(null)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className={`mb-4 space-y-2 ${inlineToolbar ? 'hidden' : ''}`}>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => execCommand('bold')}><Icons.bold className="h-4 w-4" /></Button>
          <Button onClick={() => execCommand('italic')}><Icons.italic className="h-4 w-4" /></Button>
          <Button onClick={() => execCommand('underline')}><Icons.underline className="h-4 w-4" /></Button>
          <Button onClick={() => execCommand('strikeThrough')}><Icons.strikethrough className="h-4 w-4" /></Button>
          <Button onClick={() => execCommand('insertOrderedList')}><Icons.listOrdered className="h-4 w-4" /></Button>
          <Button onClick={() => execCommand('insertUnorderedList')}><Icons.list className="h-4 w-4" /></Button>
          <Select onValueChange={(value) => execCommand('fontName', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => execCommand('fontSize', value)}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="color"
            onChange={(e) => handleColorChange('foreColor', e)}
            className="w-10 h-10 p-1 rounded"
            title="Text Color"
          />
          <Input
            type="color"
            onChange={(e) => handleColorChange('backColor', e)}
            className="w-10 h-10 p-1 rounded"
            title="Background Color"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => execCommand('insertImage', prompt('Enter image URL:'))}><Icons.image className="h-4 w-4" /></Button>
          <Button onClick={() => fileInputRef.current?.click()}><Icons.upload className="h-4 w-4" /></Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Button onClick={insertTable}><Icons.table className="h-4 w-4" /></Button>
          <Button onClick={mergeCells}><Icons.combine className="h-4 w-4" /></Button>
          <Dialog open={showIframe} onOpenChange={setShowIframe}>
            <DialogTrigger asChild>
              <Button><Icons.frame className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Iframe</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="iframe-url" className="text-right">URL</Label>
                  <Input
                    id="iframe-url"
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="iframe-width" className="text-right">Width</Label>
                  <Input
                    id="iframe-width"
                    value={iframeWidth}
                    onChange={(e) => setIframeWidth(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="iframe-height" className="text-right">Height</Label>
                  <Input
                    id="iframe-height"
                    value={iframeHeight}
                    onChange={(e) => setIframeHeight(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={insertIframe}>Insert</Button>
            </DialogContent>
          </Dialog>
          <Button onClick={handleUndo}><Icons.undo className="h-4 w-4" /></Button>
          <Button onClick={handleRedo}><Icons.redo className="h-4 w-4" /></Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="inline-mode"
              checked={inlineToolbar}
              onCheckedChange={setInlineToolbar}
            />
            <Label htmlFor="inline-mode">Inline Toolbar</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">HTML Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div
            ref={editorRef}
            contentEditable
            className="border p-4 min-h-[400px] focus:outline-none"
            onInput={handleChange}
            onClick={handleImageClick}
          />
        </TabsContent>
        <TabsContent value="preview">
          <pre className="border p-4 min-h-[400px] whitespace-pre-wrap">
            {html}
          </pre>
        </TabsContent>
      </Tabs>

      {selectedImage && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mt-4">Edit Image</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Image Size</h4>
                <p className="text-sm text-muted-foreground">Adjust the size of the selected image.</p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    defaultValue={selectedImage.width}
                    className="col-span-2 h-8"
                    type="number"
                    onChange={(e) => selectedImage.width = parseInt(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    defaultValue={selectedImage.height}
                    className="col-span-2 h-8"
                    type="number"
                    onChange={(e) => selectedImage.height = parseInt(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

