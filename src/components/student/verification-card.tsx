"use client"

import { useState } from "react"
import type { Student } from "@/types"
import { getPhotoUrl } from "@/lib/supabase"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Modal } from "../ui/modal"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface VerificationCardProps {
  student: Student
  onVerify: () => void
  onReport: () => void
}

export function VerificationCard({ student, onVerify, onReport }: VerificationCardProps) {
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<"verify" | "report" | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const photoUrl = getPhotoUrl(student.tokenNumber)

  const handleVerify = async () => {
    try {
      setLoading(true)
      setAction("verify")
      setError(null)

      const response = await fetch("/api/students/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenNumber: student.tokenNumber,
          status: "Verified",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to verify")
      }

      setIsSuccessModalOpen(true)
      onVerify()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleReport = async () => {
    try {
      setLoading(true)
      setAction("report")
      setError(null)

      const response = await fetch("/api/students/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenNumber: student.tokenNumber,
          status: "Reported",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to report")
      }

      setIsReportModalOpen(true)
      onReport()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      {error && <div className="bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      <div className="p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-800">Student ID Card</h2>
          <p className="text-sm text-gray-500">Please verify your identity</p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative h-48 w-48 overflow-hidden rounded-lg border-4 border-blue-100">
            <img
              src={photoUrl || "/placeholder.svg"}
              alt={student.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
              }}
            />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          <p className="text-sm text-gray-500">Token: {student.tokenNumber}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading && action === "verify" ? (
              <LoadingSpinner className="mr-2 h-5 w-5" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            Yes, It's Me
          </button>
          <button
            onClick={handleReport}
            disabled={loading}
            className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading && action === "report" ? (
              <LoadingSpinner className="mr-2 h-5 w-5" />
            ) : (
              <XCircle className="mr-2 h-5 w-5" />
            )}
            No, It's Not Me
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title="Verification Successful">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Successfully Verified!</h3>
          <p className="mt-2 text-sm text-gray-500">Thank you for verifying your identity.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setIsSuccessModalOpen(false)
                window.location.href = "/"
              }}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Issue Reported">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Issue Reported</h3>
          <p className="mt-2 text-sm text-gray-500">We've recorded your report. Please contact us for assistance.</p>
          <div className="mt-6 space-y-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}?text=Issue%20with%20verification%20for%20token%20${student.tokenNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Contact via WhatsApp
            </a>
            <button
              onClick={() => {
                setIsReportModalOpen(false)
                window.location.href = "/verify"
              }}
              className="inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
