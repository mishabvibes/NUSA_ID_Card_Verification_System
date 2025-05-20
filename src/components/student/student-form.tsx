"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Student } from "@/types"
import { LoadingSpinner } from "../ui/loading-spinner"

interface StudentFormProps {
  student?: Student
  onSuccess: () => void
  onCancel: () => void
}

export function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const [tokenNumber, setTokenNumber] = useState(student?.tokenNumber.toString() || "")
  const [name, setName] = useState(student?.name || "")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    student
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/students/${student.tokenNumber}.jpg`
      : null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!tokenNumber || !name) {
      setError("Token number and name are required")
      return
    }

    if (!student && !photo) {
      setError("Photo is required for new students")
      return
    }

    try {
      setLoading(true)

      // Create or update student
      const studentResponse = student
        ? await fetch(`/api/students/${student.tokenNumber}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              tokenNumber: Number.parseInt(tokenNumber),
            }),
          })
        : await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tokenNumber: Number.parseInt(tokenNumber),
              name,
            }),
          })

      if (!studentResponse.ok) {
        const data = await studentResponse.json()
        throw new Error(data.error || "Failed to save student")
      }

      // Upload photo if provided
      if (photo) {
        const formData = new FormData()
        formData.append("tokenNumber", tokenNumber)
        formData.append("file", photo)

        const photoResponse = await fetch("/api/upload/photo", {
          method: "POST",
          body: formData,
        })

        if (!photoResponse.ok) {
          const data = await photoResponse.json()
          throw new Error(data.error || "Failed to upload photo")
        }
      }

      onSuccess()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}

      <div>
        <label htmlFor="tokenNumber" className="block text-sm font-medium text-gray-700">
          Token Number
        </label>
        <input
          type="number"
          id="tokenNumber"
          value={tokenNumber}
          onChange={(e) => setTokenNumber(e.target.value)}
          disabled={!!student}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-1 flex items-center space-x-4">
          {photoPreview ? (
            <div className="relative h-32 w-32 overflow-hidden rounded-md border">
              <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-md border bg-gray-100">
              <span className="text-sm text-gray-500">No photo</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {photoPreview ? "Change Photo" : "Upload Photo"}
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <LoadingSpinner className="h-5 w-5" /> : student ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}
