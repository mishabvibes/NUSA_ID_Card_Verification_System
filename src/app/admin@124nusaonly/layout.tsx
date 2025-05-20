import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminLayout as AdminLayoutComponent } from "@/components/layout/admin-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutComponent>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </AdminLayoutComponent>
  );
}
