import Link from "next/link"
import { LucideIcon, PanelLeft, PanelLeftClose } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: LucideIcon
  }[]
  collapsed?: boolean
  onToggleCollapse?: () => void
  showToggleButton?: boolean
}

export function SidebarNav({ 
  className, 
  items, 
  collapsed = false, 
  onToggleCollapse,
  showToggleButton = false,
  ...props 
}: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Toggle button at the top of sidebar */}
      {showToggleButton && onToggleCollapse && (
        <div className={cn("mb-4", collapsed ? "flex justify-center" : "flex justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
      )}
      
      {/* Navigation items */}
      <nav
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
        )}
        {...props}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              collapsed ? "justify-center w-10 h-10 p-0" : "justify-start",
              "transition-all duration-200"
            )}
            onClick={props.onClick}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
            {!collapsed && item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
