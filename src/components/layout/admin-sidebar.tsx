"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Users, Upload, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const links = [
    {
      href: "/admin@124nusaonly",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/admin@124nusaonly/students",
      label: "Students",
      icon: <Users size={20} />,
    },
    {
      href: "/admin@124nusaonly/upload",
      label: "CSV Upload",
      icon: <Upload size={20} />,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={closeSidebar}
            className="md:hidden p-1 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    pathname === link.href ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                  }`}
                  onClick={closeSidebar}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/admin@124nusaonly/login" })}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}
