"use client"

import { useState, useEffect } from "react"
import type { Student, StudentsResponse, Stats } from "@/types"

export function useStudents(page = 1, limit = 10, status = "All", tokenNumber?: string) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<StudentsResponse | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)

        let url = `/api/students?page=${page}&limit=${limit}`

        if (status !== "All") {
          url += `&status=${status}`
        }

        if (tokenNumber) {
          url += `&tokenNumber=${tokenNumber}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [page, limit, status, tokenNumber])

  return { data, loading, error }
}

interface StudentStats {
  total: number
  verified: number
  pending: number
  rejected: number
  verificationRate: number
}

interface Activity {
  id: string
  type: "verification" | "rejection" | "registration"
  studentName: string
  studentId: number
  timestamp: Date
  performedBy?: string
}

interface VerificationTask {
  id: string
  studentName: string
  studentId: number
  dueDate: Date
  priority: "high" | "medium" | "low"
}

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/students/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

export function useStudent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<Student | null>(null)

  const fetchStudent = async (tokenNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/students/${tokenNumber}`)
      if (!response.ok) {
        throw new Error('Student not found')
      }
      
      const data = await response.json()
      setStudent(data.student)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student')
      setStudent(null)
    } finally {
      setLoading(false)
    }
  }

  const verifyStudent = async (tokenNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/students/${tokenNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Verified' }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify student')
      }

      const data = await response.json()
      setStudent(data.student)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify student')
      return false
    } finally {
      setLoading(false)
    }
  }

  const reportStudent = async (tokenNumber: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/students/${tokenNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Reported' }),
      })

      if (!response.ok) {
        throw new Error('Failed to report student')
      }

      const data = await response.json()
      setStudent(data.student)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to report student')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    student,
    loading,
    error,
    fetchStudent,
    verifyStudent,
    reportStudent,
  }
}

export function useRecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/students/activities")
        if (!response.ok) throw new Error("Failed to fetch activities")
        const data = await response.json()
        setActivities(data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })))
        setError(null)
      } catch (error) {
        console.error("Error fetching activities:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch activities")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading, error }
}

export function useVerificationTasks(page: number = 1, limit: number = 5) {
  const [tasks, setTasks] = useState<VerificationTask[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/students/tasks?page=${page}&limit=${limit}`)
        if (!response.ok) throw new Error("Failed to fetch tasks")
        const data = await response.json()
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks.map((item: any) => ({
            ...item,
            dueDate: new Date(item.dueDate)
          })))
          setTotal(data.total)
        } else {
          throw new Error("Invalid response format")
        }
        setError(null)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch tasks")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [page, limit])

  return { tasks, total, loading, error }
}
