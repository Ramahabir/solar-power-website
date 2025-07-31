"use client"

import { useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function ChatDialog() {
  const [messages, setMessages] = useState<{ type: "user" | "bot"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message
    setMessages(prev => [...prev, { type: "user", content: userMessage }])
    
    // Send message to chatbot API
    setIsLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot")
      }

      const data = await response.json()
      setMessages(prev => [...prev, { type: "bot", content: data.response }])
    } catch (error) {
      console.error("Chat API error:", error)
      setMessages(prev => [...prev, { 
        type: "bot", 
        content: "Sorry, I'm having trouble connecting right now. Please try again later." 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solar Power Assistant</DialogTitle>
        </DialogHeader>
        <div className="flex h-[400px] flex-col gap-4">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-md bg-secondary/20">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend()
                }
              }}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading}>
              <Send className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
