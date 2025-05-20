"use client"

import { useState } from "react"
import type { Student } from "@/types"
import { StatusBadge } from "../ui/status-badge"
import { Pagination } from "../ui/pagination"
import { Modal } from "../ui/modal"
import { StudentForm } from "./student-form"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Edit, Trash2 } from "lucide-react"

interface StudentTableProps {
  students: Student[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export function StudentTable({ students, pagination, onPageChange, onRefresh }: StudentTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setIsEditModalOpen(true)
  }

  const handleDelete = (student: Student) => {
    setDeletingStudent(student)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingStudent) return

    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`/api/students/${deletingStudent.tokenNumber}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete student")
      }

      setIsDeleteModalOpen(false)
      onRefresh()
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Token Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {student.tokenNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <StatusBadge status={student.verificationStatus} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`Edit ${student.name}`}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Delete ${student.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={onPageChange} />

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student">
        {editingStudent && (
          <StudentForm
            student={editingStudent}
            onSuccess={() => {
              setIsEditModalOpen(false)
              onRefresh()
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Student">
        <div className="space-y-4">
          {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <span className="font-medium text-gray-900">{deletingStudent?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? <LoadingSpinner className="h-5 w-5" /> : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
