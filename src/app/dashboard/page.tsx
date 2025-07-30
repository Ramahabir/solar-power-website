"use client"
import { useEffect, useState } from "react";
import { Sun, ThermometerSun, Thermometer, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

interface Prediction {
  time: string;
  irradiance: number;
  ambient_temperature: number;
  module_temperature: number;
  predicted_power: number;
}

interface Stat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

export default function DashboardPage() {
  const [predictionData, setPredictionData] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPower, setTotalPower] = useState(0)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/predict")
      .then(res => res.json())
      .then(json => {
        if (!json.data || json.data.length === 0) {
          setError("No prediction data available.");
          setLoading(false);
          return;
        }
        setPredictionData(json.data);

        const latest = json.data[json.data.length - 1]; // use last item as latest
        setTotalPower(json.total_energy)

        const maxIrradiance = json.data.reduce(
          (max: Prediction, row: Prediction) =>
            row.irradiance > max.irradiance ? row : max,
          json.data[0]
        );

        const maxAmbient = json.data.reduce(
          (max: Prediction, row: Prediction) =>
            row.ambient_temperature > max.ambient_temperature ? row : max,
          json.data[0]
        );

        const maxModule = json.data.reduce(
          (max: Prediction, row: Prediction) =>
            row.module_temperature > max.module_temperature ? row : max,
          json.data[0]
        );

        const maxPower = json.data.reduce(
          (max: Prediction, row: Prediction) =>
            row.predicted_power > max.predicted_power ? row : max,
          json.data[0]
        );

        setStats([
          {
            title: "Irradiance",
            value: `${maxIrradiance.irradiance} W/m²`,
            description: "Highest irradiance",
            icon: Sun,
          },
          {
            title: "Ambient Temperature",
            value: `${maxAmbient.ambient_temperature} °C`,
            description: "Highest ambient temperature",
            icon: ThermometerSun,
          },
          {
            title: "Module Temperature",
            value: `${maxModule.module_temperature} °C`,
            description: "Highest module temperature",
            icon: Thermometer,
          },
          {
            title: "Predicted Power",
            value: `${json.total_energy} W`,
            description: "Total Predicted Power in 24 hours",
            icon: Zap,
          },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch prediction data");
        setLoading(false);
        console.error("Failed to fetch prediction data", err);
      });
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
