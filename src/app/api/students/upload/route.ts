import { NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"

export async function POST(request: NextRequest) {
  try {
    await connectMongo()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const text = await file.text()
    console.log("Raw CSV content:", text) // Debug log

    const rows = text.split("\n").map(row => row.trim()).filter(row => row.length > 0)
    console.log("Processed rows:", rows) // Debug log
    
    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSV file must contain at least a header row and one data row" },
        { status: 400 }
      )
    }

    // More lenient header matching
    const headers = rows[0].split(",").map(header => header.trim().toLowerCase())
    console.log("Headers found:", headers) // Debug log
    
    // Find the indices of required columns - more lenient matching
    const tokenNumberIndex = headers.findIndex(h => h.includes("token") || h.includes("tno"))
    const nameIndex = headers.findIndex(h => h.includes("name"))

    console.log("Column indices:", { tokenNumberIndex, nameIndex }) // Debug log

    if (tokenNumberIndex === -1 || nameIndex === -1) {
      return NextResponse.json(
        { 
          error: "CSV must contain columns for token number and name",
          foundHeaders: headers,
          debug: {
            rawHeaders: rows[0],
            processedHeaders: headers,
            tokenNumberFound: tokenNumberIndex !== -1,
            nameFound: nameIndex !== -1
          }
        },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(",").map(value => value.trim())
      console.log(`Row ${i} values:`, values) // Debug log
      
      const tokenNumber = values[tokenNumberIndex]
      const name = values[nameIndex]

      if (!tokenNumber || !name) {
        errors.push(`Row ${i + 1}: Missing token number or name`)
        continue
      }

      const tokenNumberInt = parseInt(tokenNumber)
      if (isNaN(tokenNumberInt)) {
        errors.push(`Row ${i + 1}: Invalid token number '${tokenNumber}'`)
        continue
      }

      try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ tNo: tokenNumberInt })
        if (existingStudent) {
          errors.push(`Row ${i + 1}: Student with token number ${tokenNumberInt} already exists`)
          continue
        }

        // Create new student with tNo field
        const studentData = {
          tNo: tokenNumberInt,
          name: name,
          verificationStatus: "Pending"
        }
        
        console.log(`Creating student with data:`, studentData)
        const student = await Student.create(studentData)
        console.log(`Successfully created student:`, student)
        results.push(student)
      } catch (error) {
        console.error(`Error creating student for row ${i + 1}:`, error)
        if (error instanceof Error) {
          const errorMessage = error.message
          if (errorMessage.includes('duplicate key error')) {
            errors.push(`Row ${i + 1}: Student with token number ${tokenNumberInt} already exists`)
          } else {
            errors.push(`Row ${i + 1}: ${errorMessage}`)
          }
        } else {
          errors.push(`Row ${i + 1}: Failed to create student`)
        }
      }
    }

    return NextResponse.json({ 
      message: "CSV processing completed",
      successCount: results.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      debug: {
        totalRows: rows.length,
        headerRow: rows[0],
        firstDataRow: rows[1] || 'No data rows',
        headers: headers,
        columnIndices: { tokenNumberIndex, nameIndex }
      }
    })
  } catch (error) {
    console.error("Error uploading students:", error)
    return NextResponse.json(
      { 
        error: "Failed to process CSV file",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 