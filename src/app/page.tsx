import Link from "next/link"
import { ArrowRight, Shield, CheckCircle, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Student Verification System</h1>
            <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Admin Login
            </Link>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 relative">
          <div className="lg:flex lg:items-center lg:space-x-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Student ID Verification
                <span className="block text-blue-200">Made Simple</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-2xl lg:mx-0 mx-auto">
                Verify your student ID quickly and securely with our streamlined verification system.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-700 font-bold shadow-lg hover:shadow-xl transform transition duration-300 hover:-translate-y-1"
                >
                  Verify Now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-blue-500 bg-opacity-30 text-white font-bold border border-blue-300 border-opacity-50 backdrop-blur-sm hover:bg-opacity-40 transform transition duration-300 hover:-translate-y-1"
                >
                  Get Help
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="relative">
                  {/* ID Card Mockup */}
                  <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 transition-transform duration-500 hover:rotate-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-md">NUSA</span>
                      </div>
                      <div className="text-right">
                        <h3 className="text-lg font-bold text-gray-800">STUDENT ID</h3>
                        <p className="text-sm text-gray-500">2025-2026</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      <div className="w-24 h-32 bg-gray-200 rounded-lg mr-4"></div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">STUDENT NAME</h4>
                        <p className="text-sm text-gray-600">Program Name</p>
                        <p className="text-sm text-gray-600 mt-2">ID: 2025XXXXXX</p>
                        <p className="text-sm text-gray-600">Token: XXXXXX</p>
                        <div className="mt-4 w-20 h-8 bg-blue-600 rounded-md"></div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <p className="text-xs text-gray-500">Valid until: xx/xx/xxxx</p>
                      <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Our verification system is designed to be simple, secure, and efficient.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Secure Verification</h3>
              <p className="mt-2 text-gray-500">
                Enter your token number to securely verify your identity with our system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Quick Confirmation</h3>
              <p className="mt-2 text-gray-500">
                Confirm your identity with a simple click and get instant verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Report Issues</h3>
              <p className="mt-2 text-gray-500">
                If there's a discrepancy, easily report it and get in touch with administrators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Student Verification System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
