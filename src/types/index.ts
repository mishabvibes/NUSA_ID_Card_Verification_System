export interface Student {
  _id: string
  tokenNumber: number
  name: string
  verificationStatus: "Pending" | "Verified" | "Rejected"
  createdAt: string
  updatedAt: string
}

export interface Stats {
  total: number
  verified: number
  pending: number
  rejected: number
  verificationRate: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StudentsResponse {
  students: Student[]
  pagination: Pagination
}

export interface CSVUploadResult {
  added: number
  updated: number
  skipped: number
  errors: string[]
}
