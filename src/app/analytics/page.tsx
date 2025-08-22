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
import { CalendarDays, Sun, Thermometer, Zap, TrendingUp, TrendingDown, Activity } from "lucide-react";

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
      predictedPowerOutput: Math.max(0, (baseIrradiance / 1000) * 250 + Math.random() * 15),
      actualPowerOutput: Math.max(0, (baseIrradiance / 1000) * 245 + Math.random() * 25),
    });
  }
  
  return data;
};

// Generate future solar radiation predictions
const generateFutureSolarData = (hours: number = 12) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Predict future solar patterns based on weather forecast simulation
    const predictedIrradiance = hour >= 6 && hour <= 18 
      ? Math.sin(((hour - 6) / 12) * Math.PI) * 750 + Math.random() * 120
      : Math.random() * 40;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      type: 'future',
      irradiance: Math.max(0, predictedIrradiance),
      predictedPowerOutput: Math.max(0, (predictedIrradiance / 1000) * 250 + Math.random() * 15),
    });
  }
  
  return data;
};

// Generate 24-hour solar radiation forecast starting from 00:00
const generate24HourForecast = () => {
  const data = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Start from 00:00 tomorrow
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(tomorrow.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Predict solar patterns for full 24-hour cycle
    const predictedIrradiance = hour >= 6 && hour <= 18 
      ? Math.sin(((hour - 6) / 12) * Math.PI) * 750 + Math.random() * 120
      : Math.random() * 40;
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      fullTime: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      hour: hour,
      type: 'forecast',
      irradiance: Math.max(0, predictedIrradiance),
      predictedPowerOutput: Math.max(0, (predictedIrradiance / 1000) * 250 + Math.random() * 15),
    });
  }
  
  return data;
};

