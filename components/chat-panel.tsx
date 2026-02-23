"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Bot } from "lucide-react"
import { extractSymptoms } from "@/services/Text.Service"
import { forwardChaining } from "@/lib/engine"
import { DiagnosisCard } from "./diagnosis-card"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [diagnosis, setDiagnosis] = useState<{ diagnosis: string; explanation: string[] } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return

    // Extract symptoms from the input
    const detectedSymptoms = extractSymptoms(input)
    let updatedSymptoms = symptoms
    if (detectedSymptoms.length > 0) {
      updatedSymptoms = Array.from(new Set([...symptoms, ...detectedSymptoms]))
      setSymptoms(updatedSymptoms)

      // Run the expert system engine
      const result = forwardChaining(updatedSymptoms)
      if (result.diagnosis !== "No diagnosis found") {
        setDiagnosis(result)
      } else {
        setDiagnosis(null)
      }
    }

    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "Thinking..." : "Online"}
          </p>
        </div>
      </header>

      {/* Symptoms Display */}
      {symptoms.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Extracted Symptoms:
          </span>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary animate-in zoom-in-95 duration-300"
              >
                {symptom}
              </span>
            ))}
            <button
              onClick={() => {
                setSymptoms([])
                setDiagnosis(null)
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                <Bot className="size-8 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                How can I help you today?
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Ask me anything. I&apos;m here to assist with questions, ideas,
                and more.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Bot className="size-4" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

              {diagnosis && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DiagnosisCard
                    diagnosis={diagnosis.diagnosis}
                    explanation={diagnosis.explanation}
                    onClear={() => {
                      setDiagnosis(null)
                      setSymptoms([])
                    }}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
