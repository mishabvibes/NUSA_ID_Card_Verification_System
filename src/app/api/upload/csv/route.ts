import { type NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"
import { parse } from "papaparse"

export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const formData = await req.formData()
    const file = formData.get("file") as File
    const overwrite = formData.get("overwrite") === "true"

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const fileContent = await file.text()

    const { data, errors } = parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (errors.length > 0) {
      return NextResponse.json({ error: "Error parsing CSV file", details: errors }, { status: 400 })
    }

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    }

    for (const row of data as any[]) {
      try {
        const tokenNumber = Number.parseInt(row["T.No"])
        const name = row["Name"]

        if (isNaN(tokenNumber) || !name) {
          results.errors.push(`Invalid row: ${JSON.stringify(row)}`)
          continue
        }

        const existingStudent = await Student.findOne({ tokenNumber })

        if (existingStudent) {
          if (overwrite) {
            await Student.updateOne({ tokenNumber }, { name, verificationStatus: "Pending" })
            results.updated++
          } else {
            results.skipped++
          }
        } else {
          await Student.create({
            tokenNumber,
            name,
            verificationStatus: "Pending",
          })
          results.added++
        }
      } catch (error) {
        console.error("Error processing row:", error)
        results.errors.push(`Error processing row: ${JSON.stringify(row)}`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error uploading CSV:", error)
    return NextResponse.json({ error: "Failed to upload CSV" }, { status: 500 })
  }
}
