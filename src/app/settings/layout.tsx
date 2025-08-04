import { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Settings - Solar Power Dashboard",
  description: "Configure your solar panel specifications and IoT sensor settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout 
      title="Settings"
      description="Configure your solar panel specifications and IoT sensor settings."
    >
      {children}
    </AppLayout>
  )
}
