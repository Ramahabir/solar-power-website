"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Sun, Thermometer, Zap } from "lucide-react";
import { ChatDialog } from "@/components/chat/chat-dialog";

// Mock data generator for solar analytics
const generateMockData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate realistic solar patterns
    const baseIrradiance = hour >= 6 && hour <= 18 
      ? Math.sin(((hour - 6) / 12) * Math.PI) * 800 + Math.random() * 100
      : Math.random() * 50;
    
    const moduleTemp = hour >= 6 && hour <= 18 
      ? 25 + (baseIrradiance / 1000) * 35 + Math.random() * 5
      : 15 + Math.random() * 5;
    
    const ambientTemp = hour >= 6 && hour <= 18 
      ? 20 + Math.sin(((hour - 6) / 12) * Math.PI) * 15 + Math.random() * 3
      : 12 + Math.random() * 3;

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      irradiance: Math.max(0, baseIrradiance),
      moduleTemperature: moduleTemp,
      ambientTemperature: ambientTemp,
      powerOutput: Math.max(0, (baseIrradiance / 1000) * 250 + Math.random() * 20),
    });
  }
  
  return data;
};

// Mock data for daily summary
const generateDailyData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgIrradiance: 400 + Math.random() * 400,
      maxModuleTemp: 45 + Math.random() * 15,
      avgAmbientTemp: 25 + Math.random() * 10,
      totalEnergy: 15 + Math.random() * 10,
    });
  }
  
  return data;
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d">("24h");
  const [realTimeData, setRealTimeData] = useState(generateMockData(24));
  const [dailyData, setDailyData] = useState(generateDailyData(7));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchApiData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:8000/predict");
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        setError("No prediction data available.");
        return;
      }

      // Transform API data to match our chart format
      const transformedData = data.data.map((item: any) => ({
        time: new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(item.time).getTime(),
        irradiance: item.irradiance,
        moduleTemperature: item.module_temperature,
        ambientTemperature: item.ambient_temperature,
        powerOutput: item.predicted_power,
      }));

      setRealTimeData(transformedData);
    } catch (err) {
      setError("Failed to fetch prediction data");
      console.error("Failed to fetch prediction data", err);
      // Fallback to mock data if API fails
      setRealTimeData(generateMockData(24));
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (timeRange === "24h") {
      fetchApiData();
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRange === "24h") {
        fetchApiData();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  // Update data when time range changes
  useEffect(() => {
    switch (timeRange) {
      case "24h":
        fetchApiData();
        break;
      case "7d":
        setDailyData(generateDailyData(7));
        break;
    }
  }, [timeRange]);

  const currentData = timeRange === "24h" ? realTimeData : dailyData;
  const latestReading = realTimeData[realTimeData.length - 1];

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && timeRange === "24h" && (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">Loading prediction data...</div>
        </div>
      )}

      {/* Error State */}
      {error && timeRange === "24h" && (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-red-500">Error: {error}</div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm font-medium">Time Range:</span>
          <div className="flex space-x-1">
            {(["24h", "7d"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                disabled={loading && range === "24h"}
              >
                {range === "24h" ? "24 Hours" : "7 Days"}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Data Source Indicator */}
        {timeRange === "24h" && (
          <div className="flex items-center gap-2 px-3 py-1 text-green-800 rounded-full text-xs font-medium bg-green-100">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            {error ? "Mock Data" : "Live API Data"}
          </div>
        )}
      </div>

      {/* Current Metrics Cards */}
      {timeRange === "24h" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Irradiance</CardTitle>
              <Sun className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.irradiance.toFixed(1)} W/m²
              </div>
              <p className="text-xs text-muted-foreground">
                Solar irradiance level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Module Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.moduleTemperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                Solar panel temperature
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ambient Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.ambientTemperature.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                Environmental temperature
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Power Output</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.powerOutput.toFixed(1)} kW
              </div>
              <p className="text-xs text-muted-foreground">
                Current power generation
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Irradiance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Solar Irradiance</CardTitle>
            <CardDescription>
              {timeRange === "24h" 
                ? "Real-time solar irradiance levels over 24 hours"
                : "Average daily irradiance over 7 days"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={timeRange === "24h" ? "time" : "date"}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number) => [`${value.toFixed(1)} W/m²`, "Irradiance"]}
                />
                <Area 
                  type="monotone" 
                  dataKey={timeRange === "24h" ? "irradiance" : "avgIrradiance"}
                  stroke="#f59e0b" 
                  fill="#fbbf24" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Monitoring</CardTitle>
            <CardDescription>
              {timeRange === "24h"
                ? "Module and ambient temperature comparison"
                : "Temperature trends over 7 days"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={timeRange === "24h" ? "time" : "date"}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}°C`, 
                    name === "moduleTemperature" || name === "maxModuleTemp" 
                      ? "Module Temperature" 
                      : "Ambient Temperature"
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={timeRange === "24h" ? "moduleTemperature" : "maxModuleTemp"}
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Module Temperature"
                />
                <Line 
                  type="monotone" 
                  dataKey={timeRange === "24h" ? "ambientTemperature" : "avgAmbientTemp"}
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Ambient Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      {timeRange !== "24h" && (
        <Card>
          <CardHeader>
            <CardTitle>Energy Production Overview</CardTitle>
            <CardDescription>
              Daily energy generation over 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} kWh`, "Energy Generated"]}
                />
                <Bar dataKey="totalEnergy" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Real-time Power Output Chart for 24h view */}
      {timeRange === "24h" && (
        <Card>
          <CardHeader>
            <CardTitle>Power Output</CardTitle>
            <CardDescription>
              Real-time power generation over 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number) => [`${value.toFixed(1)} kW`, "Power Output"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="powerOutput"
                  stroke="#10b981" 
                  fill="#34d399" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      <ChatDialog />
    </div>

  );
}