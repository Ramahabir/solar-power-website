"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, ThermometerSun, Thermometer } from "lucide-react"
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

const status = [
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
  const [predictionData, setPredictionData] = useState([]);
  const [stats, setStats] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/predict")
      .then(res => res.json())
      .then(json => {
        setPredictionData(json.data)
      })
      .catch((err) => {
        console.error("Failed to fetch prediction data", err)
      })
  }, [])
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard overview.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 text-green-800 rounded-full w-fit text-sm font-medium ">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {status.map((status) => {
          const Icon = status.icon
          return (
            <Card key={status.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {status.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status.value}</div>
                <p className="text-xs text-muted-foreground">
                  {status.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-span-4 grid-rows-1 gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Energy Prediction</CardTitle>
            <CardDescription>24 Hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="predicted_power" stroke="#4f46e5" strokeWidth={2}  name="Energy" />
                  <Legend verticalAlign="bottom" height={36}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>      
    </div>
  )
}
