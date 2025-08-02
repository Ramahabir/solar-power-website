import { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Analytics - Solar Power Dashboard",
  description: "Real-time analytics and monitoring for solar power systems",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout 
      title="Analytics" 
      description="Real-time analytics and monitoring for solar power systems"
    >
      {children}
    </AppLayout>
  );
}