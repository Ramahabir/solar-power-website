"use client"

import { useState } from "react"
import { LayoutDashboard, BarChart2, Settings, Menu, MessageCircle } from "lucide-react"
import { MainNav } from "@/components/layout/main-nav"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Insights",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    title: "Chatbot",
    href: "/chatbot",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <SidebarNav 
                    items={sidebarNavItems} 
                    className="w-full"
                    onClick={() => setSidebarOpen(false)}
                    showToggleButton={false}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <MainNav />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className={`container flex-1 items-start transition-all duration-300 ${
        desktopSidebarCollapsed 
          ? "md:grid-cols-[60px_1fr] lg:grid-cols-[60px_1fr]" 
          : "md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]"
      } md:grid md:gap-6 lg:gap-10`}>
        {/* Desktop Sidebar */}
        <aside className={`fixed top-20 z-30 -ml-2 h-[calc(100vh-5rem)] shrink-0 overflow-y-auto border-r transition-all duration-300 md:sticky ${
          desktopSidebarCollapsed 
            ? "hidden md:block md:w-[60px]" 
            : "hidden md:block md:w-full"
        }`}>
          <SidebarNav 
            className="p-4" 
            items={sidebarNavItems} 
            collapsed={desktopSidebarCollapsed}
            onToggleCollapse={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
            showToggleButton={true}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">
          {title && (
            <div className="flex items-center justify-between space-y-2 pb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
