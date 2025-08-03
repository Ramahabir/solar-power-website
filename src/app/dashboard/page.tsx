"use client"
import { useEffect, useState } from "react";
import { Sun, ThermometerSun, Thermometer, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";
import { ChatDialog } from "@/components/chat/chat-dialog";

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

        const avgIrradiance = json.data.reduce((sum: number, row: Prediction) => sum + row.irradiance, 0) / json.data.length;
        const avgAmbientTemp = json.data.reduce((sum: number, row: Prediction) => sum + row.ambient_temperature, 0) / json.data.length;
        const avgModuleTemp = json.data.reduce((sum: number, row: Prediction) => sum + row.module_temperature, 0) / json.data.length;
        const totalPredictedEnergy = json.data.reduce((sum: number, row: Prediction) => sum + row.predicted_power, 0);

        setStats([
          {
            title: "Peak Solar Irradiance",
            value: `${maxIrradiance.irradiance.toFixed(1)} W/m²`,
            description: `Avg: ${avgIrradiance.toFixed(1)} W/m² • Optimal conditions detected`,
            icon: Sun,
          },
          {
            title: "Environmental Temperature",
            value: `${maxAmbient.ambient_temperature.toFixed(1)}°C`,
            description: `Avg: ${avgAmbientTemp.toFixed(1)}°C • Weather impact analysis`,
            icon: ThermometerSun,
          },
          {
            title: "Panel Operating Temperature", 
            value: `${maxModule.module_temperature.toFixed(1)}°C`,
            description: `Avg: ${avgModuleTemp.toFixed(1)}°C • Efficiency monitoring`,
            icon: Thermometer,
          },
          {
            title: "Total Energy Forecast",
            value: `${(json.total_energy / 1000).toFixed(2)} kWh`,
            description: `${(totalPredictedEnergy / 1000).toFixed(1)} kWh accumulated • 24h projection`,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solar Energy Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time analytics and 24-hour energy predictions for optimal performance monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 text-green-800 rounded-full w-fit text-sm font-medium bg-green-50">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const iconColors = [
            "text-yellow-500", // Sun - yellow
            "text-blue-500",   // ThermometerSun - blue  
            "text-red-500",    // Thermometer - red
            "text-green-500"   // Zap - green
          ];
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${iconColors[index]}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
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
            <CardTitle className="text-lg font-semibold">Power Generation Analytics</CardTitle>
            <CardDescription>24-hour energy output predictions with performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" interval={0} tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} />
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
      <ChatDialog />
    </div>
  )
}
