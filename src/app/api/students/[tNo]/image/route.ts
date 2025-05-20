import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { tNo: string } }
) {
  try {
    const tNo = params.tNo
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!supabaseUrl) {
      throw new Error("Supabase URL not configured")
    }

    // Construct the public URL directly
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/students-photo/${tNo}.jpg`

    // Redirect to the Supabase public URL
    return NextResponse.redirect(publicUrl)
  } catch (error) {
    console.error("Error fetching student image:", error)
    return new NextResponse(null, { status: 404 })
  }
} 