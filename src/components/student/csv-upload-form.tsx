"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { CSVUploadResult } from "@/types"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Upload, Check, AlertCircle, X } from "lucide-react"

export function CSVUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [overwrite, setOverwrite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CSVUploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a CSV file")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("overwrite", overwrite.toString())

      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload CSV")
      }

      const result = await response.json()
      setResult(result)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setFile(null)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Upload Student Data</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSV File</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <label
                  htmlFor="csv-file"
                  className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 px-6 py-4 transition-colors hover:border-blue-400"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      {file ? file.name : "Click to upload CSV file"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">CSV file with columns: T.No, Name</p>
                  </div>
                </label>
                <input
                  id="csv-file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="overwrite"
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="overwrite" className="ml-2 block text-sm text-gray-700">
              Overwrite existing students
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!file || loading}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-lg font-medium">Upload Results</h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-5 w-5 text-green-500" />
              <span>
                <span className="font-medium">{result.added}</span> students added
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-5 w-5 text-blue-500" />
              <span>
                <span className="font-medium">{result.updated}</span> students updated
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>
                <span className="font-medium">{result.skipped}</span> students skipped
              </span>
            </div>

            {result.errors.length > 0 && (
              <div className="mt-3 space-y-2">
                <h4 className="flex items-center text-sm font-medium text-red-600">
                  <X className="mr-1 h-4 w-4" />
                  Errors ({result.errors.length})
                </h4>
                <ul className="max-h-40 overflow-y-auto rounded-md bg-red-50 p-2 text-xs text-red-700">
                  {result.errors.map((error, index) => (
                    <li key={index} className="py-1">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