// Calculate trend analysis
const calculateTrendAnalysis = (currentData: any[], previousData: any[]) => {
  const currentWeekTotal = currentData.reduce((sum, item) => sum + (item.powerOutput || 0), 0);
  const previousWeekTotal = previousData.reduce((sum, item) => sum + (item.powerOutput || 0), 0);
  
  const percentageChange = previousWeekTotal > 0 
    ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100 
    : 0;
  
  const currentWeekAvgIrradiance = currentData.reduce((sum, item) => sum + (item.irradiance || 0), 0) / currentData.length;
  const previousWeekAvgIrradiance = previousData.reduce((sum, item) => sum + (item.irradiance || 0), 0) / previousData.length;
  
  const irradianceChange = previousWeekAvgIrradiance > 0
    ? ((currentWeekAvgIrradiance - previousWeekAvgIrradiance) / previousWeekAvgIrradiance) * 100
    : 0;

  return {
    powerChange: percentageChange,
    irradianceChange,
    isImproving: percentageChange > 0,
    currentWeekTotal,
    previousWeekTotal,
  };
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
  const [futureData, setFutureData] = useState(generateFutureSolarData(12));
  const [forecastData, setForecastData] = useState(generate24HourForecast());
  const [previousWeekData, setPreviousWeekData] = useState(generateMockData(24));
  const [loading, setLoading] = useState<boolean>(false);
  const [forecastLoading, setForecastLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);

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
        predictedPowerOutput: item.predicted_power,
        actualPowerOutput: item.predicted_power * (0.95 + Math.random() * 0.1), // Simulate actual vs predicted
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

  // Fetch forecast data from API for Solar Radiation Forecast
  const fetchForecastData = async () => {
    try {
      setForecastLoading(true);
      setForecastError(null);
      const response = await fetch("http://127.0.0.1:8000/predict");
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        setForecastError("No forecast data available.");
        setForecastData(generate24HourForecast()); // Fallback to mock data
        return;
      }

      // Transform API data for 24-hour forecast format
      const forecastTransformed = data.data.map((item: any, index: number) => {
        const time = new Date(item.time);
        const hour = time.getHours();
        
        return {
          time: `${hour.toString().padStart(2, '0')}:00`,
          fullTime: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timestamp: time.getTime(),
          hour: hour,
          type: 'forecast',
          irradiance: item.irradiance,
          predictedPowerOutput: item.predicted_power,
        };
      });

      // If we have less than 24 hours, extend with generated data
      if (forecastTransformed.length < 24) {
        const remaining = 24 - forecastTransformed.length;
        const generatedData = generate24HourForecast().slice(-remaining);
        setForecastData([...forecastTransformed, ...generatedData]);
      } else {
        setForecastData(forecastTransformed.slice(0, 24));
      }
    } catch (err) {
      setForecastError("Failed to fetch forecast data");
      console.error("Failed to fetch forecast data", err);
      // Fallback to mock data if API fails
      setForecastData(generate24HourForecast());
    } finally {
      setForecastLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (timeRange === "24h") {
      fetchApiData();
      fetchForecastData();
      setFutureData(generateFutureSolarData(24));
      setPreviousWeekData(generateMockData(24));
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRange === "24h") {
        fetchApiData();
        fetchForecastData();
        setFutureData(generateFutureSolarData(24));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  // Update data when time range changes
  useEffect(() => {
    switch (timeRange) {
      case "24h":
        fetchApiData();
        fetchForecastData();
        setFutureData(generateFutureSolarData(24));
        setPreviousWeekData(generateMockData(24));
        break;
      case "7d":
        setDailyData(generateDailyData(7));
        break;
    }
  }, [timeRange]);

  const currentData = timeRange === "24h" ? realTimeData : dailyData;
  const latestReading = realTimeData[realTimeData.length - 1];
  
  // Calculate trend analysis
  const trendAnalysis = calculateTrendAnalysis(realTimeData, previousWeekData);
  
  // Combine current and future data for the solar radiation chart
  const pastAndFutureData = [
    ...realTimeData.map(item => ({ ...item, type: 'past' })),
    ...futureData
  ];

  // Future-only data for forecast chart
  const futureOnlyData = forecastData;

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {(loading || forecastLoading) && timeRange === "24h" && (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-muted-foreground">
            {loading && forecastLoading ? "Loading prediction and forecast data..." :
             loading ? "Loading prediction data..." : "Loading forecast data..."}
          </div>
        </div>
      )}

      {/* Error State */}
      {(error || forecastError) && timeRange === "24h" && (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-red-500">
            {error && forecastError ? `Error: ${error}, ${forecastError}` :
             error ? `Error: ${error}` : `Forecast Error: ${forecastError}`}
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm font-medium">Time Range:</span>
          <div className="flex space-x-1">
            <Button
              variant="default"
              size="sm"
              onClick={() => setTimeRange("24h")}
              disabled={loading}
            >
              24 Hours
            </Button>
          </div>
        </div>
        
        {/* Data Source Indicator */}
        {timeRange === "24h" && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 text-green-800 rounded-full text-xs font-medium bg-green-100">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              {error ? "Mock Data" : "Live API Data"}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 text-blue-800 rounded-full text-xs font-medium bg-blue-100">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              {forecastError ? "Mock Forecast" : "API Forecast"}
            </div>
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

      {/* Trend Analysis Card */}
      {timeRange === "24h" && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                {trendAnalysis.isImproving ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <p className="text-lg font-semibold">
                    {trendAnalysis.isImproving ? "+" : ""}{trendAnalysis.powerChange.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Power output vs last week
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {trendAnalysis.currentWeekTotal.toFixed(1)} kWh
                </p>
                <p className="text-sm text-muted-foreground">
                  Total energy this week
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {trendAnalysis.irradianceChange >= 0 ? "+" : ""}{trendAnalysis.irradianceChange.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Solar irradiance change
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                💡 Insight: You're producing{" "}
                <span className="font-bold">
                  {Math.abs(trendAnalysis.powerChange).toFixed(1)}%{" "}
                  {trendAnalysis.isImproving ? "more" : "less"}
                </span>{" "}
                energy this week compared to last week!
                {trendAnalysis.isImproving && " Keep up the great work! 🌞"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Future Solar Radiation Forecast Line Chart */}
        {timeRange === "24h" && (
          <Card>
            <CardHeader>
              <CardTitle>Solar Radiation Forecast</CardTitle>
              <CardDescription>
                {forecastError 
                  ? "24-hour solar radiation prediction (Mock data - API unavailable)"
                  : "24-hour solar radiation prediction from API (Live data)"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={futureOnlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(label) => `Time: ${label}`}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)} W/m²`, 
                      name === 'irradiance' ? 'Predicted Solar Radiation' : name
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="irradiance"
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Predicted Solar Radiation"
                    strokeDasharray="5,5"
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Temperature Monitoring Chart */}
        {timeRange === "24h" && (
          <Card>
            <CardHeader>
              <CardTitle>Temperature Monitoring</CardTitle>
              <CardDescription>
                Module and ambient temperature comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(label) => `Time: ${label}`}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}°C`, 
                      name === "moduleTemperature" 
                        ? "Module Temperature" 
                        : "Ambient Temperature"
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="moduleTemperature"
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Module Temperature"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ambientTemperature"
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Ambient Temperature"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Original Irradiance Chart for 7d view */}
        {timeRange === "7d" && (
          <Card>
            <CardHeader>
              <CardTitle>Solar Irradiance</CardTitle>
              <CardDescription>
                Average daily irradiance over 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value: number) => [`${value.toFixed(1)} W/m²`, "Irradiance"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgIrradiance"
                    stroke="#f59e0b" 
                    fill="#fbbf24" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
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

      {/* Predicted vs Actual Power Output Chart for 24h view */}
      {timeRange === "24h" && (
        <Card>
          <CardHeader>
            <CardTitle>Predicted vs Actual Power Output</CardTitle>
            <CardDescription>
              Comparison of predicted and actual solar power generation over 24 hours
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
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)} kW`, 
                    name === 'predictedPowerOutput' ? 'Predicted' : 'Actual'
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="predictedPowerOutput"
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Predicted Output"
                />
                <Area 
                  type="monotone" 
                  dataKey="actualPowerOutput"
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  name="Actual Output"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>

  );
}