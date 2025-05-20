"use client"

import { useState } from "react"

export default function CSVUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    errorCount: number;
    errors?: string[];
    debug?: any;
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(false)
      setUploadResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)
    setSuccess(false)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/students/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error + 
          (data.debug ? `\n\nDebug info:\n${JSON.stringify(data.debug, null, 2)}` : '')
        )
      }

      setSuccess(true)
      setUploadResult(data)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process CSV file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">CSV Upload</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">
                CSV should have these columns:
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="text-sm text-gray-700">tokenNumber,name</pre>
              </div>
              <p className="text-sm text-gray-500">
                Example:
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="text-sm text-gray-700">
                  tokenNumber,name{'\n'}
                  123,John Doe{'\n'}
                  124,Jane Smith
                </pre>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md whitespace-pre-wrap">
              {error}
            </div>
          )}

          {success && uploadResult && (
            <div className="space-y-3">
              <div className="text-green-500 text-sm p-3 bg-green-50 rounded-md">
                CSV file processed successfully!
              </div>
              <div className="text-sm">
                <p>Successfully added: {uploadResult.successCount} students</p>
                {uploadResult.errorCount > 0 && (
                  <p className="text-red-500">Failed to add: {uploadResult.errorCount} students</p>
                )}
              </div>
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="text-sm">
                  <p className="font-medium mb-2">Errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-500">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {uploadResult.debug && (
                <div className="text-sm mt-4">
                  <p className="font-medium mb-2">Debug Information:</p>
                  <pre className="bg-gray-50 p-3 rounded-md overflow-auto">
                    {JSON.stringify(uploadResult.debug, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Upload"
            )}
          </button>
        </form>
      </div>
    </div>
  )
} 