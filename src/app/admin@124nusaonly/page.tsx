"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/student/stats-cards"
import { StatsChart } from "@/components/student/stats-chart"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
  BarChart3,
  PieChart,
  LineChart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CalendarDays,
  Download,
  RefreshCw,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  MoreHorizontal,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"

interface Student {
  tNo: number
  name: string
  verificationStatus: "Pending" | "Verified" | "Rejected"
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [date, setDate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    verificationRate: 0,
  })
  const itemsPerPage = 5

  const fetchStudents = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/students")
      if (!response.ok) throw new Error("Failed to fetch students")
      const data = await response.json()
      setStudents(data.students)
      setFilteredStudents(data.students)
      setStats({
        total: data.students.length,
        verified: data.students.filter((s: Student) => s.verificationStatus === "Verified").length,
        pending: data.students.filter((s: Student) => s.verificationStatus === "Pending").length,
        rejected: data.students.filter((s: Student) => s.verificationStatus === "Rejected").length,
        verificationRate:
          data.students.length > 0
            ? (data.students.filter((s: Student) => s.verificationStatus === "Verified").length /
                data.students.length) *
              100
            : 0,
      })
    } catch (error) {
      console.error("Error fetching students:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch students")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    let filtered = students
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.tNo.toString().includes(searchTerm)
      )
    }
    if (activeTab === "verification") {
      filtered = filtered.filter((student) => student.verificationStatus === "Pending")
    }
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, activeTab, students])

  const handleVerify = async (tNo: number) => {
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tNo, verificationStatus: "Verified" }),
      })
      if (!response.ok) throw new Error("Failed to verify student")
      toast.success("Student verified successfully")
      fetchStudents()
    } catch (error) {
      console.error("Error verifying student:", error)
      toast.error("Failed to verify student")
    }
  }

  const handleReject = async (tNo: number) => {
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tNo, verificationStatus: "Rejected" }),
      })
      if (!response.ok) throw new Error("Failed to reject student")
      toast.success("Student rejected successfully")
      fetchStudents()
    } catch (error) {
      console.error("Error rejecting student:", error)
      toast.error("Failed to reject student")
    }
  }

  const handleRefresh = async () => {
    await fetchStudents()
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) return diffDay === 1 ? "yesterday" : `${diffDay} days ago`
    if (diffHour > 0) return diffHour === 1 ? "1 hour ago" : `${diffHour} hours ago`
    if (diffMin > 0) return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`
    return "just now"
  }

  const formatDueDate = (date: Date) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === now.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
      case "Rejected":
        return <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
      case "Pending":
        return <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
      default:
        return <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
    }
  }

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-blue-100 text-blue-800",
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          colors[priority as keyof typeof colors]
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = ["Token Number", "Name", "Verification Status"]
    const csvData = filteredStudents.map((student) => [
      student.tNo,
      student.name,
      student.verificationStatus,
    ])
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "students.csv")
    link.click()
  }

  const totalPages = Math.ceil(
    filteredStudents.filter((s) => activeTab !== "verification" || s.verificationStatus === "Pending")
      .length / itemsPerPage
  )
  const displayStudents = filteredStudents
    .filter((s) => activeTab !== "verification" || s.verificationStatus === "Pending")
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Overview of student verification status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 gap-1 sm:gap-1.5 shadow-sm hover:bg-gray-100"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""} sm:mr-2`}
            />
            <span className="hidden sm:inline text-xs sm:text-sm">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 shadow-sm hover:bg-gray-100"
            onClick={exportToCSV}
            aria-label="Export data"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline text-xs sm:text-sm">Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 px-2 relative shadow-sm hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white">
              {stats.pending}
            </span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-100 p-4 text-xs sm:text-sm text-red-700 flex items-center">
          <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="ml-3 sm:ml-4 h-7 sm:h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100"
            onClick={handleRefresh}
            aria-label="Retry fetching stats"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100/80 p-1 h-auto mb-4 sm:mb-6 grid grid-cols-3 sm:flex sm:justify-start rounded-lg">
              <TabsTrigger
                value="overview"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="verification"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Verification Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-4 sm:space-y-6">
              <StatsCards stats={stats} />

              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between py-2 sm:py-3 bg-gray-50/50">
                      <CardTitle className="text-base sm:text-lg font-medium">Verification Status</CardTitle>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 sm:h-8 px-2 text-gray-500 hover:bg-gray-100"
                          aria-label="Bar chart"
                        >
                          <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 sm:h-8 px-2 text-gray-500 hover:bg-gray-100"
                          aria-label="Line chart"
                        >
                          <LineChart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 sm:h-8 px-2 text-gray-500 hover:bg-gray-100"
                          aria-label="Pie chart"
                        >
                          <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 sm:pt-4 pb-2">
                      <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
                        <StatsChart stats={stats} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                  <CardHeader className="flex flex-row items-center justify-between py-2 sm:py-3 bg-gray-50/50">
                    <CardTitle className="text-base sm:text-lg font-medium">Recent Activity</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 hover:bg-gray-100"
                      aria-label="More activity options"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-2 sm:pt-3">
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner />
                      </div>
                    ) : error ? (
                      <div className="text-xs sm:text-sm text-red-700 flex items-center justify-center py-4">
                        <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                        {error}
                      </div>
                    ) : students.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-3">
                        {students.slice(0, 3).map((student) => (
                          <div
                            key={student.tNo}
                            className="flex items-start pb-3 sm:pb-4 last:pb-0 border-b last:border-0 border-gray-100 transition-all duration-200 hover:bg-gray-50/50"
                          >
                            <div className="mr-2 sm:mr-3 mt-0.5 bg-gray-100 p-1 sm:p-1.5 rounded-full">
                              {getActivityIcon(student.verificationStatus)}
                            </div>
                            <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {student.verificationStatus === "Verified"
                                  ? "Student Verified"
                                  : student.verificationStatus === "Rejected"
                                  ? "Student Rejected"
                                  : "New Registration"}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {student.name} (#{student.tNo})
                              </p>
                              <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 inline-block" />
                                {getRelativeTime(new Date())}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-gray-500 text-center py-4">
                        No recent activities
                      </div>
                    )}
                    <div className="mt-3 sm:mt-4 pt-2 border-t border-gray-100">
                      <Link
                        href="/admin@124nusaonly/activity"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center justify-center transition-colors duration-200"
                      >
                        View all activity
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between py-2 sm:py-3 bg-gray-50/50">
                      <CardTitle className="text-base sm:text-lg font-medium">Pending Verifications</CardTitle>
                      <Link href="/admin@124nusaonly/students?filter=pending">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 sm:h-8 text-xs sm:text-sm rounded-md shadow-sm hover:bg-gray-100"
                          aria-label="View all pending verifications"
                        >
                          View All
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent className="pt-3 sm:pt-4">
                      {loading ? (
                        <div className="flex justify-center py-4">
                          <LoadingSpinner />
                        </div>
                      ) : error ? (
                        <div className="text-xs sm:text-sm text-red-700 flex items-center justify-center py-4">
                          <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                          {error}
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-3 sm:ml-4 h-7 sm:h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={handleRefresh}
                            aria-label="Retry fetching tasks"
                          >
                            Retry
                          </Button>
                        </div>
                      ) : displayStudents.length > 0 ? (
                        <>
                          <div className="md:hidden space-y-3 sm:space-y-4">
                            {displayStudents.map((student) => (
                              <div
                                key={student.tNo}
                                className="p-3 sm:p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start">
                                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mb-2 sm:mb-0 sm:mr-4">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${student.tNo % 70}`} />
                                    <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                                      {student.name}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-600">#{student.tNo}</p>
                                    <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                                      <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                      {formatDueDate(new Date())}
                                    </div>
                                    <PriorityBadge priority="medium" />
                                    <div className="flex gap-1 sm:gap-2 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 shadow-sm"
                                        aria-label={`View details for ${student.name}`}
                                      >
                                        Details
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-sm"
                                        onClick={() => handleVerify(student.tNo)}
                                        aria-label={`Verify ${student.name}`}
                                      >
                                        Verify
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-sm"
                                        onClick={() => handleReject(student.tNo)}
                                        aria-label={`Reject ${student.name}`}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50 sticky top-0 shadow-sm">
                                <tr className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                  <th className="text-left pl-3 sm:pl-4 pr-2 py-2 sm:py-3">Student</th>
                                  <th className="text-left px-2 py-2 sm:py-3">ID</th>
                                  <th className="text-left px-2 py-2 sm:py-3">Due Date</th>
                                  <th className="text-left px-2 py-2 sm:py-3">Priority</th>
                                  <th className="text-right pr-3 sm:pr-4 pl-2 py-2 sm:py-3">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {displayStudents.map((student) => (
                                  <tr
                                    key={student.tNo}
                                    className="hover:bg-indigo-50 transition-colors duration-200"
                                  >
                                    <td className="pl-3 sm:pl-4 pr-2 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">
                                      {student.name}
                                    </td>
                                    <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                                      #{student.tNo}
                                    </td>
                                    <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm">
                                      <div className="flex items-center text-gray-700">
                                        <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 text-gray-500" />
                                        {formatDueDate(new Date())}
                                      </div>
                                    </td>
                                    <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm">
                                      <PriorityBadge priority="medium" />
                                    </td>
                                    <td className="pr-3 sm:pr-4 pl-2 py-2 sm:py-3 text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 sm:h-8 w-7 sm:w-8 p-0 hover:bg-indigo-100"
                                            aria-label={`Actions for ${student.name}`}
                                          >
                                            <svg
                                              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v.01M12 12v.01M12 18v.01"
                                              />
                                            </svg>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="flex items-center gap-2 text-xs sm:text-sm"
                                          >
                                            <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> View
                                            Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleVerify(student.tNo)}
                                            className="flex items-center gap-2 text-xs sm:text-sm text-green-600"
                                          >
                                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Verify
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => handleReject(student.tNo)}
                                            className="flex items-center gap-2 text-xs sm:text-sm text-red-600"
                                          >
                                            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Reject
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {totalPages > 1 && (
                            <div className="border-t border-gray-200 pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                              <div className="flex justify-between sm:hidden">
                                <Button
                                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                  disabled={currentPage === 1}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 px-2 sm:px-3 shadow-sm"
                                  aria-label="Previous page"
                                >
                                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <span className="text-xs sm:text-sm text-gray-700">
                                  {currentPage} of {totalPages}
                                </span>
                                <Button
                                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                  disabled={currentPage === totalPages}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 px-2 sm:px-3 shadow-sm"
                                  aria-label="Next page"
                                >
                                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                              <div className="hidden sm:flex sm:items-center sm:gap-3 sm:flex-wrap">
                                <span className="text-xs sm:text-sm text-gray-700">
                                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                  {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
                                  {filteredStudents.length} tasks
                                </span>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <Button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 rounded-l-md hover:bg-indigo-100"
                                    aria-label="Previous page"
                                  >
                                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    let pageNum
                                    if (totalPages <= 5) {
                                      pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                      pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNum = totalPages - 4 + i
                                    } else {
                                      pageNum = currentPage - 2 + i
                                    }
                                    return (
                                      <Button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNum)}
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="sm"
                                        className={`
                                          h-7 sm:h-8 w-7 sm:w-9 text-xs sm:text-sm
                                          ${
                                            pageNum === currentPage
                                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                              : "text-gray-600 hover:bg-indigo-100"
                                          }
                                        `}
                                        aria-label={`Go to page ${pageNum}`}
                                      >
                                        {pageNum}
                                      </Button>
                                    )
                                  })}
                                  <Button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 rounded-r-md hover:bg-indigo-100"
                                    aria-label="Next page"
                                  >
                                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </nav>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center py-4">
                          No tasks found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                  <CardHeader className="flex flex-row items-center justify-between py-2 sm:py-3 bg-gray-50/50">
                    <CardTitle className="text-base sm:text-lg font-medium">Calendar</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 sm:h-8 w-7 sm:w-8 p-0 hover:bg-gray-100"
                      aria-label="Calendar settings"
                    >
                      <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md w-full max-w-[280px] sm:max-w-none mx-auto"
                    />
                    <div className="mt-3 sm:mt-4 space-y-2">
                      <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Events Today
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md border border-gray-100 bg-gray-50/50">
                        <div className="h-5 w-1 rounded-full bg-green-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            Verification Deadline
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {stats.pending} tasks due
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                  <CardHeader className="py-2 sm:py-3 bg-gray-50/50">
                    <CardTitle className="text-base sm:text-lg font-medium">Verification Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                      <StatsChart stats={stats} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                  <CardHeader className="py-2 sm:py-3 bg-gray-50/50">
                    <CardTitle className="text-base sm:text-lg font-medium">Processing Time</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center text-gray-500">
                      <p className="text-xs sm:text-sm">Processing time analytics will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                <CardHeader className="py-2 sm:py-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg font-medium">Verification Analytics</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 sm:h-8 gap-1 sm:gap-1.5 shadow-sm hover:bg-gray-100"
                      onClick={exportToCSV}
                      aria-label="Export analytics report"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Export Report</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-sm">
                        <div className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1">
                          Average Time to Verify
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">2.4 days</div>
                        <div className="flex items-center mt-1 sm:mt-2 text-[10px] sm:text-sm text-green-600">
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          12% improvement
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-sm">
                        <div className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1">
                          Verification Rate
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">
                          {stats.verificationRate.toFixed(1)}%
                        </div>
                        <div className="flex items-center mt-1 sm:mt-2 text-[10px] sm:text-sm text-green-600">
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          3.2% improvement
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-sm">
                        <div className="text-[10px] sm:text-sm font-medium text-gray-500 mb-1">
                          Rejection Rate
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold">
                          {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%
                        </div>
                        <div className="flex items-center mt-1 sm:mt-2 text-[10px] sm:text-sm text-red-600">
                          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          3.2% decrease
                        </div>
                      </div>
                    </div>
                    <div className="h-[150px] sm:h-[200px] border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                      <p className="text-xs sm:text-sm">Detailed analytics visualization will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="mt-0 space-y-4 sm:space-y-6">
              <Card className="border border-gray-200 shadow-sm sm:shadow-md rounded-lg">
                <CardHeader className="py-2 sm:py-3 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <CardTitle className="text-base sm:text-lg font-medium">
                    Pending Verification Requests
                  </CardTitle>
                  <div className="relative w-full sm:w-[200px] md:w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-8 sm:h-9 w-full rounded-md border border-gray-300 pl-8 sm:pl-9 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Search verification tasks"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-3 sm:pt-4">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : error ? (
                    <div className="text-xs sm:text-sm text-red-700 flex items-center justify-center py-4">
                      <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                      {error}
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-3 sm:ml-4 h-7 sm:h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100"
                        onClick={handleRefresh}
                        aria-label="Retry fetching tasks"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : displayStudents.length > 0 ? (
                    <>
                      <div className="md:hidden space-y-3 sm:space-y-4">
                        {displayStudents.map((student) => (
                          <div
                            key={student.tNo}
                            className="p-3 sm:p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start">
                              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mb-2 sm:mb-0 sm:mr-4">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${student.tNo % 70}`} />
                                <AvatarFallback>{student.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">
                                  {student.name}
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-600">#{student.tNo}</p>
                                <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                                  <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                                  {formatDueDate(new Date())}
                                </div>
                                <PriorityBadge priority="medium" />
                                <div className="flex gap-1 sm:gap-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 shadow-sm"
                                    aria-label={`View details for ${student.name}`}
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 bg-green-600 text-white hover:bg-green-700 border-green-600 shadow-sm"
                                    onClick={() => handleVerify(student.tNo)}
                                    aria-label={`Verify ${student.name}`}
                                  >
                                    Verify
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 text-[10px] sm:text-xs flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600 shadow-sm"
                                    onClick={() => handleReject(student.tNo)}
                                    aria-label={`Reject ${student.name}`}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0 shadow-sm">
                            <tr className="text-[10px] sm:text-xs text-gray-500 font-medium">
                              <th className="text-left pl-3 sm:pl-4 pr-2 py-2 sm:py-3">Student</th>
                              <th className="text-left px-2 py-2 sm:py-3">ID</th>
                              <th className="text-left px-2 py-2 sm:py-3">Due Date</th>
                              <th className="text-left px-2 py-2 sm:py-3">Priority</th>
                              <th className="text-right pr-3 sm:pr-4 pl-2 py-2 sm:py-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {displayStudents.map((student) => (
                              <tr
                                key={student.tNo}
                                className="hover:bg-indigo-50 transition-colors duration-200"
                              >
                                <td className="pl-3 sm:pl-4 pr-2 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">
                                  {student.name}
                                </td>
                                <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                                  #{student.tNo}
                                </td>
                                <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm">
                                  <div className="flex items-center text-gray-700">
                                    <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5 text-gray-500" />
                                    {formatDueDate(new Date())}
                                  </div>
                                </td>
                                <td className="px-2 py-2 sm:py-3 text-xs sm:text-sm">
                                  <PriorityBadge priority="medium" />
                                </td>
                                <td className="pr-3 sm:pr-4 pl-2 py-2 sm:py-3 text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 sm:h-8 w-7 sm:w-8 p-0 hover:bg-indigo-100"
                                        aria-label={`Actions for ${student.name}`}
                                      >
                                        <svg
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v.01M12 12v.01M12 18v.01"
                                          />
                                        </svg>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="flex items-center gap-2 text-xs sm:text-sm"
                                      >
                                        <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> View
                                        Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleVerify(student.tNo)}
                                        className="flex items-center gap-2 text-xs sm:text-sm text-green-600"
                                      >
                                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Verify
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleReject(student.tNo)}
                                        className="flex items-center gap-2 text-xs sm:text-sm text-red-600"
                                      >
                                        <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Reject
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center justify-center py-4">
                      No tasks found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}