import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Users, DollarSign, TrendingUp, Sun, ThermometerSun, Thermometer } from "lucide-react"

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

      {/* Add more dashboard content here */}
    </div>
  )
}
