"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Users, DollarSign, TrendingUp, Sun, ThermometerSun, Thermometer } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 240 },
  { name: "Tue", value: 139 },
  { name: "Wed", value: 980 },
  { name: "Thu", value: 390 },
  { name: "Fri", value: 380 },
  { name: "Sat", value: 430 },
  { name: "Sun", value: 310 },
];

const stats = [
  {
    title: "Irradiance",
    value: "45 W/m²",
    description: "20.1% from last month",
    icon: Sun,
  },
  {
    title: "Ambient Temperature",
    value: "27 °C",
    description: "+180 new users",
    icon: ThermometerSun,
  },
  {
    title: "Module temperature",
    value: "25 °C",
    description: "+19% increase",
    icon: Thermometer,
  },
    {
    title: "dummy",
    value: "25 °C",
    description: "+19% increase",
    icon: Thermometer,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard overview.
          </p>
        </div>
          <div className="flex items-center gap-2 px-3 py-1 text-green-800 rounded-full w-fit text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-span-4 grid-rows-1 gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Energy Output</CardTitle>
            <CardDescription>Last 7 Days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>      
    </div>
  )
}
