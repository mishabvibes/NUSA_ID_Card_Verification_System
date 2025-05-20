import { type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tNo: string }> }
) {
  const resolvedParams = await params
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    return new Response("Supabase URL not configured", { status: 500 })
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/students/${resolvedParams.tNo}.jpg`
  return Response.redirect(publicUrl)
} 