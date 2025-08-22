"use client"
import { useEffect, useState } from "react";
import { Sun, ThermometerSun, Thermometer, Zap, AlertTriangle, Cloud, Droplets, Leaf, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from "recharts";

// Variable
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

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  icon: React.ElementType;
}

interface FunStat {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

// Dashboard Page Component
export default function DashboardPage() {
  const [predictionData, setPredictionData] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [funStats, setFunStats] = useState<FunStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPower, setTotalPower] = useState(0)

  useEffect(() => {
    fetch("https://mlearning-746989509626.asia-south1.run.app/predict")
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

        // Generate alerts based on conditions
        const generatedAlerts: Alert[] = [];
        
        // Heatwave alert
        if (maxModule.module_temperature > 60) {
          generatedAlerts.push({
            id: 'heatwave',
            type: 'warning',
            title: 'High Temperature Alert',
            message: `Panel temperature reaching ${maxModule.module_temperature.toFixed(1)}°C. Monitor efficiency closely.`,
            icon: AlertTriangle,
          });
        }

        // Cloud forecast alert
        if (avgIrradiance < 300) {
          generatedAlerts.push({
            id: 'cloud-forecast',
            type: 'info',
            title: 'Cloudy Conditions',
            message: 'Lower irradiance detected. Energy output may be reduced today.',
            icon: Cloud,
          });
        }

        // Cleaning suggestion
        if (maxIrradiance.irradiance < 800 && avgIrradiance < 400) {
          generatedAlerts.push({
            id: 'cleaning',
            type: 'info',
            title: 'Maintenance Suggestion',
            message: 'Consider cleaning solar panels for optimal performance.',
            icon: Droplets,
          });
        }

        // High efficiency alert
        if (avgIrradiance > 600 && maxModule.module_temperature < 50) {
          generatedAlerts.push({
            id: 'optimal',
            type: 'success',
            title: 'Optimal Conditions',
            message: 'Perfect weather conditions for maximum energy generation!',
            icon: Sun,
          });
        }

        setAlerts(generatedAlerts);

        // Generate fun stats
        const co2Saved = (json.total_energy / 1000) * 0.4; // Approx 0.4kg CO2 per kWh
        const treesEquivalent = Math.round(co2Saved / 22); // 22kg CO2 per tree per year
        const housesSupplied = Math.round((json.total_energy / 1000) / 30); // 30 kWh per day average house

        setFunStats([
          {
            id: 'co2',
            title: 'CO₂ Saved Today',
            value: `${co2Saved.toFixed(1)}kg`,
            description: 'Environmental impact of your solar energy',
            icon: Leaf,
          },
          {
            id: 'trees',
            title: 'Trees Equivalent',
            value: `${treesEquivalent}`,
            description: 'Annual CO₂ absorption equivalent',
            icon: TrendingUp,
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

  // Dashboard Page Component
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

      {/* Alerts and Fun Stats Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Important notifications and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Sun className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">All systems operating normally</span>
              </div>
            ) : (
              alerts.map((alert) => {
                const Icon = alert.icon;
                const bgColor = alert.type === 'warning' ? 'bg-orange-50' : 
                               alert.type === 'success' ? 'bg-green-50' : 'bg-blue-50';
                const textColor = alert.type === 'warning' ? 'text-orange-800' : 
                                 alert.type === 'success' ? 'text-green-800' : 'text-blue-800';
                const iconColor = alert.type === 'warning' ? 'text-orange-600' : 
                                 alert.type === 'success' ? 'text-green-600' : 'text-blue-600';
                
                return (
                  <div key={alert.id} className={`flex items-start gap-3 p-3 ${bgColor} rounded-lg`}>
                    <Icon className={`h-4 w-4 mt-0.5 ${iconColor}`} />
                    <div>
                      <h4 className={`font-medium text-sm ${textColor}`}>{alert.title}</h4>
                      <p className={`text-xs ${textColor} opacity-80`}>{alert.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Fun Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Environmental Impact
            </CardTitle>
            <CardDescription>
              Your positive contribution to the planet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {funStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <Icon className="h-6 w-6 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-green-800">{stat.value}</span>
                      <span className="text-sm font-medium text-green-700">{stat.title}</span>
                    </div>
                    <p className="text-xs text-green-600">{stat.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-blue-800">
                    {((totalPower / 1000) / 30).toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-blue-700">Homes Powered</span>
                </div>
                <p className="text-xs text-blue-600">Daily energy equivalent</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  )
}
