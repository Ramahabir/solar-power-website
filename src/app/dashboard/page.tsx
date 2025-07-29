import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2, Users, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    description: "+180 new users",
    icon: Users,
  },
  {
    title: "Sales",
    value: "12,234",
    description: "+19% increase",
    icon: TrendingUp,
  },
  {
    title: "Active Projects",
    value: "573",
    description: "12 completed this month",
    icon: BarChart2,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard overview.
        </p>
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
