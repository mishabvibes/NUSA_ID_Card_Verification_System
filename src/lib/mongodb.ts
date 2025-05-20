import mongoose from "mongoose"
import Student from "@/models/Student"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    try {
      console.log("Connecting to MongoDB...")
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log("MongoDB connected successfully")
        return mongoose
      })
    } catch (error) {
      console.error("MongoDB connection error:", error)
      throw error
    }
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("Failed to connect to MongoDB:", e)
    throw e
  }

  return cached.conn
}

export async function getStudentByToken(tokenNumber: number) {
  await connectMongo()
  return Student.findOne({ tokenNumber })
}

export async function updateStudentStatus(tokenNumber: number, status: "Verified" | "Rejected") {
  await connectMongo()
  return Student.findOneAndUpdate(
    { tNo: tokenNumber },
    { verificationStatus: status },
    { new: true }
  )
}

export async function getAllStudents() {
  await connectMongo()
  return Student.find().sort({ tokenNumber: 1 })
}

export async function addStudent(student: { tokenNumber: number; name: string }) {
  await connectMongo()
  return Student.create({
    ...student,
    verificationStatus: "Pending",
  })
}

export async function deleteStudent(tokenNumber: number) {
  await connectMongo()
  return Student.findOneAndDelete({ tokenNumber })
}
