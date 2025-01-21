import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { logSecurityEvent } from "../../lib/securityMonitoring"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name.replace(/\s/g, "-")
  const ext = filename.split(".").pop()

  // Check file type
  const allowedTypes = ["jpg", "jpeg", "png", "pdf"]
  if (!allowedTypes.includes(ext?.toLowerCase() || "")) {
    logSecurityEvent("Invalid File Type Upload Attempt", { filename })
    return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 })
  }

  // Check file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (buffer.length > maxSize) {
    logSecurityEvent("Oversized File Upload Attempt", { filename, size: buffer.length })
    return NextResponse.json({ success: false, error: "File too large" }, { status: 400 })
  }

  try {
    const path = join(process.cwd(), "public/uploads", filename)
    await writeFile(path, buffer)
    logSecurityEvent("File Upload Successful", { filename })
    return NextResponse.json({ success: true, filename })
  } catch (error) {
    console.error("Error saving file:", error)
    logSecurityEvent("File Upload Failed", { filename, error: (error as Error).message })
    return NextResponse.json({ success: false, error: "Error saving file" }, { status: 500 })
  }
}

