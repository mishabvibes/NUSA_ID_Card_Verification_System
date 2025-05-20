import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const tokenNumber = formData.get("tokenNumber") as string
    const file = formData.get("file") as File

    if (!tokenNumber || !file) {
      return NextResponse.json({ error: "Token number and file are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase
    const { data, error } = await supabase.storage.from("students_photo").upload(`${tokenNumber}.jpg`, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Photo uploaded successfully",
      path: data.path,
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}
