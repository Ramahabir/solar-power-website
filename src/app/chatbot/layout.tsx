import { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Chatbot - Solar Power Dashboard",
  description: "AI-powered solar energy assistant and chatbot",
};

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
