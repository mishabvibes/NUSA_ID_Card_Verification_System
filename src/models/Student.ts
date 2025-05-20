import mongoose from "mongoose"

// Drop existing indexes if they exist
mongoose.connection.on('connected', async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection('students').dropIndexes()
    }
  } catch (error) {
    console.log('No indexes to drop or error dropping indexes:', error)
  }
})

const studentSchema = new mongoose.Schema({
  tNo: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
})

// Delete the model if it exists to prevent the "Cannot overwrite model once compiled" error
if (mongoose.models.Student) {
  delete mongoose.models.Student
}

const Student = mongoose.model("Student", studentSchema)

export default Student
