"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, RefreshCw, Download, UserPlus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Student {
  tNo: number
  name: string
  verificationStatus: "Pending" | "Verified" | "Rejected"
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [usePagination, setUsePagination] = useState(true)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  })

  const itemsPerPage = 10

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
        rejected: data.students.filter((s: Student) => s.verificationStatus === "Rejected").length
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

  const handleDelete = async (tNo: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return
    try {
      const response = await fetch(`/api/students?tNo=${tNo}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete student")
      toast.success("Student deleted successfully")
      fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student")
    }
  }

  const handleEdit = async (student: Student) => {
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      })
      if (!response.ok) throw new Error("Failed to update student")
      toast.success("Student updated successfully")
      setEditingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error("Error updating student:", error)
      toast.error("Failed to update student")
    }
  }

  useEffect(() => {
    let filtered = students
    if (searchTerm) {
      filtered = filtered.filter(
        student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.tNo.toString().includes(searchTerm)
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.verificationStatus === statusFilter)
    }
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, students])

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const displayStudents = usePagination
    ? filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredStudents

  const exportToCSV = () => {
    const headers = ["Token Number", "Name", "Verification Status"]
    const csvData = filteredStudents.map(student => [student.tNo, student.name, student.verificationStatus])
    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "students.csv")
    link.click()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span className="font-medium">Error: {error}</span>
          </div>
          <Button
            className="mt-4 bg-red-100 text-red-700 hover:bg-red-200"
            onClick={fetchStudents}
            aria-label="Retry fetching students"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">Students Management</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">View and manage all registered students</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchStudents}
            variant="outline"
            className="flex-1 md:flex-none h-10 text-gray-600 md:shadow-sm md:hover:bg-gray-100"
            disabled={isRefreshing}
            aria-label="Refresh students list"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''} md:mr-2`} />
            <span className="hidden md:inline">Refresh</span>
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex-1 md:flex-none h-10 text-gray-600 md:shadow-sm md:hover:bg-gray-100"
            aria-label="Export students to CSV"
          >
            <Download className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button
            className="flex-1 md:flex-none h-10 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white md:shadow-md md:hover:from-indigo-700 md:hover:to-indigo-900"
            aria-label="Add new student"
          >
            <UserPlus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Student</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {[
          { title: "Total Students", value: stats.total, color: "text-gray-900", bg: "bg-white" },
          { title: "Verified", value: stats.verified, color: "text-green-600", bg: "bg-green-50" },
          { title: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Rejected", value: stats.rejected, color: "text-red-600", bg: "bg-red-50" }
        ].map(stat => (
          <Card
            key={stat.title}
            className={`shadow-sm hover:shadow-md transition-all duration-200 ${stat.bg} border border-gray-100 md:rounded-lg animate-fade-in`}
          >
            <CardHeader className="p-3 md:p-4">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              <div className={`text-lg md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 md:mb-6">
        {/* Mobile Filters */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border border-gray-300 w-full text-sm h-10 rounded-md"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="flex-1">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="Verified"
                className="px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Verified
              </TabsTrigger>
              <TabsTrigger
                value="Pending"
                className="px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="Rejected"
                className="px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border border-gray-300 text-base h-10 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      <Card className="bg-white border border-gray-200 md:shadow-md md:rounded-lg">
        <CardContent className="p-0">
          {/* Mobile List (Card-based) */}
          <div className="md:hidden flex flex-col divide-y divide-gray-200">
            {displayStudents.length > 0 ? (
              displayStudents.map(student => (
                <div key={student.tNo} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">#{student.tNo}</div>
                      <div className="text-sm text-gray-700">{student.name}</div>
                      <Badge
                        className={`
                          text-xs
                          ${student.verificationStatus === "Verified"
                            ? "bg-green-100 text-green-800"
                            : student.verificationStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"}
                        `}
                      >
                        <div className="flex items-center gap-1">
                          {student.verificationStatus === "Verified"
                            ? <CheckCircle className="h-3 w-3" />
                            : student.verificationStatus === "Rejected"
                            ? <XCircle className="h-3 w-3" />
                            : <AlertTriangle className="h-3 w-3" />}
                          {student.verificationStatus}
                        </div>
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editingStudent?.tNo === student.tNo} onOpenChange={(open) => !open && setEditingStudent(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                            className="h-10 px-3 text-gray-700"
                            aria-label={`Edit student ${student.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full max-w-md p-4">
                          <DialogHeader>
                            <DialogTitle>Edit Student</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Token Number</label>
                              <Input value={editingStudent?.tNo || ""} disabled className="bg-gray-50" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input
                                value={editingStudent?.name || ""}
                                onChange={(e) =>
                                  setEditingStudent((prev) => prev ? { ...prev, name: e.target.value } : null)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Status</label>
                              <Select
                                value={editingStudent?.verificationStatus || "Pending"}
                                onValueChange={(value: "Pending" | "Verified" | "Rejected") =>
                                  setEditingStudent((prev) => prev ? { ...prev, verificationStatus: value } : null)
                                }
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Verified">Verified</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => editingStudent && handleEdit(editingStudent)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(student.tNo)}
                        className="h-10 px-3 bg-red-600 hover:bg-red-700"
                        aria-label={`Delete student ${student.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Search className="h-8 w-8 text-gray-300 mb-2 mx-auto" />
                <p className="text-sm">No students found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Desktop List (Table-based) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayStudents.length > 0 ? (
                  displayStudents.map(student => (
                    <tr
                      key={student.tNo}
                      className="hover:bg-indigo-50 transition-colors animate-fade-in"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.tNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`
                            text-sm
                            ${student.verificationStatus === "Verified"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : student.verificationStatus === "Rejected"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"}
                            transition-colors
                          `}
                        >
                          <div className="flex items-center gap-1">
                            {student.verificationStatus === "Verified"
                              ? <CheckCircle className="h-4 w-4" />
                              : student.verificationStatus === "Rejected"
                              ? <XCircle className="h-4 w-4" />
                              : <AlertTriangle className="h-4 w-4" />}
                            {student.verificationStatus}
                          </div>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-indigo-100"
                              aria-label={`Actions for student ${student.name}`}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setEditingStudent(student)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student.tNo)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      <Search className="h-10 w-10 text-gray-300 mb-2 mx-auto" />
                      <p className="text-base">No students found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usePagination && filteredStudents.length > itemsPerPage && (
            <div className="border-t border-gray-200 p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Mobile Pagination */}
              <div className="flex justify-between md:hidden">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-10 px-3"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-700">{currentPage} of {totalPages}</span>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-10 px-3"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden md:flex md:items-center md:gap-4 justify-between w-full">
                <span className="text-sm text-gray-700 ">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
                </span>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-l-md hover:bg-indigo-100"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                          h-10 w-10 text-sm
                          ${pageNum === currentPage
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "text-gray-600 hover:bg-indigo-100"}
                        `}
                        aria-label={`Go to page ${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-r-md hover:bg-indigo-100"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          )}

          {/* Display Options */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs md:text-sm text-gray-600">Show all data</label>
              <input
                type="checkbox"
                checked={!usePagination}
                onChange={(e) => setUsePagination(!e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Total: <span className="font-medium">{filteredStudents.length}</span> students
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}