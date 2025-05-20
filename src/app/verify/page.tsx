"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, CheckCircle, XCircle, UserCheck, AlertTriangle, RefreshCw, Mail } from "lucide-react";
import Image from "next/image";

interface Student {
  tNo: number;
  name: string;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  imageUrl?: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const [tokenNumber, setTokenNumber] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Enhanced input validation
  useEffect(() => {
    const isValid = tokenNumber === "" || (/^\d{1,10}$/.test(tokenNumber) && !tokenNumber.startsWith("0"));
    setIsValidInput(isValid);
  }, [tokenNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenNumber || !isValidInput) return;

    setLoading(true);
    setError(null);
    setStudent(null);
    setShowIdCard(false);
    setImageError(false);

    try {
      const response = await fetch(`/api/students?tNo=${encodeURIComponent(tokenNumber)}`, {
        cache: "no-store", // Prevent caching for fresh data
      });
      if (!response.ok) {
        if (response.status === 404) throw new Error("Student not found");
        throw new Error("Server error, please try again later");
      }
      const data = await response.json();
      if (!data.students?.length) {
        throw new Error("No student found with this token number");
      }
      const studentData = data.students[0];
      studentData.imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/students-photo/${studentData.tNo}.jpg`;
      setStudent(studentData);
      setShowIdCard(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!student) return;

    setLoading(true);
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tNo: student.tNo,
          name: student.name,
          verificationStatus: "Verified",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify student");
      }

      setSuccessMessage("Student verified successfully");
      setShowSuccessPopup(true);

      // Increased redirect timeout for better UX
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify student");
      setShowContactPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!student) return;

    setLoading(true);
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tNo: student.tNo,
          name: student.name,
          verificationStatus: "Rejected",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to report student");
      }

      // Redirect to contact page after successful report
      router.push("/contact");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report student");
      setShowContactPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setStudent(null);
    setShowIdCard(false);
    setError(null);
    // Keep tokenNumber for retry convenience
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Back Link */}
        <Link
          href="/"
          className="group inline-flex items-center text-indigo-700 hover:text-indigo-900 transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-indigo-700 p-5 text-white flex items-center justify-center gap-3">
            <UserCheck className="w-7 h-7" />
            <h1 className="text-2xl font-bold">Student Verification</h1>
          </div>

          <div className="p-6 sm:p-8">
            {/* Search Form */}
            {!showIdCard && (
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative mb-3">
                  <label htmlFor="token-input" className="sr-only">
                    Token Number
                  </label>
                  <input
                    id="token-input"
                    type="text"
                    value={tokenNumber}
                    onChange={(e) => setTokenNumber(e.target.value)}
                    placeholder="Enter token number"
                    className={`w-full pl-4 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 placeholder-gray-400 ${
                      isValidInput ? "border-gray-200" : "border-red-500"
                    }`}
                    required
                    aria-invalid={!isValidInput}
                    aria-describedby="token-error"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-700 text-white p-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400"
                    disabled={loading || !isValidInput || !tokenNumber}
                    aria-label="Search student"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {!isValidInput && (
                  <p id="token-error" className="text-red-600 text-sm mt-1 ml-2">
                    Please enter a valid token number (1-10 digits, no leading zeros)
                  </p>
                )}
              </form>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-700 mb-4"></div>
                <span className="text-gray-600 font-medium">Processing...</span>
              </div>
            )}

            {/* Error Message */}
            {error && !showContactPopup && (
              <div
                className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mb-6 flex items-start"
                role="alert"
              >
                <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  aria-label="Dismiss error"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Student ID Card */}
            {student && showIdCard && !showSuccessPopup && !showContactPopup && (
              <div className="animate-slideIn">
                {imageError ? (
                  <div className="p-8 text-center text-red-600 font-semibold">
                    Image not found. Redirecting to contact page...
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 ${
                          student.verificationStatus === "Verified"
                            ? "bg-green-100 text-green-800"
                            : student.verificationStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.verificationStatus === "Verified" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : student.verificationStatus === "Rejected" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        {student.verificationStatus}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 flex flex-col items-center">
                      {/* Photo */}
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-200 mb-5">
                        <Image
                          src={student.imageUrl || "/placeholder.jpg"}
                          alt={`${student.name}'s photo`}
                          fill
                          className="object-cover"
                          priority
                          onError={() => {
                            setImageError(true);
                            setTimeout(() => router.push("/contact"), 2000);
                          }}
                        />
                      </div>

                      {/* Student Info */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{student.name}</h2>
                      <div className="bg-indigo-100 text-indigo-800 text-center py-1.5 px-5 text-sm font-semibold rounded-full mb-6">
                        Token: {student.tNo}
                      </div>

                      {/* Action Buttons */}
                      {student.verificationStatus === "Pending" && (
                        <div className="flex w-full gap-4 mt-3">
                          <button
                            onClick={handleVerify}
                            className="flex-1 flex items-center justify-center bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                            disabled={loading}
                            aria-label="Verify student"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Verify
                          </button>
                          <button
                            onClick={handleReport}
                            className="flex-1 flex items-center justify-center bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                            disabled={loading}
                            aria-label="Report student"
                          >
                            <XCircle className="w-5 h-5 mr-2" />
                            Report
                          </button>
                        </div>
                      )}

                      {student.verificationStatus === "Verified" && (
                        <button
                          onClick={handleReport}
                          className="w-full flex items-center justify-center bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                          disabled={loading}
                          aria-label="Mark student as invalid"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Mark as Invalid
                        </button>
                      )}

                      {student.verificationStatus === "Rejected" && (
                        <button
                          onClick={handleVerify}
                          className="w-full flex items-center justify-center bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                          disabled={loading}
                          aria-label="Mark student as valid"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Mark as Valid
                        </button>
                      )}

                      <button
                        onClick={resetSearch}
                        className="mt-4 flex items-center justify-center bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors w-full"
                        aria-label="Start new search"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        New Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
              <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                role="dialog"
                aria-labelledby="success-title"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 animate-fadeIn">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 id="success-title" className="text-2xl font-bold text-center mb-3">
                    Success!
                  </h3>
                  <p className="text-gray-600 text-center mb-6">{successMessage}</p>
                  <p className="text-gray-500 text-center text-sm">Redirecting to homepage...</p>
                </div>
              </div>
            )}

            {/* Contact Admin Popup */}
            {showContactPopup && (
              <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                role="dialog"
                aria-labelledby="error-title"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4">
                  <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-5">
                    <AlertTriangle className="w-12 h-12 text-red-600" />
                  </div>
                  <h3 id="error-title" className="text-2xl font-bold text-center mb-3">
                    Operation Failed
                  </h3>
                  <p className="text-gray-600 text-center mb-4">{error}</p>
                  <p className="text-gray-600 text-center mb-6">
                    Please contact the administrator for assistance.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="mailto:admin@example.com"
                      className="flex-1 flex items-center justify-center bg-indigo-700 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      aria-label="Contact administrator"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Admin
                    </Link>
                    <button
                      onClick={closeContactPopup}
                      className="flex-1 bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                      aria-label="Close error popup"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}