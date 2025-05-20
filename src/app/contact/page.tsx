
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MessageSquare, Mail, AlertTriangle, XCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactClick = (type: "whatsapp" | "email") => {
    setLoading(true);
    setError(null);

    try {
      if (type === "whatsapp") {
        const phoneNumber = "+919526726801"; // Replace with actual WhatsApp number
        const message = encodeURIComponent("Reporting issue with student verification");
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.location.href = whatsappUrl;
      } else if (type === "email") {
        const subject = encodeURIComponent("Student Verification Issue Report");
        const body = encodeURIComponent("Please describe the issue with student verification.");
        const mailtoLink = `mailto:nusafaizabad@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
      }

      // Reset loading after a short delay to allow app to open
      setTimeout(() => setLoading(false), 1000);
    } catch (err) {
      setError(`Failed to open ${type} contact method. Please try again or use another option.`);
      setLoading(false);
    }
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 animate-fadeIn">
          {/* Header */}
          <div className="bg-indigo-700 p-5 text-white flex items-center justify-center gap-3">
            <MessageSquare className="w-7 h-7" />
            <h1 className="text-2xl font-bold">Contact Support</h1>
          </div>

          <div className="p-6 sm:p-8">
            {/* Instructions */}
            <p className="text-gray-600 text-center mb-6">
              To report an issue with student verification, please choose a contact method below.
            </p>

            {/* Contact Options */}
            <div className="space-y-4">
              {/* WhatsApp Button */}
              <button
                onClick={() => handleContactClick("whatsapp")}
                className="w-full flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                disabled={loading}
                aria-label="Contact via WhatsApp"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <MessageSquare className="w-5 h-5 mr-2" />
                )}
                {loading ? "Opening..." : "Contact via WhatsApp"}
              </button>

              {/* Phone Button */}
              <a
                href="tel:+916238661924" // Replace with actual phone number
                className="w-full flex items-center justify-center bg-indigo-700 text-white px-5 py-3 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Call support"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Support
              </a>

              {/* Email Button */}
              <button
                onClick={() => handleContactClick("email")}
                className="w-full flex items-center justify-center bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                disabled={loading}
                aria-label="Contact via Email"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800 mr-2"></div>
                ) : (
                  <Mail className="w-5 h-5 mr-2" />
                )}
                {loading ? "Opening..." : "Contact via Email"}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mt-6 flex items-start"
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

            {/* Contact Details */}
            <div className="mt-6 text-center text-gray-600">
              <p>
                WhatsApp/Phone:{" "}
                <a
                  href="tel:+919526726801"
                  className="text-indigo-700 hover:text-indigo-900 underline"
                  aria-label="Phone number"
                >
                  +919526726801
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:nusafaizabad@gmail.com"
                  className="text-indigo-700 hover:text-indigo-900 underline"
                  aria-label="Email address"
                >
                  nusafaizabad@gmail.com
                </a>
              </p>
            </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}