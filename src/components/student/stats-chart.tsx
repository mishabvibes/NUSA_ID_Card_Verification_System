"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Stats {
  total: number
  verified: number
  pending: number
  rejected: number
  verificationRate: number
}

export function StatsChart({ stats }: { stats: Stats }) {
  const data = [
    {
      name: "Verified",
      value: stats.verified,
      color: "#22c55e"
    },
    {
      name: "Pending",
      value: stats.pending,
      color: "#eab308"
    },
    {
      name: "Rejected",
      value: stats.rejected,
      color: "#ef4444"
    }
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
          label={{ position: "top" }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
